import { Component, inject, OnInit } from '@angular/core';
import { orderBy } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { Recetas } from 'src/app/models/recetas.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateRecetasComponent } from 'src/app/shared/components/add-update-recetas/add-update-recetas.component';
import { DetailRecetasComponent } from 'src/app/shared/components/detail-recetas/detail-recetas.component';

@Component({
  selector: 'app-visualizer-recetas',
  templateUrl: './visualizer-recetas.page.html',
  styleUrls: ['./visualizer-recetas.page.scss'],
})
export class VisualizerRecetasPage implements OnInit {

  navCrtl = inject(NavController); // Inyecta ModalController
  recetas: Recetas []=[];
  imageLoaded: boolean[] = [];
  loading: boolean = false;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.navCrtl.back();
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

      getRecetas() {
        let path = `recetas`;
        this.loading = true;
        const query = orderBy('nombre', 'asc');

       let sub= this.firebaseSvc.getCollectionData(path, query).subscribe({
          next: (res: Recetas[]) => {
            console.log(res);
            this.recetas = res;
            this.loading = false;
            sub.unsubscribe();
          }
        })
      }

    ///=====CONFIRMAR ELIMINACIÓN=====///
    async DeleteReceta(receta: Recetas) {
      this.utilsSvc.presentAlert({
        header: 'Eliminar Producto',
        message: '¿Estás Seguro De Que Deseas Eliminar Esta Receta?',
        mode: 'ios',
        buttons: [
          {
            text: 'Cancelar',
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.delete(receta); // Llama a la función delete para eliminar el producto
            }
          }
        ]
      });
    }

    ///=====ELIMINAR LA RECETA=====///
    async delete(receta: Recetas) {
      let path = `recetas/${receta.id}`; // Ruta del documento en Firestore

      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        // Primero, elimina la imagen del producto si tiene una asociada
        if (receta.image) {
          let imagePath = await this.firebaseSvc.getFilePath(receta.image);
          if (imagePath) {
            await this.firebaseSvc.deleteFile(imagePath); // Eliminar la imagen de Firebase Storage
          }
        }

        // Luego, elimina el documento del producto de Firestore
        await this.firebaseSvc.deleteDocument(path);

        // Actualiza la lista local de productos
        this.recetas = this.recetas.filter(p => p.id !== receta.id);

        // Muestra un mensaje de éxito
        this.utilsSvc.presentToast({
          message: 'Receta Eliminada Correctamente',
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

      //ACTUALIZAR PRODUCTO

  async UpdateReceta(receta?: Recetas) {

    let success = await this.utilsSvc.presentModal({
      component: AddUpdateRecetasComponent,
      cssClass: 'add-update-modal',
      componentProps: { recetas: receta }
    })

    if (success) {this.getRecetas()}
  }

  async detail(receta?: Recetas) {

    let success = await this.utilsSvc.presentModal({
      component: DetailRecetasComponent,
      cssClass: 'add-update-modal',
      componentProps: { receta }
    })
  }

}
