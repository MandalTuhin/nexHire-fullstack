import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import('./features/employee/employee-dashboard.component').then(
        (m) => m.EmployeeDashboardComponent,
      ),
  },
  {
    path: 'hr',
    loadComponent: () =>
      import('./features/hr/hr-dashboard.component').then((m) => m.HrDashboardComponent),
  },
  {
    path: 'rmg',
    loadComponent: () =>
      import('./features/rmg/rmg-dashboard.component').then((m) => m.RmgDashboardComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  { path: '**', redirectTo: '/login' },
];
