import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPagoPage } from './view-pago.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPagoPageRoutingModule {}
