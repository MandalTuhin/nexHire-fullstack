import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Register for nexHIRE</h2>
        <div *ngIf="error" class="error">{{ error }}</div>
        <form (ngSubmit)="onRegister()">
          <div class="field">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="name" name="name" required />
          </div>
          <div class="field">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required />
          </div>
          <div class="field">
            <label>Phone</label>
            <input type="tel" [(ngModel)]="phone" name="phone" required />
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required />
          </div>
          <button type="submit" [disabled]="loading">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </form>
        <p class="link">Already have an account? <a routerLink="/login">Login</a></p>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #f5f7fa;
      }
      .auth-card {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
      }
      h2 {
        text-align: center;
        color: #333;
        margin-bottom: 1.5rem;
      }
      .field {
        margin-bottom: 1rem;
      }
      .field label {
        display: block;
        margin-bottom: 0.25rem;
        font-weight: 500;
        color: #555;
      }
      .field input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        box-sizing: border-box;
      }
      button {
        width: 100%;
        padding: 0.75rem;
        background: #4f46e5;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
      }
      button:disabled {
        opacity: 0.6;
      }
      button:hover:not(:disabled) {
        background: #4338ca;
      }
      .error {
        background: #fee2e2;
        color: #dc2626;
        padding: 0.5rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        text-align: center;
      }
      .link {
        text-align: center;
        margin-top: 1rem;
      }
      .link a {
        color: #4f46e5;
      }
    `,
  ],
})
export class RegisterComponent {
  name = '';
  email = '';
  phone = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onRegister(): void {
    this.loading = true;
    this.error = '';
    this.authService.register(this.name, this.email, this.password, this.phone).subscribe({
      next: () => {
        this.router.navigate([this.authService.getDashboardRoute()]);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      },
    });
  }
}
