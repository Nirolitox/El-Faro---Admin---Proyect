import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagarPedidosPageRoutingModule } from './pagar-pedidos-routing.module';

import { PagarPedidosPage } from './pagar-pedidos.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagarPedidosPageRoutingModule,
    SharedModule
  ],
  declarations: [PagarPedidosPage]
})
export class PagarPedidosPageModule {}
