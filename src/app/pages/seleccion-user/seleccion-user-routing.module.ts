import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeleccionUserPage } from './seleccion-user.page';

const routes: Routes = [
  {
    path: '',
    component: SeleccionUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeleccionUserPageRoutingModule {}
