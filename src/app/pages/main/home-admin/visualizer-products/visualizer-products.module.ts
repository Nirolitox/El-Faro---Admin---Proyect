import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizerProductsPageRoutingModule } from './visualizer-products-routing.module';

import { VisualizerProductsPage } from './visualizer-products.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizerProductsPageRoutingModule,
    SharedModule
  ],
  declarations: [VisualizerProductsPage]
})
export class VisualizerProductsPageModule {}
