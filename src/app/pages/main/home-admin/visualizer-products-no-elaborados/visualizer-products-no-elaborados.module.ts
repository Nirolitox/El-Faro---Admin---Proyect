import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizerProductsNoElaboradosPageRoutingModule } from './visualizer-products-no-elaborados-routing.module';

import { VisualizerProductsNoElaboradosPage } from './visualizer-products-no-elaborados.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizerProductsNoElaboradosPageRoutingModule,
    SharedModule
  ],
  declarations: [VisualizerProductsNoElaboradosPage]
})
export class VisualizerProductsNoElaboradosPageModule {}
