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
        path: 'complaint-dashboard',
        loadComponent: () =>
          import('./complaint-dashboard/complaint-dashboard.component').then(
            (m) => m.ComplaintDashboardComponent,
          ),
        title: 'Complaint Dashboard',
      },
      {
        path: 'trip-dashboard-vlc',
        loadComponent: () =>
          import('./trip-dashboard-vlc/trip-dashboard-vlc.component').then(
            (m) => m.TripDashboardVlcComponent,
          ),
        title: 'Trip Dashboard VLC',
      },
      {
        path: 'summary-dashboard',
        loadComponent: () =>
          import('./summary-dashboard/summary-dashboard.component').then(
            (m) => m.SummaryDashboardComponent,
          ),
        title: 'Summary Dashboard',
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
        path: 'remote-lock-unlock',
        loadComponent: () =>
          import('./remote-lock-unlock/remote-lock-unlock.component').then(
            (m) => m.RemoteLockUnlockComponent,
          ),
        title: 'Remote Lock/Unlock',
      },
      {
        path: 'load-planning',
        loadComponent: () =>
          import('./load-planning/load-planning.component').then(
            (m) => m.LoadPlanningComponent,
          ),
        title: 'Load Planning',
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
        path: 'maker-dashboard',
        loadComponent: () =>
          import('./maker-dashboard/maker-dashboard.component').then(
            (m) => m.MakerDashboardComponent,
          ),
      },
      {
        path: 'leci-add-form',
        loadComponent: () =>
          import('./leci-add-form/leci-add-form.component').then(
            (m) => m.LeciAddFormComponent,
          ),
        title: 'Leci Add Form',
      },
      {
        path: 'dispatch-planning-report',
        loadComponent: () =>
          import('./dispatch-planning-report/dispatch-planning-report.component').then(
            (m) => m.DispatchPlanningReportComponent,
          ),
        title: 'Dispatch Planning Report',
      },
      {
        path: 'dispatch-planning',
        loadComponent: () =>
          import('./dispatch-planning/dispatch-planning.component').then(
            (m) => m.DispatchPlanningComponent,
          ),
        title: 'Dispatch Planning',
      },
      {
        path: 'document-wallet',
        loadComponent: () =>
          import('./document-wallet/document-wallet.component').then(
            (m) => m.DocumentWalletComponent,
          ),
        title: 'Document Wallet',
      },
      {
        path: 'eta-report',
        loadComponent: () =>
          import('./eta-report/eta-report.component').then(
            (m) => m.EtaReportComponent,
          ),
        title: 'ETA Report',
      },
      {
        path: 'summarized-report',
        loadComponent: () =>
          import('./summarized-report/summarized-report.component').then(
            (m) => m.SummarizedReportComponent,
          ),
        title: 'Summarized Report',
      },
      {
        path: 'cart-dashboard',
        loadComponent: () =>
          import('./cart-dashboard/cart-dashboard.component').then(
            (m) => m.CartDashboardComponent,
          ),
        title: 'Cart Dashboard',
      },
      {
        path: 'adda',
        loadComponent: () =>
          import('./adda/adda.component').then((m) => m.AddaComponent),
        title: 'Adda',
      },
      {
        path: 'franchise',
        loadComponent: () =>
          import('./franchise/franchise.component').then(
            (m) => m.FranchiseComponent,
          ),
        title: 'Franchise',
      },
      {
        path: 'franchise-mapping',
        loadComponent: () =>
          import('./franchise-mapping/franchise-mapping.component').then(
            (m) => m.FranchiseMappingComponent,
          ),
        title: 'Franchise Mapping',
      },
      {
        path: 'cart-mapping',
        loadComponent: () =>
          import('./cart-mapping/cart-mapping.component').then(
            (m) => m.CartMappingComponent,
          ),
        title: 'Cart Mapping',
      },
      {
        path: 'agreement-info',
        loadComponent: () =>
          import('./agreement-info/agreement-info.component').then(
            (m) => m.AgreementInfoComponent,
          ),
        title: 'Agreement Info',
      },
      {
        path: 'cart-timing',
        loadComponent: () =>
          import('./cart-timing/cart-timing.component').then(
            (m) => m.CartTimingComponent,
          ),
        title: 'Cart Timing',
      },
      {
        path: 'mcc-mapping-info',
        loadComponent: () =>
          import('./mcc-mapping-info/mcc-mapping-info.component').then(
            (m) => m.MccMappingInfoComponent,
          ),
        title: 'MCC Mapping Info',
      },
      {
        path: 'maker-checker',
        loadComponent: () =>
          import('./maker-checker/maker-checker.component').then(
            (m) => m.MakerCheckerComponent,
          ),
        title: 'Maker Checker',
      },
      {
        path: 'Home',
        loadComponent: () =>
          import('./home traking/home/home.component').then(
            (m) => m.HomeComponent,
          ),
        title: 'Home',
      },
      {
        path: 'live',
        loadComponent: () =>
          import('./home traking/live/live.component').then(
            (m) => m.LiveComponent,
          ),
        title: 'Live',
      },
      {
        path: 'Thirdlive',
        loadComponent: () =>
          import('./home traking/thirdlive/thirdlive.component').then(
            (m) => m.ThirdliveComponent,
          ),
        title: 'Live',
      },
      {
        path: 'blacklist',
        loadComponent: () =>
          import('./blacklist/blacklist.component').then(
            (m) => m.BlacklistComponent,
          ),
        title: 'Blacklist Report',
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
      {
        path: 'indent-wise',
        loadComponent: () =>
          import('./indent-trip-report/indent-trip-report.component').then(
            (m) => m.IndentTripReportComponent,
          ),
        title: 'Indent Wise Report',
      },
      {
        path: 'lid-report',
        loadComponent: () =>
          import('./lid-trip-report/lid-trip-report.component').then(
            (m) => m.LidTripReportComponent,
          ),
        title: 'LID Report',
      },
      {
        path: 'e-lock-report',
        loadComponent: () =>
          import('./elock-trip-report/elock-trip-report.component').then(
            (m) => m.ElockTripReportComponent,
          ),
        title: 'E-Lock Report',
      },
      {
        path: 'cart-report',
        loadComponent: () =>
          import('./cart-report/cart-report.component').then(
            (m) => m.CartReportComponent,
          ),
        title: 'Cart Report',
      },
      {
        path: 'cart-report-exception',
        loadComponent: () =>
          import('./cart-exception-report/cart-exception-report.component').then(
            (m) => m.CartExceptionReportComponent,
          ),
        title: 'Cart Report Exception',
      },
      {
        path: 'franchise-report',
        loadComponent: () =>
          import('./franchise-report/franchise-report.component').then(
            (m) => m.FranchiseReportComponent,
          ),
        title: 'Franchise Report',
      },
      {
        path: 'distance-report',
        loadComponent: () =>
          import('./Reports/distance-report/distance-report.component').then(
            (m) => m.DistanceReportComponent,
          ),
        title: 'Distance Report',
      },
      {
        path: 'travel-report',
        loadComponent: () =>
          import('./Reports/travel/travel.component').then(
            (m) => m.TravelComponent,
          ),
        title: 'Travel Report',
      },
      {
        path: 'halt-report',
        loadComponent: () =>
          import('./Reports/halt-report/halt-report.component').then(
            (m) => m.HaltReportComponent,
          ),
        title: 'Halt Report',
      },
      {
        path: 'trip-summary',
        loadComponent: () =>
          import('./trip-summary-report/trip-summary-report.component').then(
            (m) => m.TripSummaryReportComponent,
          ),
        title: 'Trip Summary Report',
      },
      {
        path: 'monthly-report',
        loadComponent: () =>
          import('./Reports/monthly-report/monthly-report.component').then(
            (m) => m.MonthlyReportComponent,
          ),
        title: 'Monthly Report',
      },
      {
        path: 'adda-wise-report',
        loadComponent: () =>
          import('./adda-wise-report/adda-wise-report.component').then(
            (m) => m.AddaWiseReportComponent,
          ),
        title: 'Adda Wise Report',
      },
      {
        path: 'cart-wise-report',
        loadComponent: () =>
          import('./cart-wise-report/cart-wise-report.component').then(
            (m) => m.CartWiseReportComponent,
          ),
        title: 'Cart Wise Report',
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
