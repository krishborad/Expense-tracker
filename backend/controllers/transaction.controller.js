const Transaction = require('../models/transaction.model');

/**
 * GET /api/transactions
 * Get all transactions for the authenticated user
 * Supports query params: type, sortBy, order
 */
const getTransactions = async (req, res) => {
  try {
    const { type, sortBy = 'date', order = 'desc' } = req.query;

    // Build filter object
    const filter = { userId: req.user.id };
    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }

    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const transactions = await Transaction.find(filter).sort(sort);

    // Calculate summary statistics
    const allTransactions = await Transaction.find({ userId: req.user.id });
    const totalIncome = allTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = allTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      success: true,
      count: transactions.length,
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense
      },
      transactions
    });
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
};

/**
 * POST /api/transactions
 * Create a new transaction
 */
const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    // Validate required fields
    if (!type || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, amount, and category'
      });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either income or expense'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      amount: parseFloat(amount),
      category,
      description: description || '',
      date: date ? new Date(date) : new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      transaction
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('Create transaction error:', err);
    res.status(500).json({ success: false, message: 'Failed to create transaction' });
  }
};

/**
 * DELETE /api/transactions/:id
 * Delete a transaction by ID (only owner can delete)
 */
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id // Ensure user can only delete their own transactions
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found or unauthorized'
      });
    }

    await transaction.deleteOne();

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (err) {
    console.error('Delete transaction error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete transaction' });
  }
};

module.exports = { getTransactions, createTransaction, deleteTransaction };
