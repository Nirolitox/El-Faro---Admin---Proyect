import { Component, inject, Inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PedidosPagos } from 'src/app/models/pedidos_pagos.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ViewPedidosComponent } from 'src/app/shared/components/view-pedidos/view-pedidos.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  pedidosPagos: any[] = [];
  pedidosPorAtender: any[] = [];
  pedidosAtendidos: any[] = [];
  loading: boolean = true;
  pedidoSeleccionado: any = null;  // Almacena el pedido seleccionado
  navCrtl = inject(NavController); // Inyecta ModalController

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService) {}

  ngOnInit() {
    this.getPedidosPagos();
  }

  doRefresh(event) {
    this.getPedidosPagos();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  close() {
    this.navCrtl.back();
  }

  // Obtener pedidos_pagos desde Firebase
  // Obtener pedidos_pagos desde Firebase
getPedidosPagos() {
  const path = 'pedidos_pagos';
  this.firebaseSvc.getCollectionData(path).subscribe({
    next: (res: any[]) => {
      this.pedidosPagos = res;

      // Filtrar pedidos por estado "En Espera..." para atender y "Atendido"
      this.pedidosPorAtender = this.pedidosPagos.filter(pedido => pedido.status === 'En Espera...');
      this.pedidosAtendidos = this.pedidosPagos.filter(pedido => pedido.status === 'Atendido');

      // Cachear imágenes en localStorage
      this.cacheImages(res);

      this.loading = false;
    },
    error: (err) => {
      this.loading = false;
      this.utilsSvc.presentAlert({ message: 'Error al cargar las notificaciones' });
    }
  });
}


  // Método para cachear imágenes
  cacheImages(pedidos: any[]) {
    pedidos.forEach(pedido => {
      if (pedido.image) {
        localStorage.setItem(`image_${pedido.id}`, pedido.image); // Asumiendo que cada pedido tiene un campo 'id' único
      }
    });
  }

  getCachedImage(pedidoId: string): string | null {
    return localStorage.getItem(`image_${pedidoId}`);
  }

  // Calcular el total de un pedido sumando el subtotal de cada producto
  calcularTotal(listaProductos: any[]): number {
    return listaProductos.reduce((acc, producto) => acc + producto.sub_total, 0);
  }

  async detailpedido(pedido?: PedidosPagos) {

    let success = await this.utilsSvc.presentModal({
      component: ViewPedidosComponent,
      cssClass: 'add-update-modal',
      componentProps: { pedido }
    })
  }

  // Cerrar el detalle del pedido
  cerrarDetalle() {
    this.pedidoSeleccionado = null;
  }

}
