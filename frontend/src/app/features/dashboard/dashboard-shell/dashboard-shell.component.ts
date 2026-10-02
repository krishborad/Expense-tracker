import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ToastContainerComponent } from '../../../shared/toast-container/toast-container.component';

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ToastContainerComponent
  ],
  template: `
    <div class="shell">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-icon">
            <span class="material-symbols-outlined">account_balance_wallet</span>
          </div>
          <span class="brand-name">FinanceFlow</span>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section-label">Main</div>
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item" id="nav-dashboard">
            <span class="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>
        </nav>

        <div class="sidebar-user">
          <div class="user-avatar">{{ getUserInitial() }}</div>
          <div class="user-info">
            <div class="user-name">{{ authService.currentUser()?.name }}</div>
            <div class="user-email">{{ authService.currentUser()?.email }}</div>
          </div>
          <button mat-icon-button class="logout-btn" (click)="logout()" matTooltip="Logout" id="logout-btn">
            <span class="material-symbols-outlined">logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet />
      </main>

      <!-- Toast Notifications -->
      <app-toast-container />
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');

    :host { display: block; height: 100vh; font-family: 'Inter', sans-serif; }

    .shell {
      display: flex;
      height: 100vh;
      background: #F9FAFB;
      overflow: hidden;
    }

    .sidebar {
      width: 280px;
      min-width: 280px;
      background: white;
      border-right: 1px solid #E5E7EB;
      display: flex;
      flex-direction: column;
      padding: 2rem 0;
      box-shadow: 2px 0 12px rgba(0,0,0,0.03);
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0 1.75rem 1.75rem;
      border-bottom: 1px solid #F3F4F6;
      margin-bottom: 1.25rem;
    }

    .brand-icon {
      width: 40px; height: 40px;
      background: linear-gradient(135deg, #4F46E5, #7C3AED);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .brand-icon .material-symbols-outlined { font-size: 22px; }

    .brand-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.3px;
    }

    .sidebar-nav {
      flex: 1;
      padding: 0 0.75rem;
    }

    .nav-section-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: #9CA3AF;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 0 0.75rem;
      margin-bottom: 0.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 10px;
      color: #6B7280;
      font-size: 0.9rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
    }

    .nav-item:hover {
      background: #F9FAFB;
      color: #4F46E5;
    }

    .nav-item.active {
      background: #EEF2FF;
      color: #4F46E5;
      font-weight: 600;
    }

    .nav-item .material-symbols-outlined { font-size: 20px; }

    /* ─── User Section ─── */
    .sidebar-user {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 1rem 1.25rem;
      margin: 0 1rem;
      border-top: 1px solid #F3F4F6;
      border-radius: 16px;
      background: #F9FAFB;
    }

    .user-avatar {
      width: 38px; height: 38px;
      background: linear-gradient(135deg, #4F46E5, #7C3AED);
      border-radius: 50%;
      color: white;
      font-weight: 700;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .user-info { flex: 1; overflow: hidden; }

    .user-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: #111827;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-email {
      font-size: 0.72rem;
      color: #9CA3AF;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .logout-btn {
      color: #9CA3AF !important;
      flex-shrink: 0;
    }

    .logout-btn:hover { color: #EF4444 !important; }

    /* ─── Main Content ─── */
    .main-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }

    @media (max-width: 768px) {
      .sidebar { display: none; }
    }
  `]
})
export class DashboardShellComponent {
  authService = inject(AuthService);
  private toastService = inject(ToastService);

  getUserInitial(): string {
    return this.authService.currentUser()?.name?.charAt(0).toUpperCase() || 'U';
  }

  logout(): void {
    this.toastService.info('Logged out successfully');
    setTimeout(() => this.authService.logout(), 500);
  }
}
