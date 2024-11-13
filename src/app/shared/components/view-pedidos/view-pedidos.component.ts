import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { PedidosPagos, ProductoPedido } from 'src/app/models/pedidos_pagos.model';
import { ViewPagoPage } from 'src/app/pages/main/home-admin/view-pago/view-pago.page';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-view-pedidos',
  templateUrl: './view-pedidos.component.html',
  styleUrls: ['./view-pedidos.component.scss'],
})
export class ViewPedidosComponent implements OnInit {
  @Input() pedido: PedidosPagos;
  nuevoStatus: string;
  mensaje: string = '';
  tasaCambio: number = 0;
  totalEnBs: number = 0;
  totalConDelivery: number = 0;
  ultimaTasaLocal: number | null = null;
  ultimaTasaCentral: number | null = null;
  ultimaTasaDelivery: number | null = null;

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService) { }

  ngOnInit() {
    this.obtenerTasaCambio();
    this.obtenerUltimaTasa();
  }

  async obtenerUltimaTasa() {
    try {
      const path = 'tasa_dolar';

      this.firebaseSvc.getCollectionData(path, {
        limit: 1,
        orderBy: { field: 'fecha', direction: 'desc' }
      }).pipe(first())
        .subscribe(tasas => {
          if (tasas.length > 0) {
            const ultimaTasa = tasas[0];
            this.ultimaTasaCentral = ultimaTasa['valor_central'];
            this.ultimaTasaLocal = ultimaTasa['valor_local'];
            this.ultimaTasaDelivery = ultimaTasa['valor_delivery'];
            this.calculateTotalEnBs();
          }
        });
    } catch (error) {
      console.error('Error obteniendo la última tasa:', error);
    }
  }

  obtenerTasaCambio() {
    this.firebaseSvc.getUltimaTasaCambio().subscribe((valorLocal) => {
      this.tasaCambio = valorLocal;
    });
  }

  calcularTotal(listaProductos: ProductoPedido[]): number {
    return listaProductos.reduce((acc, producto) => acc + (producto.sub_total || 0), 0);
  }

  calculateTotalEnBs() {
    if (this.totalConDelivery && this.ultimaTasaLocal) {
      this.totalEnBs = this.totalConDelivery * this.ultimaTasaLocal;
    } else {
      this.totalEnBs = 0;
    }
  }

  async actualizarPedido() {
    if (!this.nuevoStatus) {
      this.utilsSvc.presentAlert({ message: 'Selecciona un estado para el pedido' });
      return;
    }

    const path = `pedidos_pagos/${this.pedido.id}`;
    const estadoAnterior = this.pedido.status;

    try {
      // Actualizamos el estado del pedido
      await this.firebaseSvc.updateDocument(path, { status: this.nuevoStatus });

      // Si el nuevo estado es "Entregado", realiza acciones adicionales
      if (this.nuevoStatus === 'Entregado') {
        // Elimina el pedido si estaba en "Atendido" o "En Espera..." y ahora es "Entregado"
        if (estadoAnterior === 'Atendido' || estadoAnterior === 'En Espera...') {
          await this.firebaseSvc.deleteDocument(path);
          this.utilsSvc.presentToast({ message: 'Pedido Entregado y eliminado', color: 'success', duration: 2000 });
        }

        // Enviar notificación al usuario
        const notificacion = {
          mensaje: this.mensaje || 'Tu pedido ha sido entregado',
          userId: this.pedido.userId,
          timestamp: new Date(),
          pedidoId: this.pedido.id
        };

        const notifPath = 'notificaciones';
        await this.firebaseSvc.addDocument(notifPath, notificacion);
        this.utilsSvc.presentToast({ message: 'Notificación enviada al usuario', color: 'success', duration: 2000 });

        this.close();
        return;
      }

      // Si el nuevo estado es "Atendido", actualiza otros pedidos relacionados
      if (this.nuevoStatus === 'Atendido') {
        const userPath = `users/${this.pedido.userId}/pedidos`;

        this.firebaseSvc.getCollectionData(userPath).subscribe((pedidos) => {
          pedidos.forEach((pedidoCliente) => {
            if (pedidoCliente['status'] === 'En Espera...') {
              this.firebaseSvc.updateDocument(`${userPath}/${pedidoCliente.id}`, { status: 'Atendido' })
                .then(() => console.log(`Pedido ${pedidoCliente.id} actualizado a Atendido`))
                .catch(err => console.error(`Error al actualizar pedido ${pedidoCliente.id}:`, err));

              const productosActualizados = pedidoCliente['lista_productos'].map((producto: ProductoPedido) => {
                if (producto.id === this.pedido.lista_productos.find(p => p.id === producto.id)?.id) {
                  return { ...producto, status: 'Atendido' };
                }
                return producto;
              });

              this.firebaseSvc.updateDocument(`${userPath}/${pedidoCliente.id}`, { lista_productos: productosActualizados })
                .then(() => console.log(`Productos del pedido ${pedidoCliente.id} actualizados a Atendido`))
                .catch(err => console.error(`Error al actualizar productos en pedido ${pedidoCliente.id}:`, err));
            }
          });
        });
      }

      // Enviar notificación de actualización general
      const notificacion = {
        mensaje: this.mensaje || 'Tu pedido ha sido actualizado',
        userId: this.pedido.userId,
        timestamp: new Date(),
        pedidoId: this.pedido.id
      };

      const notifPath = 'notificaciones';
      await this.firebaseSvc.addDocument(notifPath, notificacion);
      this.utilsSvc.presentToast({ message: 'Notificación enviada al usuario', color: 'success', duration: 2000 });

      this.close();

    } catch (err) {
      this.utilsSvc.presentAlert({ message: 'Error al actualizar el estado del pedido' });
      console.error('Error actualizando el pedido en pedidos_pagos:', err);
    }
  }


  close() {
    this.utilsSvc.dismissModal();
  }

  async VerPago(pedido?: PedidosPagos) {
    let success = await this.utilsSvc.presentModal({
      component: ViewPagoPage,
      cssClass: 'add-update-modal',
      componentProps: { pedido }
    });
  }
}
