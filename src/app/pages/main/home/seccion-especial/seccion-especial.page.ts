import { Component, inject, OnInit } from '@angular/core';
import { Recetas } from 'src/app/models/recetas.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CreatePedidoComponent } from 'src/app/shared/components/create-pedido/create-pedido.component';

@Component({
  selector: 'app-seccion-especial',
  templateUrl: './seccion-especial.page.html',
  styleUrls: ['./seccion-especial.page.scss'],
})
export class SeccionEspecialPage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  loading: boolean = false;
  searchTerm: string = '';
  recetas: Recetas []=[];
  imageLoaded: boolean[] = [];

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
      this.recetas = res.filter(receta => receta.categoria === 'Bebidas');
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

async OpenPedido(pedido?: Recetas) {

  let success = await this.utilsSvc.presentModal({
    component: CreatePedidoComponent,
    cssClass: 'add-update-modal',
    componentProps: { pedido }
  })

  if (success) this.getRecetas()
}

}
