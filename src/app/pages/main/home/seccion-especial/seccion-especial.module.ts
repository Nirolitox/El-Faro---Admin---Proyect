import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeccionEspecialPageRoutingModule } from './seccion-especial-routing.module';

import { SeccionEspecialPage } from './seccion-especial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeccionEspecialPageRoutingModule
  ],
  declarations: [SeccionEspecialPage]
})
export class SeccionEspecialPageModule {}
