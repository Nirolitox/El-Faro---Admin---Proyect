import { Component, inject, OnInit } from '@angular/core';
import { orderBy } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { Promociones } from 'src/app/models/promociones.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdatePromocionesComponent } from 'src/app/shared/components/add-update-promociones/add-update-promociones.component';
import { DetailPromocionesComponent } from 'src/app/shared/components/detail-promociones/detail-promociones.component';

@Component({
  selector: 'app-visualizer-promociones',
  templateUrl: './visualizer-promociones.page.html',
  styleUrls: ['./visualizer-promociones.page.scss'],
})
export class VisualizerPromocionesPage implements OnInit {

  navCrtl = inject(NavController); // Inyecta ModalController
  promocions: Promociones []=[];
  imageLoaded: boolean[] = [];
  loading: boolean = false;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor() { }

  ngOnInit() {
    this.getPromocion()
  }

  close() {
    this.navCrtl.back();
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

      ///=====OBTENER RECETAS=====////

      getPromocion() {
        let path = `promociones`;
        this.loading = true;
        const query = orderBy('nombre', 'asc');

       let sub= this.firebaseSvc.getCollectionData(path, query).subscribe({
          next: (res: Promociones[]) => {
            console.log(res);
            this.promocions = res;
            this.loading = false;
            sub.unsubscribe();
          }
        })
      }

    ///=====CONFIRMAR ELIMINACIÓN=====///
    async DeletePromocion(promocion: Promociones) {
      this.utilsSvc.presentAlert({
        header: 'Eliminar Promocion',
        message: '¿Estás Seguro De Que Deseas Eliminar Esta Promoción?',
        mode: 'ios',
        buttons: [
          {
            text: 'Cancelar',
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.delete(promocion); // Llama a la función delete para eliminar el producto
            }
          }
        ]
      });
    }

    ///=====ELIMINAR LA RECETA=====///
    async delete(promocion: Promociones) {
      let path = `promociones/${promocion.id}`; // Ruta del documento en Firestore

      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        // Primero, elimina la imagen del producto si tiene una asociada
        if (promocion.image) {
          let imagePath = await this.firebaseSvc.getFilePath(promocion.image);
          if (imagePath) {
            await this.firebaseSvc.deleteFile(imagePath); // Eliminar la imagen de Firebase Storage
          }
        }

        // Luego, elimina el documento del producto de Firestore
        await this.firebaseSvc.deleteDocument(path);

        // Actualiza la lista local de productos
        this.promocions = this.promocions.filter(p => p.id !== promocion.id);

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

  async UpdatePromocion(promocion?: Promociones) {

    let success = await this.utilsSvc.presentModal({
      component: AddUpdatePromocionesComponent,
      cssClass: 'add-update-modal',
      componentProps: { promocions: promocion}
    })

    if (success) {this.getPromocion()}
  }

  async detail(promocion?: Promociones) {

    let success = await this.utilsSvc.presentModal({
      component: DetailPromocionesComponent,
      cssClass: 'add-update-modal',
      componentProps: { promocion }
    })
  }

}
