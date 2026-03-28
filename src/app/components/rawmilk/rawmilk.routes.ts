import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const rawMilkRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'trip-dashboard',
        loadComponent: () =>
          import('./trip-dashboard/trip-dashboard.component').then(
            (m) => m.TripDashboardComponent,
          ),
        title: 'Trip Dashboard',
      },
      {
        path: 'view-indent',
        loadComponent: () =>
          import('./view-indent/view-indent.component').then(
            (m) => m.ViewIndentComponent,
          ),
        title: 'View Indent',
      },
      {
        path: 'view-indent-supplier',
        loadComponent: () =>
          import('./view-indent-supplier/view-indent-supplier.component').then(
            (m) => m.ViewIndentSupplierComponent,
          ),
        title: 'View Indent (Supplier)',
      },
    ],
  },
  {
    path: 'reports',
    children: [
      {
        path: 'alert-report',
        loadComponent: () =>
          import('./alert-report/alert-report.component').then(
            (m) => m.AlertReportComponent
          ),
        title: 'Alert Report'
      },
      {
        path: 'tanker-wise',
        loadComponent: () =>
          import('./tanker-wise-trip-report/tanker-wise-trip-report.component').then(
            (m) => m.TankerWiseTripReportComponent
          ),
        title: 'Tanker Wise Trip Report'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(rawMilkRoutes)],
  exports: [RouterModule],
})
export class rawMilkRoutingModule {
  static routes = rawMilkRoutes;
}
