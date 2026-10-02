const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  deleteTransaction
} = require('../controllers/transaction.controller');
const { protect } = require('../middleware/auth.middleware');

// All transaction routes require authentication
router.use(protect);

router.route('/').get(getTransactions).post(createTransaction);

router.route('/:id').delete(deleteTransaction);

module.exports = router;
