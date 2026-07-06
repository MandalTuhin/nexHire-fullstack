import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'employee',
    canActivate: [authGuard, roleGuard(['EMPLOYEE'])],
    loadComponent: () =>
      import('./features/employee/employee-dashboard.component').then(
        (m) => m.EmployeeDashboardComponent,
      ),
  },
  {
    path: 'hr',
    canActivate: [authGuard, roleGuard(['HR'])],
    loadComponent: () =>
      import('./features/hr/hr-dashboard.component').then((m) => m.HrDashboardComponent),
  },
  {
    path: 'rmg',
    canActivate: [authGuard, roleGuard(['RMG'])],
    loadComponent: () =>
      import('./features/rmg/rmg-dashboard.component').then((m) => m.RmgDashboardComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () =>
      import('./features/admin/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  { path: '**', redirectTo: '/login' },
];
