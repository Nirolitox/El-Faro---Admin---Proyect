import { Component, inject, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { CrearPedido } from 'src/app/models/create_pedidos.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CreatePedidoComponent } from 'src/app/shared/components/create-pedido/create-pedido.component';
import { PagarPedidosPage } from '../pagar-pedidos/pagar-pedidos.page';
import { PopoverNotificationsClientComponent } from 'src/app/shared/components/popover-notifications-client/popover-notifications-client.component';
import { NavController, PopoverController } from '@ionic/angular';
import { ImageCacheService } from 'src/app/services/image-cache.service';
import { CombosPage } from '../combos/combos.page';
import { Router, RouterLink } from '@angular/router';
import { MenuPage } from '../menu/menu.page';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  constructor(private navCtrl: NavController,private router: Router,private popoverCtrl: PopoverController) { }

  pedidos: CrearPedido []=[];
  loading: boolean = false;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  imageCacheSvc = inject(ImageCacheService);
  imageLoaded: boolean[] = [];
  total: number = 0;
  ultimaTasaParalelo: number | null = null;
  ultimaTasaCentral: number | null = null;
  ultimaTasaLocal: number | null = null;
  ultimaTasaDelivery: number | null = null;
  valor_delivery: number = 0;
  totalConDelivery: number = 0;
  totalEnBs: number = 0;  // Nueva propiedad para el total en Bs
  notificationCount: number = 0;




  ngOnInit() {
    this.listenToPedidos(); // Escuchar cambios en tiempo real
    this.getPedidos();
    this.obtenerUltimaTasa();
    this.getNotificationCount();
  }

  async pago(pago?: CrearPedido) {
    let success = await this.utilsSvc.presentModal({
      component: PagarPedidosPage,
      cssClass: 'add-update-modal',
      componentProps: { pago }
    });
    if (success) this.getPedidos();
  }



  user(): User{
    return this.utilsSvc.getFromLocalStorage('user')
  }


  async confirmarNuevoPedido() {
    const alert = await this.utilsSvc.presentAlert({
      header: '¿Deseas hacer otro pedido?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.pago();
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.navCtrl.back()
          }
        }
      ]
    });
  }


calculateTotalConDelivery() {
  if (this.pedidos.length > 0 && this.ultimaTasaDelivery && this.ultimaTasaLocal) {
    const tieneDelivery = this.pedidos.some(pedido => pedido.tipo_entrega === 'Delivery');
    if (tieneDelivery) {
      this.totalConDelivery = this.calculateTotal() + (this.ultimaTasaDelivery / this.ultimaTasaLocal);
    } else {
      this.totalConDelivery = this.calculateTotal();
    }
  } else {
    this.totalConDelivery = this.calculateTotal();  // Si no hay pedidos o tasas, solo calcula el total
  }
}

    // Método para obtener el total de notificaciones
    getNotificationCount() {
      const path = 'notificaciones';
      this.firebaseSvc.collectionQuery(path, 'userId', '==', this.user().uid).subscribe((notifications: any[]) => {
        this.notificationCount = notifications.length;
      });
    }

// Método para calcular el total sin delivery
calculateTotal() {
  return this.pedidos
    .filter(pedido => pedido.status === 'Por Pagar...')
    .reduce((total, pedido) => total + pedido.sub_total, 0);
}


  calculateTotalBs() {
    return this.calculateTotal() * (this.ultimaTasaLocal || 1);
  }

  // Método para calcular el total en Bs (usando ultimaTasaLocal)
  calculateTotalEnBs() {
    if (this.totalConDelivery && this.ultimaTasaLocal) {
      this.totalEnBs = this.totalConDelivery * this.ultimaTasaLocal;
    } else {
      this.totalEnBs = 0;  // Si no se puede calcular, se establece en 0
    }
  }

  ionViewWillEnter() {
    this.getPedidos();
    this.obtenerUltimaTasa();
    this.calculateTotalConDelivery();
    this.calculateTotalEnBs();


  }

  doRefresh(event) {

    setTimeout(() => {
      this.getPedidos();
      event.target.complete();
    }, 2000);
  }

  mostrarBotonPagar(): boolean {
    return this.pedidos.some(pedido => pedido.status === 'Por Pagar...');
  }

    ///=====OBTENER PEDIDOS=====////


 getPedidos() {
  let path = `users/${this.user().uid}/pedidos`;
  this.firebaseSvc.getCollectionData(path).subscribe({
    next: (res: any) => {
      this.pedidos = res.filter((pedido: CrearPedido) => pedido.status !== 'Entregado');
      this.calculateTotalConDelivery();  // Actualiza el total después de obtener los pedidos
      this.calculateTotalEnBs();  // Recalcula el total en Bs después de obtener los pedidos

    }
  });
}

loadImage(pedidos: CrearPedido): string {
  const cachedImage = this.imageCacheSvc.getImage(pedidos.image);
  if (cachedImage) {
    return cachedImage;
  } else {
    this.imageCacheSvc.setImage(pedidos.image, pedidos.image);
    return pedidos.image;
  }
}

///=====CONFIRMAR ELIMINACIÓN=====///
async DeletePedido(pedido: CrearPedido) {
  this.utilsSvc.presentAlert({
    header: 'Eliminar Pedido',
    message: '¿Estás Seguro De Que Deseas Eliminar Este Pedido?',
    mode: 'ios',
    buttons: [
      {
        text: 'Cancelar',
      },
      {
        text: 'Eliminar',
        handler: () => {
          this.delete(pedido); // Llama a la función delete para eliminar el producto
        }
      }
    ]
  });
}

///=====ELIMINAR EL PEDIDO=====///
async delete(pedido: CrearPedido) {
  let path = `users/${this.user().uid}/pedidos/${pedido.id}`; // Ruta del documento en Firestore

  const loading = await this.utilsSvc.loading();
  await loading.present();

  try {
    // Luego, elimina el documento del producto de Firestore
    await this.firebaseSvc.deleteDocument(path);

    // Actualiza la lista local de productos
    this.pedidos = this.pedidos.filter(p => p.id_producto !== pedido.id);

    // Muestra un mensaje de éxito
    this.utilsSvc.presentToast({
      message: 'Pedido Eliminado Correctamente',
      duration: 4500,
      color: 'success',
      position: 'middle',
      icon: 'checkmark-circle-outline'
    });

  } catch (error) {
    console.log(error);

    // En caso de error, muestra un mensaje
    this.utilsSvc.presentToast({
      message: error.message,
      duration: 4500,
      color: 'danger',
      position: 'middle',
      icon: 'alert-circle-outline'
    });
  } finally {
    // Oculta el loading después de completar la operación
    loading.dismiss();
  }
}



      async obtenerUltimaTasa() {
        try {
          const path = 'tasa_dolar';

          this.firebaseSvc.getCollectionData(path, {
            limit: 1,
            orderBy: { field: 'fecha', direction: 'desc' }
          }).pipe(first ())
          .subscribe(tasas => {
            if (tasas.length > 0) {
              const ultimaTasa = tasas[0];
              this.ultimaTasaParalelo = ultimaTasa['valor_paralelo'];
              this.ultimaTasaCentral = ultimaTasa['valor_central'];
              this.ultimaTasaLocal = ultimaTasa['valor_local'];
              this.ultimaTasaDelivery = ultimaTasa['valor_delivery'];
              this.calculateTotalConDelivery();  // Recalcula el total después de obtener la tasa
              this.calculateTotalEnBs();  // Recalcula el total en Bs


            }
          });

        } catch (error) {
          console.error('Error obteniendo la última tasa:', error);
        }
      }

        ///=====OBTENER PEDIDOS EN TIEMPO REAL=====////
  listenToPedidos() {
    let path = `users/${this.user().uid}/pedidos`;

    this.loading = true;
    this.firebaseSvc.getCollectionSnapshot(path).subscribe({
      next: (snapshot: any) => {
        this.pedidos = snapshot.map((doc: any) => ({ id: doc.payload.doc.id, ...doc.payload.doc.data() }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener pedidos:', error);
        this.loading = false;
      }
    });
  }

  async openPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverNotificationsClientComponent,
      event: event,
      translucent: true,
    });
    await popover.present(); // Llama a present() para mostrar el popover
  }

}
