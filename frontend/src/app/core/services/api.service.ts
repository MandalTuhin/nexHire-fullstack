import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Jobs
  getJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/jobs`);
  }

  createJob(data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/jobs`, data);
  }

  // Applications
  applyToJob(jobId: number): Observable<any> {
    return this.http.post<any>(`${this.base}/applications`, { jobId });
  }

  getMyApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/applications/my`);
  }

  getAllApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/applications`);
  }

  startAssessment(applicationId: number): Observable<any> {
    return this.http.put<any>(`${this.base}/applications/${applicationId}/start-assessment`, {});
  }

  // Assessments
  enterScore(applicationId: number, score: number, remarks: string): Observable<any> {
    return this.http.post<any>(`${this.base}/assessments/${applicationId}`, { score, remarks });
  }

  qualifyCandidate(applicationId: number): Observable<any> {
    return this.http.put<any>(`${this.base}/assessments/${applicationId}/qualify`, {});
  }

  rejectCandidate(applicationId: number): Observable<any> {
    return this.http.put<any>(`${this.base}/assessments/${applicationId}/reject`, {});
  }

  // Offers
  sendOffer(applicationId: number, content: string): Observable<any> {
    return this.http.post<any>(`${this.base}/offers/${applicationId}`, { content });
  }

  getMyOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/offers/my`);
  }

  acceptOffer(offerId: number): Observable<any> {
    return this.http.put<any>(`${this.base}/offers/${offerId}/accept`, {});
  }

  rejectOffer(offerId: number): Observable<any> {
    return this.http.put<any>(`${this.base}/offers/${offerId}/reject`, {});
  }

  // Joining Letters
  sendJoiningLetter(applicationId: number, data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/joining-letters/${applicationId}`, data);
  }

  getMyJoiningLetters(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/joining-letters/my`);
  }

  acceptJoiningLetter(letterId: number): Observable<any> {
    return this.http.put<any>(`${this.base}/joining-letters/${letterId}/accept`, {});
  }

  // Locations
  getLocations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/locations`);
  }
}
