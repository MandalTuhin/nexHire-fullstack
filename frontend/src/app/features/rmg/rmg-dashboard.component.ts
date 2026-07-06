import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-rmg-dashboard',
  standalone: true,
  template: `
    <div style="padding: 2rem;">
      <h2>RMG Dashboard</h2>
      <p>Project assignment will be implemented in Phase 4.</p>
      <button
        (click)="logout()"
        style="margin-top:1rem; padding:0.5rem 1rem; background:#ef4444; color:white; border:none; border-radius:4px; cursor:pointer;"
      >
        Logout
      </button>
    </div>
  `,
})
export class RmgDashboardComponent {
  constructor(private authService: AuthService) {}
  logout(): void {
    this.authService.logout();
  }
}
