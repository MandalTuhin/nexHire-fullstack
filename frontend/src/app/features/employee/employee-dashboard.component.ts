import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <header>
        <h1>Candidate Dashboard</h1>
        <div class="user-info">
          <span>{{ userName }}</span>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </div>
      </header>

      <div class="tabs">
        <button [class.active]="tab === 'jobs'" (click)="tab = 'jobs'">Jobs</button>
        <button
          [class.active]="tab === 'applications'"
          (click)="tab = 'applications'; loadApplications()"
        >
          My Applications
        </button>
        <button [class.active]="tab === 'offers'" (click)="tab = 'offers'; loadOffers()">
          My Offers
        </button>
        <button [class.active]="tab === 'joining'" (click)="tab = 'joining'; loadJoiningLetters()">
          Joining Letters
        </button>
      </div>

      <div *ngIf="message" class="message" [class.error]="isError">{{ message }}</div>

      <!-- Jobs Tab -->
      <div *ngIf="tab === 'jobs'" class="section">
        <h2>Available Jobs</h2>
        <div class="cards">
          <div *ngFor="let job of jobs" class="card">
            <h3>{{ job.title }}</h3>
            <p>{{ job.description }}</p>
            <p class="meta">Location: {{ job.locationName }}</p>
            <p *ngIf="job.requirements" class="meta">Requirements: {{ job.requirements }}</p>
            <button class="btn-primary" (click)="applyToJob(job.id)">Apply</button>
          </div>
          <p *ngIf="jobs.length === 0">No active jobs available.</p>
        </div>
      </div>

      <!-- Applications Tab -->
      <div *ngIf="tab === 'applications'" class="section">
        <h2>My Applications</h2>
        <table *ngIf="applications.length > 0">
          <thead>
            <tr>
              <th>Job</th>
              <th>Status</th>
              <th>Hold Reason</th>
              <th>Applied</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let app of applications">
              <td>{{ app.jobTitle }}</td>
              <td>
                <span class="badge" [attr.data-status]="app.status">{{ app.status }}</span>
              </td>
              <td>{{ app.holdReason || '-' }}</td>
              <td>{{ app.appliedAt | date: 'short' }}</td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="applications.length === 0">No applications yet.</p>
      </div>

      <!-- Offers Tab -->
      <div *ngIf="tab === 'offers'" class="section">
        <h2>My Offers</h2>
        <div *ngFor="let offer of offers" class="card">
          <h3>{{ offer.jobTitle }}</h3>
          <p>{{ offer.content }}</p>
          <p class="meta">
            Status: <span class="badge" [attr.data-status]="offer.status">{{ offer.status }}</span>
          </p>
          <div *ngIf="offer.status === 'OFFER_SENT'" class="actions">
            <button class="btn-success" (click)="acceptOffer(offer.id)">Accept</button>
            <button class="btn-danger" (click)="rejectOffer(offer.id)">Reject</button>
          </div>
        </div>
        <p *ngIf="offers.length === 0">No offers received.</p>
      </div>

      <!-- Joining Letters Tab -->
      <div *ngIf="tab === 'joining'" class="section">
        <h2>Joining Letters</h2>
        <div *ngFor="let letter of joiningLetters" class="card">
          <h3>{{ letter.jobTitle }}</h3>
          <p>{{ letter.content }}</p>
          <p class="meta">
            Joining Date: {{ letter.joiningDate }} | Location: {{ letter.locationName }}
          </p>
          <p class="meta">
            Status:
            <span class="badge" [attr.data-status]="letter.status">{{ letter.status }}</span>
          </p>
          <div *ngIf="letter.status === 'JOINING_LETTER_SENT'" class="actions">
            <button class="btn-success" (click)="acceptJoining(letter.id)">Accept Joining</button>
          </div>
        </div>
        <p *ngIf="joiningLetters.length === 0">No joining letters received.</p>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: 1.5rem;
        max-width: 1000px;
        margin: 0 auto;
      }
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .btn-logout {
        padding: 0.4rem 0.8rem;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 0.5rem;
      }
      .tabs button {
        padding: 0.5rem 1rem;
        border: none;
        background: #f3f4f6;
        border-radius: 4px 4px 0 0;
        cursor: pointer;
      }
      .tabs button.active {
        background: #4f46e5;
        color: white;
      }
      .section h2 {
        margin-bottom: 1rem;
      }
      .cards {
        display: grid;
        gap: 1rem;
      }
      .card {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      .card h3 {
        margin: 0 0 0.5rem;
      }
      .meta {
        color: #666;
        font-size: 0.9rem;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      th,
      td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #eee;
      }
      th {
        background: #f9fafb;
        font-weight: 600;
      }
      .badge {
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        background: #e5e7eb;
      }
      .badge[data-status='APPLIED'] {
        background: #dbeafe;
        color: #1d4ed8;
      }
      .badge[data-status='OFFER_SENT'] {
        background: #fef3c7;
        color: #92400e;
      }
      .badge[data-status='OFFER_ACCEPTED'] {
        background: #d1fae5;
        color: #065f46;
      }
      .badge[data-status='JOINING_ON_HOLD'] {
        background: #fde68a;
        color: #92400e;
      }
      .badge[data-status='JOINING_LETTER_SENT'] {
        background: #c7d2fe;
        color: #3730a3;
      }
      .badge[data-status='TRAINING_IN_PROGRESS'] {
        background: #c4b5fd;
        color: #5b21b6;
      }
      .actions {
        margin-top: 0.75rem;
        display: flex;
        gap: 0.5rem;
      }
      .btn-primary {
        padding: 0.4rem 0.8rem;
        background: #4f46e5;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .btn-success {
        padding: 0.4rem 0.8rem;
        background: #10b981;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .btn-danger {
        padding: 0.4rem 0.8rem;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .message {
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        background: #d1fae5;
        color: #065f46;
      }
      .message.error {
        background: #fee2e2;
        color: #dc2626;
      }
    `,
  ],
})
export class EmployeeDashboardComponent implements OnInit {
  tab = 'jobs';
  userName = '';
  jobs: any[] = [];
  applications: any[] = [];
  offers: any[] = [];
  joiningLetters: any[] = [];
  message = '';
  isError = false;

  constructor(
    private authService: AuthService,
    private api: ApiService,
  ) {
    this.userName = this.authService.getUser()?.name || '';
  }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.api.getJobs().subscribe({ next: (data) => (this.jobs = data) });
  }

  loadApplications(): void {
    this.api.getMyApplications().subscribe({ next: (data) => (this.applications = data) });
  }

  loadOffers(): void {
    this.api.getMyOffers().subscribe({ next: (data) => (this.offers = data) });
  }

  loadJoiningLetters(): void {
    this.api.getMyJoiningLetters().subscribe({ next: (data) => (this.joiningLetters = data) });
  }

  applyToJob(jobId: number): void {
    this.api.applyToJob(jobId).subscribe({
      next: () => {
        this.showMessage('Applied successfully!');
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Failed to apply', true);
      },
    });
  }

  acceptOffer(offerId: number): void {
    this.api.acceptOffer(offerId).subscribe({
      next: () => {
        this.showMessage('Offer accepted!');
        this.loadOffers();
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Failed', true);
      },
    });
  }

  rejectOffer(offerId: number): void {
    this.api.rejectOffer(offerId).subscribe({
      next: () => {
        this.showMessage('Offer rejected');
        this.loadOffers();
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Failed', true);
      },
    });
  }

  acceptJoining(letterId: number): void {
    this.api.acceptJoiningLetter(letterId).subscribe({
      next: () => {
        this.showMessage('Joining letter accepted! You are now a trainee.');
        this.loadJoiningLetters();
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Failed', true);
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }

  private showMessage(msg: string, error = false): void {
    this.message = msg;
    this.isError = error;
    setTimeout(() => (this.message = ''), 4000);
  }
}
