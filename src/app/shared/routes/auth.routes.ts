import { RouterModule, Routes } from '@angular/router';
import { errorRoutingModule } from '../../components/error/error.routes';
import { NgModule } from '@angular/core';

export const authen: Routes = [
    { path: '', children: [
        ...errorRoutingModule.routes,
 ] },
 {
    path: 'auth/login',
    loadComponent: () =>
      import('../../authentication/login/login.component').then((m) => m.LoginComponent),
  },
]

@NgModule({
    imports: [RouterModule.forRoot(authen, {  
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'top',
      })],
    exports: [RouterModule]
})
export class AuthenticationsRoutingModule { 


}