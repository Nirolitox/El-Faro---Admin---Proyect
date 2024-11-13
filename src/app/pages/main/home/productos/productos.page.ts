import { Component, inject, OnInit } from '@angular/core';
import { orderBy } from '@angular/fire/firestore';
import { where } from 'firebase/firestore/lite';
import { CrearPedido } from 'src/app/models/create_pedidos.model';
import { Recetas } from 'src/app/models/recetas.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ImageCacheService } from 'src/app/services/image-cache.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CreatePedidoComponent } from 'src/app/shared/components/create-pedido/create-pedido.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  loading: boolean = false;
  searchTerm: string = '';
  recetas: Recetas []=[];
  imageLoaded: boolean[] = [];
  imageCacheSvc = inject(ImageCacheService);

  constructor() { }

  ngOnInit() {
    this.getRecetas()
  }

  ionViewWillEnter() {
    this.getRecetas();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getRecetas();
      event.target.complete();
    }, 2000);
  }

          ///=====OBTENER RECETAS=====////

///=====OBTENER RECETAS=====////
getRecetas() {
  const path = `recetas`; // Asegúrate de que la ruta sea correcta
  this.loading = true;

  const sub = this.firebaseSvc.getCollectionData(path).subscribe({
    next: (res: Recetas[]) => {
      console.log(res);
      // Filtrar las recetas que tengan 'Combo' en la categoría
      this.recetas = res.filter(receta => receta.categoria === 'Menu');
      this.loading = false;
    },
    error: (err) => {
      console.error('Error fetching recetas:', err);
      this.loading = false; // También desactiva el loading en caso de error
    },
    complete: () => {
      sub.unsubscribe(); // Desuscribirse al completar
    }
  });
}

// Método para cargar imágenes
loadImage(recetas: Recetas): string {
  const cachedImage = this.imageCacheSvc.getImage(recetas.image);
  if (cachedImage) {
    return cachedImage; // Retornar la imagen de la caché
  } else {
    // Si no está en caché, se puede almacenar en caché cuando se carga
    this.imageCacheSvc.setImage(recetas.image, recetas.image);
    return recetas.image; // Retornar la URL de la imagen
  }
}

async OpenPedido(pedido?: Recetas) {

  let success = await this.utilsSvc.presentModal({
    component: CreatePedidoComponent,
    cssClass: 'add-update-modal',
    componentProps: { pedido }
  })

  if (success) this.getRecetas()
}

}
