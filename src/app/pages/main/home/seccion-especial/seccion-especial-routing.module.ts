import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeccionEspecialPage } from './seccion-especial.page';

const routes: Routes = [
  {
    path: '',
    component: SeccionEspecialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeccionEspecialPageRoutingModule {}
