import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="brand-icon">
            <span class="material-symbols-outlined">account_balance_wallet</span>
          </div>
          <h1>FinanceFlow</h1>
          <p>Your smart financial companion</p>
        </div>
        <div class="auth-stats">
          <div class="stat-card">
            <div class="stat-value">100%</div>
            <div class="stat-label">Secure</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">Free</div>
            <div class="stat-label">Forever</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">∞</div>
            <div class="stat-label">Transactions</div>
          </div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Create account</h2>
            <p>Start tracking your finances today</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="name" placeholder="John Doe" id="register-name" />
              <mat-icon matSuffix>person</mat-icon>
              @if (registerForm.get('name')?.hasError('required') && registerForm.get('name')?.touched) {
                <mat-error>Name is required</mat-error>
              }
              @if (registerForm.get('name')?.hasError('minlength') && registerForm.get('name')?.touched) {
                <mat-error>Name must be at least 2 characters</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" formControlName="email" placeholder="you@example.com" id="register-email" />
              <mat-icon matSuffix>email</mat-icon>
              @if (registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="password" id="register-password" />
              <button mat-icon-button matSuffix type="button" (click)="showPassword = !showPassword">
                <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
              @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
                <mat-error>Password must be at least 6 characters</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="confirmPassword" id="register-confirm-password" />
              <mat-icon matSuffix>lock</mat-icon>
              @if (registerForm.get('confirmPassword')?.hasError('required') && registerForm.get('confirmPassword')?.touched) {
                <mat-error>Please confirm your password</mat-error>
              }
              @if (registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched) {
                <mat-error>Passwords do not match</mat-error>
              }
            </mat-form-field>

            @if (errorMsg) {
              <div class="error-banner">
                <span class="material-symbols-outlined">error</span>
                {{ errorMsg }}
              </div>
            }

            <button mat-raised-button class="submit-btn" type="submit" id="register-submit" [disabled]="loading">
              @if (loading) {
                <mat-spinner diameter="20" strokeWidth="3"></mat-spinner>
              } @else {
                <span>Create Account</span>
              }
            </button>
          </form>

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/auth/login" id="go-to-login">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');

    :host { display: block; height: 100vh; font-family: 'Inter', sans-serif; }

    .auth-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      height: 100vh;
    }

    .auth-left {
      background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #9333EA 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 3rem;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .auth-left::before {
      content: '';
      position: absolute;
      width: 300px; height: 300px;
      background: rgba(255,255,255,0.05);
      border-radius: 50%;
      top: -100px; right: -100px;
    }

    .auth-brand {
      text-align: center;
      margin-bottom: 3rem;
      z-index: 1;
    }

    .brand-icon {
      width: 80px; height: 80px;
      background: rgba(255,255,255,0.2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.3);
    }

    .brand-icon .material-symbols-outlined { font-size: 40px; }

    .auth-brand h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }

    .auth-brand p { font-size: 1rem; opacity: 0.85; margin: 0; }

    .auth-stats {
      display: flex;
      gap: 1rem;
      z-index: 1;
    }

    .stat-card {
      background: rgba(255,255,255,0.15);
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      text-align: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
      min-width: 80px;
    }

    .stat-value { font-size: 1.5rem; font-weight: 700; }
    .stat-label { font-size: 0.75rem; opacity: 0.8; margin-top: 0.25rem; }

    .auth-right {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F9FAFB;
      padding: 2rem;
    }

    .auth-card {
      background: white;
      border-radius: 20px;
      padding: 3rem;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.08);
    }

    .auth-header { margin-bottom: 1.5rem; }

    .auth-header h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem;
    }

    .auth-header p { color: #6B7280; margin: 0; font-size: 0.95rem; }

    .auth-form { display: flex; flex-direction: column; gap: 0.75rem; }

    .full-width { width: 100%; }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #FEF2F2;
      color: #DC2626;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      font-size: 0.875rem;
      border: 1px solid #FECACA;
    }

    .submit-btn {
      height: 48px;
      border-radius: 10px !important;
      font-size: 1rem;
      font-weight: 600;
      background: linear-gradient(135deg, #4F46E5, #7C3AED) !important;
      color: white !important;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(79,70,229,0.4);
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #F3F4F6;
    }

    .auth-footer p { margin: 0; color: #6B7280; font-size: 0.9rem; }

    .auth-footer a {
      color: #4F46E5;
      font-weight: 600;
      text-decoration: none;
    }

    @media (max-width: 768px) {
      .auth-container { grid-template-columns: 1fr; }
      .auth-left { display: none; }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  showPassword = false;
  loading = false;
  errorMsg = '';

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: this.passwordMatchValidator }
  );

  passwordMatchValidator(control: AbstractControl) {
    const pass = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const { name, email, password } = this.registerForm.value;

    this.authService.register(name!, email!, password!).subscribe({
      next: (res) => {
        this.toastService.success(`Welcome to FinanceFlow, ${res.user.name}!`);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
