import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthAdminPage } from './auth-admin.page';

const routes: Routes = [
  {
    path: '',
    component: AuthAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthAdminPageRoutingModule {}
