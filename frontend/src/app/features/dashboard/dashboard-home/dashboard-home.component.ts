import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { TransactionService } from '../../../core/services/transaction.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Transaction, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../../core/models/models';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule
  ],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">{{ getGreeting() }}, {{ authService.currentUser()?.name }}!</p>
        </div>
        <div class="header-date">
          <span class="material-symbols-outlined">calendar_today</span>
          {{ today | date:'EEEE, MMMM d, y' }}
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-grid">
        <div class="summary-card balance-card">
          <div class="card-icon balance-icon">
            <span class="material-symbols-outlined">account_balance</span>
          </div>
          <div class="card-body">
            <div class="card-label">Current Balance</div>
            <div class="card-value" [class.negative]="txService.balance() < 0">
              {{ txService.balance() | currency:'INR':'symbol':'1.2-2' }}
            </div>
            <div class="card-trend">
              <span class="material-symbols-outlined" [class.up]="txService.balance() >= 0" [class.down]="txService.balance() < 0">
                {{ txService.balance() >= 0 ? 'trending_up' : 'trending_down' }}
              </span>
              {{ txService.balance() >= 0 ? 'Positive balance' : 'Negative balance' }}
            </div>
          </div>
        </div>

        <div class="summary-card income-card">
          <div class="card-icon income-icon">
            <span class="material-symbols-outlined">arrow_downward</span>
          </div>
          <div class="card-body">
            <div class="card-label">Total Income</div>
            <div class="card-value income-value">
              {{ txService.totalIncome() | currency:'INR':'symbol':'1.2-2' }}
            </div>
            <div class="card-trend">
              <span class="count-badge">{{ incomeCount() }} transactions</span>
            </div>
          </div>
        </div>

        <div class="summary-card expense-card">
          <div class="card-icon expense-icon">
            <span class="material-symbols-outlined">arrow_upward</span>
          </div>
          <div class="card-body">
            <div class="card-label">Total Expenses</div>
            <div class="card-value expense-value">
              {{ txService.totalExpense() | currency:'INR':'symbol':'1.2-2' }}
            </div>
            <div class="card-trend">
              <span class="count-badge">{{ expenseCount() }} transactions</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="content-grid">

        <!-- Add Transaction Form -->
        <div class="form-panel">
          <div class="panel-header">
            <h2 class="panel-title">
              <span class="material-symbols-outlined">add_circle</span>
              Add Transaction
            </h2>
          </div>

          <form [formGroup]="txForm" (ngSubmit)="onAddTransaction()" class="tx-form">
            <!-- Type toggle -->
            <div class="type-toggle">
              <button type="button" class="type-btn income-btn" id="type-income-btn"
                [class.active]="txForm.get('type')?.value === 'income'"
                (click)="setType('income')">
                <span class="material-symbols-outlined">arrow_downward</span>
                Income
              </button>
              <button type="button" class="type-btn expense-btn" id="type-expense-btn"
                [class.active]="txForm.get('type')?.value === 'expense'"
                (click)="setType('expense')">
                <span class="material-symbols-outlined">arrow_upward</span>
                Expense
              </button>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Amount (₹)</mat-label>
              <input matInput type="number" formControlName="amount" placeholder="0.00" id="tx-amount" min="0.01" />
              <span matPrefix>₹&nbsp;</span>
              @if (txForm.get('amount')?.hasError('required') && txForm.get('amount')?.touched) {
                <mat-error>Amount is required</mat-error>
              }
              @if (txForm.get('amount')?.hasError('min') && txForm.get('amount')?.touched) {
                <mat-error>Amount must be greater than 0</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Category</mat-label>
              <mat-select formControlName="category" id="tx-category">
                @for (cat of currentCategories(); track cat) {
                  <mat-option [value]="cat">{{ cat }}</mat-option>
                }
              </mat-select>
              @if (txForm.get('category')?.hasError('required') && txForm.get('category')?.touched) {
                <mat-error>Category is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description (optional)</mat-label>
              <input matInput formControlName="description" placeholder="Brief note..." id="tx-description" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date" id="tx-date" />
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              @if (txForm.get('date')?.hasError('required') && txForm.get('date')?.touched) {
                <mat-error>Date is required</mat-error>
              }
            </mat-form-field>

            <button mat-raised-button class="add-btn" type="submit" id="add-transaction-btn" [disabled]="addingTx">
              @if (addingTx) {
                <mat-spinner diameter="18" strokeWidth="3"></mat-spinner>
              } @else {
                <span class="material-symbols-outlined">add</span>
                <span>Add Transaction</span>
              }
            </button>
          </form>
        </div>

        <!-- Transaction List -->
        <div class="list-panel">
          <div class="panel-header">
            <h2 class="panel-title">
              <span class="material-symbols-outlined">receipt_long</span>
              Transactions
            </h2>

            <!-- Filter Chips -->
            <div class="filter-chips">
              @for (filter of filters; track filter.value) {
                <button class="filter-chip" [class.active]="activeFilter() === filter.value"
                  (click)="setFilter(filter.value)" [id]="'filter-' + filter.value">
                  {{ filter.label }}
                </button>
              }
            </div>
          </div>

          @if (txService.loading()) {
            <div class="loading-state">
              <mat-spinner diameter="36" strokeWidth="3"></mat-spinner>
              <p>Loading transactions...</p>
            </div>
          } @else if (filteredTransactions().length === 0) {
            <div class="empty-state">
              <div class="empty-icon">
                <span class="material-symbols-outlined">receipt_long</span>
              </div>
              <h3>No transactions yet</h3>
              <p>Add your first transaction using the form on the left!</p>
            </div>
          } @else {
            <div class="tx-list">
              @for (tx of filteredTransactions(); track tx._id) {
                <div class="tx-item" [class.income-item]="tx.type === 'income'" [class.expense-item]="tx.type === 'expense'">
                  <div class="tx-icon" [class.income-icon]="tx.type === 'income'" [class.expense-icon]="tx.type === 'expense'">
                    <span class="material-symbols-outlined">
                      {{ tx.type === 'income' ? 'arrow_downward' : 'arrow_upward' }}
                    </span>
                  </div>
                  <div class="tx-details">
                    <div class="tx-category">{{ tx.category }}</div>
                    <div class="tx-meta">
                      @if (tx.description) {
                        <span>{{ tx.description }}</span>
                        <span class="dot">·</span>
                      }
                      <span>{{ tx.date | date:'MMM d, y' }}</span>
                    </div>
                  </div>
                  <div class="tx-right">
                    <div class="tx-amount" [class.income-amount]="tx.type === 'income'" [class.expense-amount]="tx.type === 'expense'">
                      {{ tx.type === 'income' ? '+' : '-' }}{{ tx.amount | currency:'INR':'symbol':'1.2-2' }}
                    </div>
                    <button class="tx-delete-btn" (click)="confirmDelete(tx)" [id]="'delete-tx-' + tx._id" matTooltip="Delete">
                      <span class="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');

    :host { display: block; font-family: 'Inter', sans-serif; }

    .page {
      padding: 2.5rem 3rem;
      max-width: 1440px;
      margin: 0 auto;
    }

    /* ─── Header ─── */
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: #111827;
      margin: 0 0 0.25rem;
      letter-spacing: -0.5px;
    }

    .page-subtitle {
      color: #6B7280;
      margin: 0;
      font-size: 0.95rem;
    }

    .header-date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #6B7280;
      font-size: 0.875rem;
      background: white;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      border: 1px solid #E5E7EB;
    }

    .header-date .material-symbols-outlined { font-size: 16px; }

    /* ─── Summary Cards ─── */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      margin-bottom: 1.75rem;
    }

    .summary-card {
      background: white;
      border-radius: 20px;
      padding: 1.75rem;
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.04);
      border: 1px solid #F3F4F6;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .summary-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .card-icon {
      width: 48px; height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .balance-icon { background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; }
    .income-icon { background: #DCFCE7; color: #16A34A; }
    .expense-icon { background: #FEE2E2; color: #DC2626; }

    .card-icon .material-symbols-outlined { font-size: 24px; }

    .card-label {
      font-size: 0.8rem;
      font-weight: 500;
      color: #9CA3AF;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .card-value {
      font-size: 1.6rem;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.5px;
      margin-bottom: 0.5rem;
    }

    .card-value.negative { color: #DC2626; }
    .income-value { color: #16A34A; }
    .expense-value { color: #DC2626; }

    .card-trend {
      font-size: 0.8rem;
      color: #6B7280;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .card-trend .material-symbols-outlined { font-size: 14px; }
    .card-trend .up { color: #16A34A; }
    .card-trend .down { color: #DC2626; }

    .count-badge {
      background: #F3F4F6;
      color: #6B7280;
      padding: 0.15rem 0.5rem;
      border-radius: 20px;
      font-size: 0.75rem;
    }

    /* ─── Content Grid ─── */
    .content-grid {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 2rem;
    }

    .form-panel, .list-panel {
      background: white;
      border-radius: 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      border: 1px solid #F3F4F6;
      overflow: hidden;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid #F3F4F6;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .panel-title {
      font-size: 1rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .panel-title .material-symbols-outlined { font-size: 20px; color: #4F46E5; }

    /* ─── Form ─── */
    .tx-form {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .type-toggle {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .type-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.75rem;
      border-radius: 10px;
      border: 2px solid #E5E7EB;
      background: white;
      font-size: 0.875rem;
      font-weight: 600;
      color: #6B7280;
      cursor: pointer;
      transition: all 0.2s;
    }

    .type-btn .material-symbols-outlined { font-size: 18px; }

    .income-btn.active {
      border-color: #22C55E;
      background: #F0FDF4;
      color: #16A34A;
    }

    .expense-btn.active {
      border-color: #EF4444;
      background: #FEF2F2;
      color: #DC2626;
    }

    .full-width { width: 100%; }

    .add-btn {
      height: 48px !important;
      border-radius: 10px !important;
      font-size: 0.9rem !important;
      font-weight: 600 !important;
      background: linear-gradient(135deg, #4F46E5, #7C3AED) !important;
      color: white !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 0.5rem !important;
      margin-top: 0.5rem;
      transition: transform 0.2s, box-shadow 0.2s !important;
    }

    .add-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(79,70,229,0.35) !important;
    }

    .add-btn .material-symbols-outlined { font-size: 20px; }

    /* ─── Filter Chips ─── */
    .filter-chips {
      display: flex;
      gap: 0.5rem;
    }

    .filter-chip {
      padding: 0.3rem 0.875rem;
      border-radius: 20px;
      border: 1px solid #E5E7EB;
      background: white;
      font-size: 0.8rem;
      font-weight: 500;
      color: #6B7280;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-chip.active {
      background: #EEF2FF;
      border-color: #4F46E5;
      color: #4F46E5;
      font-weight: 600;
    }

    /* ─── Transaction List ─── */
    .tx-list {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: 600px;
      overflow-y: auto;
    }

    .tx-item {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 1rem;
      border-radius: 12px;
      border: 1px solid #F3F4F6;
      transition: all 0.2s;
      cursor: default;
    }

    .tx-item:hover {
      border-color: #E5E7EB;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .income-item:hover { border-color: #BBF7D0; background: #F0FDF4; }
    .expense-item:hover { border-color: #FECACA; background: #FEF2F2; }

    .tx-icon {
      width: 40px; height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .tx-icon.income-icon { background: #DCFCE7; color: #16A34A; }
    .tx-icon.expense-icon { background: #FEE2E2; color: #DC2626; }
    .tx-icon .material-symbols-outlined { font-size: 18px; }

    .tx-details { flex: 1; overflow: hidden; }

    .tx-category {
      font-size: 0.9rem;
      font-weight: 600;
      color: #111827;
    }

    .tx-meta {
      font-size: 0.78rem;
      color: #9CA3AF;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin-top: 0.15rem;
    }

    .dot { opacity: 0.5; }

    .tx-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .tx-amount {
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: -0.3px;
    }

    .income-amount { color: #16A34A; }
    .expense-amount { color: #DC2626; }

    .tx-delete-btn {
      width: 32px; height: 32px;
      background: none;
      border: none;
      cursor: pointer;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #D1D5DB;
      transition: all 0.2s;
    }

    .tx-delete-btn:hover { background: #FEE2E2; color: #DC2626; }
    .tx-delete-btn .material-symbols-outlined { font-size: 18px; }

    /* ─── States ─── */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      gap: 1rem;
      color: #9CA3AF;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-icon {
      width: 80px; height: 80px;
      background: #F3F4F6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .empty-icon .material-symbols-outlined { font-size: 36px; color: #9CA3AF; }

    .empty-state h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 0.5rem;
    }

    .empty-state p {
      color: #9CA3AF;
      font-size: 0.9rem;
      margin: 0;
    }

    @media (max-width: 1024px) {
      .content-grid { grid-template-columns: 1fr; }
      .summary-grid { grid-template-columns: 1fr; }
      .page { padding: 1rem; }
    }
  `]
})
export class DashboardHomeComponent implements OnInit {
  txService = inject(TransactionService);
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private dialog = inject(MatDialog);

  today = new Date();
  addingTx = false;
  activeFilter = signal<string>('all');

  incomeCategories = INCOME_CATEGORIES;
  expenseCategories = EXPENSE_CATEGORIES;

  filters = [
    { label: 'All', value: 'all' },
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' }
  ];

  txForm = this.fb.group({
    type: ['expense', [Validators.required]],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    category: ['', [Validators.required]],
    description: [''],
    date: [new Date(), [Validators.required]]
  });

  // Computed: categories based on selected type
  currentCategories = computed(() => {
    const type = this.txForm.get('type')?.value;
    return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  });

  // Computed: filtered transactions
  filteredTransactions = computed(() => {
    const filter = this.activeFilter();
    const txs = this.txService.transactions();
    if (filter === 'all') return txs;
    return txs.filter(t => t.type === filter);
  });

  incomeCount = computed(() => this.txService.transactions().filter(t => t.type === 'income').length);
  expenseCount = computed(() => this.txService.transactions().filter(t => t.type === 'expense').length);

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.txService.getTransactions().subscribe({
      error: () => this.toastService.error('Failed to load transactions')
    });
  }

  setType(type: 'income' | 'expense'): void {
    this.txForm.patchValue({ type, category: '' });
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  onAddTransaction(): void {
    if (this.txForm.invalid) {
      this.txForm.markAllAsTouched();
      return;
    }

    this.addingTx = true;
    const { type, amount, category, description, date } = this.txForm.value;

    this.txService.createTransaction({
      type: type as 'income' | 'expense',
      amount: Number(amount),
      category: category!,
      description: description || '',
      date: (date as Date).toISOString()
    }).subscribe({
      next: () => {
        this.toastService.success('Transaction added successfully!');
        this.txForm.patchValue({ amount: null, category: '', description: '', date: new Date() });
        this.txForm.markAsUntouched();
        this.loadTransactions();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to add transaction');
      },
      complete: () => {
        this.addingTx = false;
      }
    });
  }

  confirmDelete(tx: Transaction): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Delete Transaction',
        message: `Are you sure you want to delete this ${tx.type} of ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)}?`,
        confirmLabel: 'Delete',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.txService.deleteTransaction(tx._id).subscribe({
          next: () => {
            this.toastService.success('Transaction deleted');
            this.loadTransactions();
          },
          error: () => this.toastService.error('Failed to delete transaction')
        });
      }
    });
  }
}
