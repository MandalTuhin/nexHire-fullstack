import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../config/api-endpoints';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-candidate-profile',
  template: `
    <div class="profile-page">
      <app-page-header
        title="My Profile"
        subtitle="Complete your profile to apply for jobs."
      ></app-page-header>

      <div class="profile-alert" *ngIf="loaded && !profileComplete">
        <mat-icon>warning</mat-icon>
        <span
          >Your profile is incomplete. Please fill all fields to apply for
          jobs.</span
        >
      </div>

      <mat-card class="profile-card" *ngIf="loaded">
        <mat-card-content>
          <form class="profile-form" (ngSubmit)="save()">
            <h3>Personal Details</h3>
            <div class="form-row">
              <mat-form-field appearance="outline"
                ><mat-label>Phone</mat-label
                ><input matInput [(ngModel)]="form.phone" name="phone" required
              /></mat-form-field>
              <mat-form-field appearance="outline"
                ><mat-label>Date of Birth</mat-label
                ><input
                  matInput
                  type="date"
                  [(ngModel)]="form.dateOfBirth"
                  name="dob"
                  required
              /></mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full"
              ><mat-label>Address</mat-label
              ><textarea
                matInput
                [(ngModel)]="form.address"
                name="address"
                rows="2"
                required
              ></textarea>
            </mat-form-field>

            <h3>Education</h3>
            <div class="form-row">
              <mat-form-field appearance="outline"
                ><mat-label>Class 10 %</mat-label
                ><input
                  matInput
                  type="number"
                  [(ngModel)]="form.class10Percentage"
                  name="c10p"
                  required
              /></mat-form-field>
              <mat-form-field appearance="outline"
                ><mat-label>Class 10 Year</mat-label
                ><input
                  matInput
                  type="number"
                  [(ngModel)]="form.class10PassingYear"
                  name="c10y"
                  required
              /></mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline"
                ><mat-label>Class 12 %</mat-label
                ><input
                  matInput
                  type="number"
                  [(ngModel)]="form.class12Percentage"
                  name="c12p"
                  required
              /></mat-form-field>
              <mat-form-field appearance="outline"
                ><mat-label>Class 12 Year</mat-label
                ><input
                  matInput
                  type="number"
                  [(ngModel)]="form.class12PassingYear"
                  name="c12y"
                  required
              /></mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline"
                ><mat-label>B.Tech CGPA</mat-label
                ><input
                  matInput
                  type="number"
                  step="0.01"
                  [(ngModel)]="form.btechCgpa"
                  name="btcgpa"
                  required
              /></mat-form-field>
              <mat-form-field appearance="outline"
                ><mat-label>B.Tech Year</mat-label
                ><input
                  matInput
                  type="number"
                  [(ngModel)]="form.btechPassingYear"
                  name="bty"
                  required
              /></mat-form-field>
            </div>

            <h3>Skills & Preferences</h3>
            <mat-form-field appearance="outline" class="full"
              ><mat-label>Skills (comma separated)</mat-label
              ><input matInput [(ngModel)]="form.skills" name="skills" required
            /></mat-form-field>
            <div class="form-row">
              <mat-form-field appearance="outline"
                ><mat-label>Location Pref 1</mat-label
                ><input
                  matInput
                  [(ngModel)]="form.locationPreference1"
                  name="lp1"
                  required
              /></mat-form-field>
              <mat-form-field appearance="outline"
                ><mat-label>Location Pref 2</mat-label
                ><input
                  matInput
                  [(ngModel)]="form.locationPreference2"
                  name="lp2"
                  required
              /></mat-form-field>
              <mat-form-field appearance="outline"
                ><mat-label>Location Pref 3</mat-label
                ><input
                  matInput
                  [(ngModel)]="form.locationPreference3"
                  name="lp3"
                  required
              /></mat-form-field>
            </div>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="saving"
            >
              {{ saving ? 'Saving...' : 'Save Profile' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <app-loader *ngIf="!loaded"></app-loader>
    </div>
  `,
  styles: [
    `
      .profile-page {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .profile-alert {
        background: #fef3c7;
        border: 1px solid #f59e0b;
        border-radius: 8px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #92400e;
        font-size: 14px;
      }
      .profile-card {
        border-radius: 12px !important;
        max-width: 720px;
      }
      .profile-form h3 {
        margin: 16px 0 8px;
        color: #1e293b;
        font-size: 15px;
      }
      .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
      }
      .full {
        width: 100%;
      }
      mat-form-field {
        width: 100%;
      }
    `,
  ],
  standalone: false,
})
export class CandidateProfileComponent implements OnInit {
  loaded = false;
  saving = false;
  profileComplete = false;
  form: any = {};

  constructor(
    private http: HttpClient,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.http.get<any>(API_ENDPOINTS.CANDIDATE_PROFILE.BASE).subscribe({
      next: (d) => {
        this.form = d;
        this.profileComplete = d.profileComplete;
        this.loaded = true;
      },
      error: () => {
        this.loaded = true;
      },
    });
  }

  save(): void {
    this.saving = true;
    this.http
      .put<any>(API_ENDPOINTS.CANDIDATE_PROFILE.BASE, this.form)
      .subscribe({
        next: () => {
          this.saving = false;
          this.profileComplete = true;
          this.toast.success('Profile saved successfully.');
        },
        error: (e) => {
          this.saving = false;
          this.toast.error(e.error?.message || 'Failed to save profile.');
        },
      });
  }
}
