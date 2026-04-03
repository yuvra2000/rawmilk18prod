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
      {
        path: 'Allocate',
        loadComponent: () =>
          import('./allocated-indent/allocated-indent.component').then(
            (m) => m.AllocatedIndentComponent,
          ),
        title: 'Allocated Indent',
      },
      {
        path: 'Inventory',
        loadComponent: () =>
          import('./inventory/inventory.component').then(
            (m) => m.InventoryComponent,
          ),
        title: 'Inventory',
      },
      {
        path: 'create-dispatch',
        loadComponent: () =>
          import('./create-dispatch/create-dispatch.component').then(
            (m) => m.CreateDispatchComponent,
          ),
        title: 'Create Dispatch',
      },
      {
        path: 'projection',
        loadComponent: () =>
          import('./projection/projection.component').then(
            (m) => m.ProjectionComponent,
          ),
        title: 'Projection',
      },
      {
        path: 'leci-dashboard',
        loadComponent: () =>
          import('./leci-dashboard/leci-dashboard.component').then(
            (m) => m.LeciDashboardComponent,
          ),
        title: 'Leci Dashboard',
      },
      {
        path: 'leci-add-form',
        loadComponent: () =>
          import('./leci-add-form/leci-add-form.component').then(
            (m) => m.LeciAddFormComponent,
          ),
        title: 'Leci Add Form',
      }
    ],
  },
  {
    path: 'reports',
    children: [
      {
        path: 'alert-report',
        loadComponent: () =>
          import('./alert-report/alert-report.component').then(
            (m) => m.AlertReportComponent,
          ),
        title: 'Alert Report',
      },
      {
        path: 'tanker-wise',
        loadComponent: () =>
          import('./tanker-wise-trip-report/tanker-wise-trip-report.component').then(
            (m) => m.TankerWiseTripReportComponent,
          ),
        title: 'Tanker Wise Trip Report',
      },
      {
        path: 'leci-report',
        loadComponent: () =>
          import('./leci-report/leci-report.component').then(
            (m) => m.LeciReportComponent,
          ),
        title: 'Leci Report',
      },
      {
        path: 'mpc-wise',
        loadComponent: () =>
          import('./mpc-trip-report/mpc-trip-report.component').then(
            (m) => m.MpcTripReportComponent,
          ),
        title: 'Mpc Wise Report',
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(rawMilkRoutes)],
  exports: [RouterModule],
})
export class rawMilkRoutingModule {
  static routes = rawMilkRoutes;
}
