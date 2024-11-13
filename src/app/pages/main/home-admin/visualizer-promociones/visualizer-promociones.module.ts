import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizerPromocionesPageRoutingModule } from './visualizer-promociones-routing.module';

import { VisualizerPromocionesPage } from './visualizer-promociones.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizerPromocionesPageRoutingModule,
    SharedModule
  ],
  declarations: [VisualizerPromocionesPage]
})
export class VisualizerPromocionesPageModule {}
