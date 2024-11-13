import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizerProductsPage } from './visualizer-products.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizerProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizerProductsPageRoutingModule {}
