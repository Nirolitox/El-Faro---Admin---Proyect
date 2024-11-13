import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizerRecetasPage } from './visualizer-recetas.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizerRecetasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizerRecetasPageRoutingModule {}
