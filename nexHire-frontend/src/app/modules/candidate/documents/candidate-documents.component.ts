import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../config/api-endpoints';
import { ToastService } from '../../../shared/services/toast.service';

interface DocRecord { id: number; docType: string; fileName: string; uploadedAt: string; }

@Component({
  selector: 'app-candidate-documents',
  template: `
    <div class="docs-page">
      <app-page-header title="My Documents" subtitle="Upload required documents for verification."></app-page-header>

      <mat-card class="upload-card">
        <mat-card-header><mat-card-title>Upload Document</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="upload-row">
            <mat-form-field appearance="outline">
              <mat-label>Document Type</mat-label>
              <mat-select [(value)]="selectedType">
                <mat-option value="RESUME">Resume</mat-option>
                <mat-option value="CLASS10_CERT">Class 10 Certificate</mat-option>
                <mat-option value="CLASS12_CERT">Class 12 Certificate</mat-option>
                <mat-option value="BTECH_MARKSHEET">B.Tech Marksheet</mat-option>
                <mat-option value="ID_PROOF">ID Proof</mat-option>
                <mat-option value="OTHER">Other</mat-option>
              </mat-select>
            </mat-form-field>
            <input type="file" #fileInput (change)="onFileSelected($event)" style="display:none">
            <button mat-stroked-button (click)="fileInput.click()">{{ selectedFile ? selectedFile.name : 'Choose File' }}</button>
            <button mat-raised-button color="primary" [disabled]="!selectedFile || !selectedType || uploading" (click)="upload()">{{ uploading ? 'Uploading...' : 'Upload' }}</button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="docs-list-card">
        <mat-card-header><mat-card-title>Uploaded Documents</mat-card-title></mat-card-header>
        <mat-card-content>
          <app-empty-state *ngIf="docs.length === 0" icon="folder_open" title="No documents uploaded" subtitle="Upload your documents above."></app-empty-state>
          <table mat-table [dataSource]="docs" *ngIf="docs.length > 0" class="full-width">
            <ng-container matColumnDef="docType"><th mat-header-cell *matHeaderCellDef>Type</th><td mat-cell *matCellDef="let d">{{ d.docType }}</td></ng-container>
            <ng-container matColumnDef="fileName"><th mat-header-cell *matHeaderCellDef>File Name</th><td mat-cell *matCellDef="let d">{{ d.fileName }}</td></ng-container>
            <ng-container matColumnDef="uploadedAt"><th mat-header-cell *matHeaderCellDef>Uploaded</th><td mat-cell *matCellDef="let d">{{ d.uploadedAt | date:'short' }}</td></ng-container>
            <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef="let d"><a mat-icon-button [href]="downloadUrl(d.id)" target="_blank"><mat-icon>download</mat-icon></a></td></ng-container>
            <tr mat-header-row *matHeaderRowDef="['docType','fileName','uploadedAt','actions']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['docType','fileName','uploadedAt','actions']"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .docs-page { display: flex; flex-direction: column; gap: 20px; }
    .upload-card, .docs-list-card { border-radius: 12px !important; padding: 16px; }
    .upload-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding-top: 12px; }
    .full-width { width: 100%; }
    mat-form-field { width: 200px; }
  `],
  standalone: false,
})
export class CandidateDocumentsComponent implements OnInit {
  docs: DocRecord[] = [];
  selectedType = '';
  selectedFile: File | null = null;
  uploading = false;

  constructor(private http: HttpClient, private toast: ToastService) {}

  ngOnInit(): void { this.loadDocs(); }

  loadDocs(): void {
    this.http.get<DocRecord[]>(API_ENDPOINTS.DOCUMENTS.MY).subscribe(list => this.docs = list || []);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  upload(): void {
    if (!this.selectedFile || !this.selectedType) return;
    this.uploading = true;
    const fd = new FormData();
    fd.append('file', this.selectedFile);
    fd.append('docType', this.selectedType);
    this.http.post(API_ENDPOINTS.DOCUMENTS.UPLOAD, fd).subscribe({
      next: () => { this.uploading = false; this.selectedFile = null; this.toast.success('Document uploaded.'); this.loadDocs(); },
      error: () => { this.uploading = false; this.toast.error('Upload failed.'); },
    });
  }

  downloadUrl(id: number): string { return API_ENDPOINTS.DOCUMENTS.DOWNLOAD(id); }
}
