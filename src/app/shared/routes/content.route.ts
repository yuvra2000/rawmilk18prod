import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { rawMilkRoutingModule } from '../../components/rawmilk/rawmilk.routes';

export const content: Routes = [
  {
    path: '',
    children: [
      ...rawMilkRoutingModule.routes
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(content)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}
 