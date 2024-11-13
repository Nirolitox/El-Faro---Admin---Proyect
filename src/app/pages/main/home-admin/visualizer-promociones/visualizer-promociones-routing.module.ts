import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizerPromocionesPage } from './visualizer-promociones.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizerPromocionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizerPromocionesPageRoutingModule {}
