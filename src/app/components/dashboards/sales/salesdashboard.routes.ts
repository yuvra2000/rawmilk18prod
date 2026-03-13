import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const admin: Routes = [
    {path:'',children:[ {
        path: 'sales',
        loadComponent: () =>
          import('../sales/sales.component').then((m) => m.SalesComponent),
          title: 'Zynix - Sales'
      },
    ]
      }
]
@NgModule({
    imports: [RouterModule.forChild(admin)],
    exports: [RouterModule],
  })
  export class salesRoutingModule {
    static routes = admin;
  }