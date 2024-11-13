import { Component, inject, OnInit } from '@angular/core';
import { orderBy } from '@angular/fire/firestore';
import { Promociones } from 'src/app/models/promociones.model';
import { Recetas } from 'src/app/models/recetas.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ImageCacheService } from 'src/app/services/image-cache.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CreatePedidoComponent } from 'src/app/shared/components/create-pedido/create-pedido.component';
import { DetailPromocionesComponent } from 'src/app/shared/components/detail-promociones/detail-promociones.component';

@Component({
  selector: 'app-combos',
  templateUrl: './combos.page.html',
  styleUrls: ['./combos.page.scss'],
})
export class CombosPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  loading: boolean = false;
  promocions: Promociones[] = [];
  imageLoaded: boolean[] = [];
  imageCacheSvc = inject(ImageCacheService);



  constructor() { }

  ngOnInit() {
    this.getPromocion()
  }

  ionViewWillEnter() {
    this.getPromocion();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getPromocion();
      event.target.complete();
    }, 2000);
  }

  ///=====OBTENER PROMOCIONES=====////

  getPromocion() {
    let path = `promociones`;
    this.loading = true;
    const query = orderBy('nombre', 'asc');

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: Promociones[]) => {
        console.log(res);
        this.promocions = res;
        this.loading = false;
        sub.unsubscribe();
      }
    })
  }

  // Método para cargar imágenes
  loadImage(promocion: Promociones): string {
    const cachedImage = this.imageCacheSvc.getImage(promocion.image);
    if (cachedImage) {
      return cachedImage; // Retornar la imagen de la caché
    } else {
      // Si no está en caché, se puede almacenar en caché cuando se carga
      this.imageCacheSvc.setImage(promocion.image, promocion.image);
      return promocion.image; // Retornar la URL de la imagen
    }
  }

  ///=====OBTENER RECETAS=====////
  async detail(promocion?: Promociones) {

    let success = await this.utilsSvc.presentModal({
      component: DetailPromocionesComponent,
      cssClass: 'add-update-modal',
      componentProps: { promocion }
    })
  }

  async OpenPedido(pedido?: Promociones) {

    let success = await this.utilsSvc.presentModal({
      component: CreatePedidoComponent,
      cssClass: 'add-update-modal',
      componentProps: { pedido }
    })

    if (success) this.getPromocion()
  }

}
