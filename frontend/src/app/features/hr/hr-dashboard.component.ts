import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <header>
        <h1>HR Dashboard</h1>
        <div class="user-info">
          <span>{{ userName }}</span>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </div>
      </header>

      <div class="tabs">
        <button
          [class.active]="tab === 'applications'"
          (click)="tab = 'applications'; loadApplications()"
        >
          Applications
        </button>
        <button [class.active]="tab === 'locations'" (click)="tab = 'locations'; loadLocations()">
          Locations
        </button>
      </div>

      <div *ngIf="message" class="message" [class.error]="isError">{{ message }}</div>

      <!-- Applications Tab -->
      <div *ngIf="tab === 'applications'" class="section">
        <h2>All Applications</h2>
        <table *ngIf="applications.length > 0">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Job</th>
              <th>Status</th>
              <th>Hold Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let app of applications">
              <td>{{ app.userName }} ({{ app.userEmail }})</td>
              <td>{{ app.jobTitle }}</td>
              <td>
                <span class="badge" [attr.data-status]="app.status">{{ app.status }}</span>
              </td>
              <td>{{ app.holdReason || '-' }}</td>
              <td class="actions-cell">
                <button
                  *ngIf="app.status === 'APPLIED'"
                  class="btn-sm"
                  (click)="startAssessment(app.id)"
                >
                  Start Assessment
                </button>
                <button
                  *ngIf="app.status === 'ASSESSMENT_PENDING'"
                  class="btn-sm"
                  (click)="openScoreDialog(app)"
                >
                  Enter Score
                </button>
                <button
                  *ngIf="app.status === 'ASSESSMENT_COMPLETED'"
                  class="btn-sm btn-success"
                  (click)="qualify(app.id)"
                >
                  Qualify
                </button>
                <button
                  *ngIf="app.status === 'ASSESSMENT_COMPLETED'"
                  class="btn-sm btn-danger"
                  (click)="reject(app.id)"
                >
                  Reject
                </button>
                <button
                  *ngIf="app.status === 'QUALIFIED'"
                  class="btn-sm"
                  (click)="openOfferDialog(app)"
                >
                  Send Offer
                </button>
                <button
                  *ngIf="app.status === 'OFFER_ACCEPTED' || app.status === 'JOINING_ON_HOLD'"
                  class="btn-sm btn-success"
                  (click)="openJoiningDialog(app)"
                >
                  Send Joining Letter
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="applications.length === 0">No applications found.</p>
      </div>

      <!-- Locations Tab -->
      <div *ngIf="tab === 'locations'" class="section">
        <h2>Location Budget & Seats</h2>
        <table *ngIf="locations.length > 0">
          <thead>
            <tr>
              <th>Location</th>
              <th>Budget Total</th>
              <th>Budget Used</th>
              <th>Budget Available</th>
              <th>Seats Total</th>
              <th>Seats Occupied</th>
              <th>Seats Available</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let loc of locations">
              <td>{{ loc.name }} ({{ loc.city }})</td>
              <td>{{ loc.budgetTotal }}</td>
              <td>{{ loc.budgetUsed }}</td>
              <td>{{ loc.budgetAvailable }}</td>
              <td>{{ loc.seatsTotal }}</td>
              <td>{{ loc.seatsOccupied }}</td>
              <td>{{ loc.seatsAvailable }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Score Dialog -->
      <div *ngIf="showScoreDialog" class="modal-overlay" (click)="showScoreDialog = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>Enter Assessment Score</h3>
          <p>Candidate: {{ selectedApp?.userName }} | Job: {{ selectedApp?.jobTitle }}</p>
          <div class="field">
            <label>Score</label><input type="number" [(ngModel)]="scoreValue" />
          </div>
          <div class="field">
            <label>Remarks</label><input type="text" [(ngModel)]="scoreRemarks" />
          </div>
          <div class="modal-actions">
            <button class="btn-primary" (click)="submitScore()">Submit</button>
            <button class="btn-cancel" (click)="showScoreDialog = false">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Offer Dialog -->
      <div *ngIf="showOfferDialog" class="modal-overlay" (click)="showOfferDialog = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>Send Offer Letter</h3>
          <p>Candidate: {{ selectedApp?.userName }}</p>
          <div class="field">
            <label>Offer Content</label><textarea [(ngModel)]="offerContent" rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn-primary" (click)="submitOffer()">Send Offer</button>
            <button class="btn-cancel" (click)="showOfferDialog = false">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Joining Dialog -->
      <div *ngIf="showJoiningDialog" class="modal-overlay" (click)="showJoiningDialog = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>Send Joining Letter</h3>
          <p>Candidate: {{ selectedApp?.userName }}</p>
          <div class="field">
            <label>Content</label><textarea [(ngModel)]="joiningContent" rows="3"></textarea>
          </div>
          <div class="field">
            <label>Joining Date</label><input type="date" [(ngModel)]="joiningDate" />
          </div>
          <div class="field">
            <label>Location</label>
            <select [(ngModel)]="joiningLocationId">
              <option *ngFor="let loc of locations" [value]="loc.id">
                {{ loc.name }} (Budget: {{ loc.budgetAvailable }}, Seats: {{ loc.seatsAvailable }})
              </option>
            </select>
          </div>
          <div class="modal-actions">
            <button class="btn-primary" (click)="submitJoining()">Send</button>
            <button class="btn-cancel" (click)="showJoiningDialog = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: 1.5rem;
        max-width: 1200px;
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
        padding: 0.6rem;
        text-align: left;
        border-bottom: 1px solid #eee;
        font-size: 0.9rem;
      }
      th {
        background: #f9fafb;
        font-weight: 600;
      }
      .badge {
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        background: #e5e7eb;
      }
      .badge[data-status='APPLIED'] {
        background: #dbeafe;
        color: #1d4ed8;
      }
      .badge[data-status='ASSESSMENT_PENDING'] {
        background: #fef3c7;
        color: #92400e;
      }
      .badge[data-status='ASSESSMENT_COMPLETED'] {
        background: #e0e7ff;
        color: #3730a3;
      }
      .badge[data-status='QUALIFIED'] {
        background: #d1fae5;
        color: #065f46;
      }
      .badge[data-status='REJECTED'] {
        background: #fee2e2;
        color: #dc2626;
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
      .actions-cell {
        display: flex;
        gap: 0.3rem;
        flex-wrap: wrap;
      }
      .btn-sm {
        padding: 0.3rem 0.5rem;
        font-size: 0.8rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background: #4f46e5;
        color: white;
      }
      .btn-sm.btn-success {
        background: #10b981;
      }
      .btn-sm.btn-danger {
        background: #ef4444;
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
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
      }
      .modal {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        width: 90%;
        max-width: 450px;
      }
      .modal h3 {
        margin-bottom: 0.5rem;
      }
      .field {
        margin-bottom: 0.75rem;
      }
      .field label {
        display: block;
        margin-bottom: 0.25rem;
        font-weight: 500;
      }
      .field input,
      .field textarea,
      .field select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
      }
      .modal-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
      }
      .btn-primary {
        padding: 0.5rem 1rem;
        background: #4f46e5;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .btn-cancel {
        padding: 0.5rem 1rem;
        background: #6b7280;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    `,
  ],
})
export class HrDashboardComponent implements OnInit {
  tab = 'applications';
  userName = '';
  applications: any[] = [];
  locations: any[] = [];
  message = '';
  isError = false;

  // Score dialog
  showScoreDialog = false;
  selectedApp: any = null;
  scoreValue = 0;
  scoreRemarks = '';

  // Offer dialog
  showOfferDialog = false;
  offerContent = '';

  // Joining dialog
  showJoiningDialog = false;
  joiningContent = '';
  joiningDate = '';
  joiningLocationId = 0;

  constructor(
    private authService: AuthService,
    private api: ApiService,
  ) {
    this.userName = this.authService.getUser()?.name || '';
  }

  ngOnInit(): void {
    this.loadApplications();
    this.loadLocations();
  }

  loadApplications(): void {
    this.api.getAllApplications().subscribe({ next: (data) => (this.applications = data) });
  }

  loadLocations(): void {
    this.api.getLocations().subscribe({ next: (data) => (this.locations = data) });
  }

  startAssessment(appId: number): void {
    this.api.startAssessment(appId).subscribe({
      next: () => {
        this.showMsg('Assessment started');
        this.loadApplications();
      },
      error: (err) => this.showMsg(err.error?.message || 'Failed', true),
    });
  }

  openScoreDialog(app: any): void {
    this.selectedApp = app;
    this.scoreValue = 0;
    this.scoreRemarks = '';
    this.showScoreDialog = true;
  }

  submitScore(): void {
    this.api.enterScore(this.selectedApp.id, this.scoreValue, this.scoreRemarks).subscribe({
      next: () => {
        this.showScoreDialog = false;
        this.showMsg('Score entered');
        this.loadApplications();
      },
      error: (err) => this.showMsg(err.error?.message || 'Failed', true),
    });
  }

  qualify(appId: number): void {
    this.api.qualifyCandidate(appId).subscribe({
      next: () => {
        this.showMsg('Candidate qualified');
        this.loadApplications();
      },
      error: (err) => this.showMsg(err.error?.message || 'Failed', true),
    });
  }

  reject(appId: number): void {
    this.api.rejectCandidate(appId).subscribe({
      next: () => {
        this.showMsg('Candidate rejected');
        this.loadApplications();
      },
      error: (err) => this.showMsg(err.error?.message || 'Failed', true),
    });
  }

  openOfferDialog(app: any): void {
    this.selectedApp = app;
    this.offerContent = `We are pleased to offer you the position of ${app.jobTitle}.`;
    this.showOfferDialog = true;
  }

  submitOffer(): void {
    this.api.sendOffer(this.selectedApp.id, this.offerContent).subscribe({
      next: () => {
        this.showOfferDialog = false;
        this.showMsg('Offer sent');
        this.loadApplications();
      },
      error: (err) => this.showMsg(err.error?.message || 'Failed', true),
    });
  }

  openJoiningDialog(app: any): void {
    this.selectedApp = app;
    this.joiningContent = `Welcome aboard! Please report on the joining date.`;
    this.joiningDate = '';
    this.joiningLocationId = this.locations.length > 0 ? this.locations[0].id : 0;
    this.showJoiningDialog = true;
  }

  submitJoining(): void {
    const data = {
      content: this.joiningContent,
      joiningDate: this.joiningDate,
      locationId: +this.joiningLocationId,
    };
    this.api.sendJoiningLetter(this.selectedApp.id, data).subscribe({
      next: () => {
        this.showJoiningDialog = false;
        this.showMsg('Joining letter sent');
        this.loadApplications();
        this.loadLocations();
      },
      error: (err) => {
        this.showJoiningDialog = false;
        this.showMsg(err.error?.message || 'Failed', true);
        this.loadApplications();
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }

  private showMsg(msg: string, error = false): void {
    this.message = msg;
    this.isError = error;
    setTimeout(() => (this.message = ''), 5000);
  }
}
