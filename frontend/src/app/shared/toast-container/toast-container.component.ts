import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type" (click)="toastService.dismiss(toast.id)">
          <span class="material-symbols-outlined toast-icon">
            {{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}
          </span>
          <span class="toast-msg">{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.dismiss(toast.id)">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');

    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      z-index: 9999;
      max-width: 360px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      cursor: pointer;
      animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      backdrop-filter: blur(10px);
      min-width: 280px;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .toast-success { background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }
    .toast-error { background: #FEF2F2; color: #991B1B; border: 1px solid #FECACA; }
    .toast-info { background: #EFF6FF; color: #1E40AF; border: 1px solid #BFDBFE; }

    .toast-icon { font-size: 20px; flex-shrink: 0; }
    .toast-msg { flex: 1; }

    .toast-close {
      background: none;
      border: none;
      cursor: pointer;
      opacity: 0.5;
      padding: 2px;
      color: inherit;
      display: flex;
      align-items: center;
    }

    .toast-close:hover { opacity: 1; }
    .toast-close .material-symbols-outlined { font-size: 16px; }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
