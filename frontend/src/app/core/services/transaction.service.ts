import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Transaction, TransactionsResponse } from '../models/models';

const API_BASE = 'http://localhost:5000/api/transactions';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  // Reactive signals for transaction state
  transactions = signal<Transaction[]>([]);
  totalIncome = signal<number>(0);
  totalExpense = signal<number>(0);
  balance = signal<number>(0);
  loading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  /**
   * Fetch all transactions with optional filters
   */
  getTransactions(type?: string, sortBy: string = 'date', order: string = 'desc'): Observable<TransactionsResponse> {
    this.loading.set(true);
    let params = new HttpParams().set('sortBy', sortBy).set('order', order);
    if (type && type !== 'all') {
      params = params.set('type', type);
    }

    return this.http.get<TransactionsResponse>(API_BASE, { params }).pipe(
      tap((res) => {
        if (res.success) {
          this.transactions.set(res.transactions);
          this.totalIncome.set(res.summary.totalIncome);
          this.totalExpense.set(res.summary.totalExpense);
          this.balance.set(res.summary.balance);
        }
        this.loading.set(false);
      })
    );
  }

  /**
   * Create a new transaction
   */
  createTransaction(data: Partial<Transaction>): Observable<{ success: boolean; message: string; transaction: Transaction }> {
    return this.http.post<{ success: boolean; message: string; transaction: Transaction }>(API_BASE, data);
  }

  /**
   * Delete a transaction by ID
   */
  deleteTransaction(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${API_BASE}/${id}`);
  }
}
