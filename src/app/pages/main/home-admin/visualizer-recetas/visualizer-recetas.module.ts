import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizerRecetasPageRoutingModule } from './visualizer-recetas-routing.module';

import { VisualizerRecetasPage } from './visualizer-recetas.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizerRecetasPageRoutingModule,
    SharedModule
  ],
  declarations: [VisualizerRecetasPage]
})
export class VisualizerRecetasPageModule {}
