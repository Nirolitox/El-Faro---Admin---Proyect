import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewPagoPageRoutingModule } from './view-pago-routing.module';

import { ViewPagoPage } from './view-pago.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewPagoPageRoutingModule,
    SharedModule
  ],
  declarations: [ViewPagoPage]
})
export class ViewPagoPageModule {}
