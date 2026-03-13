import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { salesRoutingModule } from '../../components/dashboards/sales/salesdashboard.routes';

export const content: Routes = [
  {
    path: '',
    children: [
      ...salesRoutingModule.routes,
    ],
  },
]; 
@NgModule({
  imports: [RouterModule.forRoot(content)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}
 