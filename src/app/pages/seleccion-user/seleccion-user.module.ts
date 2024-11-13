import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeleccionUserPageRoutingModule } from './seleccion-user-routing.module';

import { SeleccionUserPage } from './seleccion-user.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeleccionUserPageRoutingModule,
    SharedModule
  ],
  declarations: [SeleccionUserPage]
})
export class SeleccionUserPageModule {}
