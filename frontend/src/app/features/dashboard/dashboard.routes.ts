import { Routes } from '@angular/router';
import { DashboardShellComponent } from './dashboard-shell/dashboard-shell.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardShellComponent,
    children: [
      { path: '', component: DashboardHomeComponent }
    ]
  }
];
