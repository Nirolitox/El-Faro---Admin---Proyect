import { Component, inject, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CrearPedido } from 'src/app/models/create_pedidos.model';
import { PedidosPagos } from 'src/app/models/pedidos_pagos.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-view-pago',
  templateUrl: './view-pago.page.html',
  styleUrls: ['./view-pago.page.scss'],
})
export class ViewPagoPage implements OnInit {

  @Input () pedido: PedidosPagos;
  navCrtl = inject(NavController);
  utilsSvc = inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.utilsSvc.dismissModal();
  }

}
