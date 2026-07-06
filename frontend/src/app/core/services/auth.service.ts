import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: string;
  lifecycleStatus: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser$ = new BehaviorSubject<LoginResponse | null>(this.getStoredUser());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res));
          this.currentUser$.next(res);
        }),
      );
  }

  register(
    name: string,
    email: string,
    password: string,
    phone: string,
  ): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/register`, {
        name,
        email,
        password,
        phone,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res));
          this.currentUser$.next(res);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): LoginResponse | null {
    return this.currentUser$.value;
  }

  getUserObservable(): Observable<LoginResponse | null> {
    return this.currentUser$.asObservable();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return this.getUser()?.role || null;
  }

  getDashboardRoute(): string {
    const role = this.getRole();
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'HR':
        return '/hr';
      case 'RMG':
        return '/rmg';
      case 'EMPLOYEE':
        return '/employee';
      default:
        return '/login';
    }
  }

  private getStoredUser(): LoginResponse | null {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }
}
