import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizerProductsNoElaboradosPage } from './visualizer-products-no-elaborados.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizerProductsNoElaboradosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizerProductsNoElaboradosPageRoutingModule {}
