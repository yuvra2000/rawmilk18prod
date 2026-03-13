import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const rawMilkRoutes: Routes = [
    {path:'',children:[ {
        path: 'rawmilk',
        loadComponent: () =>
          import('./trip-dashboard/trip-dashboard.component').then((m) => m.TripDashboardComponent),
          title: 'Trip Dashboard'
      },
      {
        path: 'view-indent',
        loadComponent: () => 
            import('./view-indent/view-indent.component').then((m) => m.ViewIndentComponent),
            title: 'View Indent'
      },
      {
        path: 'view-indent-m',
        loadComponent: () => 
            import('./view-indent-m/view-indent-m.component').then((m) => m.ViewIndentMComponent),
            title: 'View Indent'
      }
    ]
      }
]
@NgModule({
    imports: [RouterModule.forChild(rawMilkRoutes)],
    exports: [RouterModule],
  })
  export class rawMilkRoutingModule {
    static routes = rawMilkRoutes;
  }