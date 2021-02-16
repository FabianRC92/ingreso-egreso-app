import { NgModule } from '@angular/core';
import { AuthGuard } from '../services/auth.guard';
import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routes';
import { Routes, RouterModule } from '@angular/router';


const routesHijas: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: dashboardRoutes
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routesHijas)
  ], exports: [
    RouterModule
  ]
})
export class DashboardRoutesModule { }
