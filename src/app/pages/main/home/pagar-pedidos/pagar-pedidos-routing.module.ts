import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagarPedidosPage } from './pagar-pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: PagarPedidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagarPedidosPageRoutingModule {}
