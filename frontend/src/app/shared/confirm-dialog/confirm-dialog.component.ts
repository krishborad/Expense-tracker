import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="dialog">
      <div class="dialog-icon" [class]="'icon-' + (data.type || 'info')">
        <span class="material-symbols-outlined">
          {{ data.type === 'danger' ? 'delete' : 'warning' }}
        </span>
      </div>

      <h2 class="dialog-title">{{ data.title }}</h2>
      <p class="dialog-message">{{ data.message }}</p>

      <div class="dialog-actions">
        <button mat-stroked-button class="cancel-btn" (click)="onCancel()" id="confirm-dialog-cancel">
          {{ data.cancelLabel || 'Cancel' }}
        </button>
        <button mat-raised-button class="confirm-btn" [class]="'confirm-' + (data.type || 'info')"
          (click)="onConfirm()" id="confirm-dialog-confirm">
          {{ data.confirmLabel || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');

    .dialog {
      padding: 2rem;
      text-align: center;
      font-family: 'Inter', sans-serif;
    }

    .dialog-icon {
      width: 64px; height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
    }

    .icon-danger { background: #FEE2E2; color: #DC2626; }
    .icon-warning { background: #FEF3C7; color: #D97706; }
    .icon-info { background: #DBEAFE; color: #2563EB; }

    .dialog-icon .material-symbols-outlined { font-size: 32px; }

    .dialog-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.75rem;
    }

    .dialog-message {
      color: #6B7280;
      font-size: 0.9rem;
      margin: 0 0 1.75rem;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }

    .cancel-btn {
      min-width: 100px;
      border-radius: 8px !important;
    }

    .confirm-btn {
      min-width: 100px;
      border-radius: 8px !important;
      color: white !important;
    }

    .confirm-danger { background: #EF4444 !important; }
    .confirm-warning { background: #F59E0B !important; }
    .confirm-info { background: #3B82F6 !important; }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void { this.dialogRef.close(true); }
  onCancel(): void { this.dialogRef.close(false); }
}
