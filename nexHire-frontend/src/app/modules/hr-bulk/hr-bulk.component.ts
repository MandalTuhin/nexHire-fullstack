import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-hr-bulk',
  template: `
    <div class="bulk-page">
      <app-page-header title="Bulk Operations" subtitle="Upload Excel data, generate offer letters and joining letters in bulk."></app-page-header>

      <div class="cards-grid">
        <!-- Excel Upload -->
        <mat-card class="op-card">
          <mat-card-header><mat-card-title>Excel Bulk Upload</mat-card-title></mat-card-header>
          <mat-card-content>
            <p>Download template, fill candidate data (assessment scores, BGC status, offer eligibility), then upload.</p>
            <div class="btn-row">
              <a mat-stroked-button [href]="templateUrl" target="_blank"><mat-icon>download</mat-icon> Download Template</a>
              <input type="file" #excelInput accept=".xlsx,.xls" (change)="onExcelSelected($event)" style="display:none">
              <button mat-raised-button color="primary" (click)="excelInput.click()"><mat-icon>upload_file</mat-icon> Upload Excel</button>
            </div>
            <div class="result-box" *ngIf="uploadResult">
              <div><strong>Total:</strong> {{ uploadResult.totalRows }}</div>
              <div class="success"><strong>Success:</strong> {{ uploadResult.successfulRows }}</div>
              <div class="fail"><strong>Failed:</strong> {{ uploadResult.failedRows }}</div>
              <div *ngFor="let e of uploadResult.errors" class="err-line">{{ e }}</div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Bulk Offers -->
        <mat-card class="op-card">
          <mat-card-header><mat-card-title>Bulk Generate Offer Letters</mat-card-title></mat-card-header>
          <mat-card-content>
            <p>Generate PDF offer letters for all eligible candidates (QUALIFIED + BGC Passed).</p>
            <button mat-raised-button color="accent" [disabled]="processing" (click)="bulkOffers()">
              <mat-icon>description</mat-icon> Generate Offer Letters
            </button>
            <div class="result-box" *ngIf="offerResult">
              <div><strong>Eligible:</strong> {{ offerResult.totalEligible }}</div>
              <div class="success"><strong>Offers Generated:</strong> {{ offerResult.offersGenerated }}</div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Bulk Joining -->
        <mat-card class="op-card">
          <mat-card-header><mat-card-title>Bulk Generate Joining Letters</mat-card-title></mat-card-header>
          <mat-card-content>
            <p>Generate PDF joining letters for all candidates with OFFER_ACCEPTED. Auto-allocates location based on preferences and budget.</p>
            <button mat-raised-button color="accent" [disabled]="processing" (click)="bulkJoining()">
              <mat-icon>how_to_reg</mat-icon> Generate Joining Letters
            </button>
            <div class="result-box" *ngIf="joiningResult">
              <div><strong>Total Accepted:</strong> {{ joiningResult.totalAccepted }}</div>
              <div class="success"><strong>Joining Generated:</strong> {{ joiningResult.joiningGenerated }}</div>
              <div class="warn"><strong>On Hold:</strong> {{ joiningResult.onHold }}</div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .bulk-page { display: flex; flex-direction: column; gap: 20px; }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 20px; }
    .op-card { border-radius: 12px !important; padding: 16px; }
    .op-card p { color: #475569; font-size: 13px; margin: 8px 0 16px; }
    .btn-row { display: flex; gap: 12px; flex-wrap: wrap; }
    .result-box { margin-top: 16px; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; }
    .success { color: #059669; }
    .fail, .err-line { color: #dc2626; }
    .warn { color: #d97706; }
    .err-line { font-size: 12px; margin-top: 4px; }
  `],
  standalone: false,
})
export class HrBulkComponent {
  templateUrl = API_ENDPOINTS.HR_BULK.TEMPLATE;
  uploadResult: any = null;
  offerResult: any = null;
  joiningResult: any = null;
  processing = false;

  constructor(private http: HttpClient, private toast: ToastService) {}

  onExcelSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    this.processing = true;
    this.http.post<any>(API_ENDPOINTS.HR_BULK.UPLOAD, fd).subscribe({
      next: (res) => { this.uploadResult = res; this.processing = false; this.toast.success('Upload processed.'); },
      error: () => { this.processing = false; this.toast.error('Upload failed.'); },
    });
  }

  bulkOffers(): void {
    this.processing = true;
    this.http.post<any>(API_ENDPOINTS.HR_BULK.GENERATE_OFFERS, {}).subscribe({
      next: (res) => { this.offerResult = res; this.processing = false; this.toast.success('Offer generation complete.'); },
      error: () => { this.processing = false; this.toast.error('Failed.'); },
    });
  }

  bulkJoining(): void {
    this.processing = true;
    this.http.post<any>(API_ENDPOINTS.HR_BULK.GENERATE_JOINING, {}).subscribe({
      next: (res) => { this.joiningResult = res; this.processing = false; this.toast.success('Joining letter generation complete.'); },
      error: () => { this.processing = false; this.toast.error('Failed.'); },
    });
  }
}
