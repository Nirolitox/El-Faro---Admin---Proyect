import { Component, inject, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { orderBy } from 'firebase/firestore/lite';
import { Productos_No_Elaborados } from 'src/app/models/productos_no_elaborados.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ImageCacheService } from 'src/app/services/image-cache.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CreatePedidoProductComponent } from 'src/app/shared/components/create-pedido-product/create-pedido-product.component';
import { CreatePedidoComponent } from 'src/app/shared/components/create-pedido/create-pedido.component';
import { PopoverNotificationsClientComponent } from 'src/app/shared/components/popover-notifications-client/popover-notifications-client.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  imageCacheSvc = inject(ImageCacheService); // Inyecta el servicio de caché de imágenes
  notificationCount: number = 0;
  loading: boolean = false;
  searchTerm: string = '';
  products: Productos_No_Elaborados []=[];
  imageLoaded: boolean[] = [];




  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {
    this.getNotificationCount();
  }


  user() :User {
    return this.utilsSvc.getFromLocalStorage('user')
  }

    // Método para obtener el total de notificaciones
    getNotificationCount() {
      const path = 'notificaciones';
      this.firebaseSvc.collectionQuery(path, 'userId', '==', this.user().uid).subscribe((notifications: any[]) => {
        this.notificationCount = notifications.length;
      });
    }

  /////////////////////////
  async signOut() {
    const alertOptions = {
      header: 'Cerrar sesión',
      message: '¿Estás Seguro Que Deseas Salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cierre de sesión cancelado');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.firebaseSvc.signOut();
          }
        }
      ]
    };

    await this.utilsSvc.presentAlert(alertOptions);
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  doRefresh(event) {

    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 2000);
  }

      ///=====OBTENER PRODUCTOS NO ELABORADOS=====////

      getProducts() {
        let path = `productos_no_elaborados`;

        this.loading = true;

        const query = orderBy('nombre', 'asc');

       let sub= this.firebaseSvc.getCollectionData(path, query).subscribe({
          next: (res: Productos_No_Elaborados[]) => {
            console.log(res);
            this.products = res;
            this.loading = false;
            sub.unsubscribe();
          }
        })
      }

  loadImage(producto: Productos_No_Elaborados): string {
    const cachedImage = this.imageCacheSvc.getImage(producto.image);
    if (cachedImage) {
      return cachedImage;
    } else {
      this.imageCacheSvc.setImage(producto.image, producto.image);
      return producto.image;
    }
  }

      async OpenPedido(pedido?: Productos_No_Elaborados) {

        let success = await this.utilsSvc.presentModal({
          component: CreatePedidoProductComponent,
          cssClass: 'add-update-modal',
          componentProps: { pedido }
        })

        if (success) this.getProducts()
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
