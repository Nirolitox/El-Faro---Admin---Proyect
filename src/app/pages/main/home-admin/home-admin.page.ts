import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, NavController, PopoverController } from '@ionic/angular';
import { orderBy } from 'firebase/firestore/lite';
import { Inversion_Productos } from 'src/app/models/inversion_productos.model';
import { Productos_No_Elaborados } from 'src/app/models/productos_no_elaborados.model';
import { Promociones } from 'src/app/models/promociones.model';
import { Recetas } from 'src/app/models/recetas.model';
import { Tasa_Dia } from 'src/app/models/tasa_dia.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateInversionComponent } from 'src/app/shared/components/add-update-inversion/add-update-inversion.component';
import { AddUpdateProductosNoElaboradosComponent } from 'src/app/shared/components/add-update-productos-no-elaborados/add-update-productos-no-elaborados.component';
import { AddUpdatePromocionesComponent } from 'src/app/shared/components/add-update-promociones/add-update-promociones.component';
import { AddUpdateRecetasComponent } from 'src/app/shared/components/add-update-recetas/add-update-recetas.component';
import { AddUpdateTasaDolarComponent } from 'src/app/shared/components/add-update-tasa-dolar/add-update-tasa-dolar.component';
import { PopoverTasaComponent } from 'src/app/shared/components/popover-tasa/popover-tasa.component';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {
  ultimaTasaParalelo: number | null = 100; // Ejemplo, reemplaza con tu lógica
  ultimaTasaCentral: number | null = 90; // Ejemplo, reemplaza con tu lógica
  navCrtl = inject(NavController); // Inyecta ModalController
  imageLoaded: boolean[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  recetas: Recetas []=[];
  promocions: Promociones []=[];
  productos: Productos_No_Elaborados []=[];
  categorias: string[] = []; // Array para almacenar categorías
  selectedCategory: string = ''; // Inicialmente vacío, se seleccionará después
  cantidadNotificaciones: number = 0; // Variable para almacenar la cantidad de notificaciones


  constructor(loadingController: LoadingController,private router: Router, private popoverCtrl: PopoverController, private menuController: MenuController) {}


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  alertController = inject(AlertController);

  ionViewWillEnter() {
    this.getRecetas();
    this.getProductos();
    this.getCantidadNotificaciones(); // Llamada para obtener la cantidad de notificaciones

  }

  doRefresh(event) {
    setTimeout(() => {
      this.getRecetas();
      this.getProductos();
      this.getCantidadNotificaciones();

      event.target.complete();
    }, 2000);
  }

  ngOnInit() {
  }

   // Nueva función para obtener la cantidad de notificaciones
   getCantidadNotificaciones() {
    let path = 'pedidos_pagos';
    this.firebaseSvc.getCollectionData(path, {
      where: ['status', '===', 'En Espera...']
    }).subscribe((pedidos: any[]) => {
      this.cantidadNotificaciones = pedidos.length;
    });
  }

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

  openFirstMenu() {
    this.menuController.open('first-menu');
  }

  getProducts(){

  }

  getProductos(){
    let path = `productos_no_elaborados`;

        this.loading = true;

        const query = orderBy('nombre', 'asc');

       let sub= this.firebaseSvc.getCollectionData(path, query).subscribe({
          next: (res: Productos_No_Elaborados[]) => {
            console.log(res);
            this.productos = res;
            this.loading = false;
            sub.unsubscribe();
          }
        })
  }

        ///=====OBTENER RECETAS=====////

getRecetas() {
  const path = `recetas`;
  this.loading = true;

  // Obtener recetas de la categoría 'Menu' para "Mis productos"
  const queryMenu = this.firebaseSvc.getCollectionData(path, {
    where: ['categoria', '==', 'Menu'],
    orderBy: 'nombre',
    order: 'asc'
  });

  // Obtener recetas de la categoría 'Combos' para la "Sección Especial"
  const queryCombos = this.firebaseSvc.getCollectionData(path, {
    where: ['categoria', '==', 'Combos'],
    orderBy: 'nombre',
    order: 'asc'
  });

  // Suscripción a ambas consultas
  let subMenu = queryMenu.subscribe({
    next: (res: Recetas[]) => {
      this.recetas = res; // Solo recetas de la categoría 'Menu'
      this.loading = false;
      subMenu.unsubscribe();
    }
  });

  let subCombos = queryCombos.subscribe({
    next: (res: Recetas[]) => {
      // this.recetasEspeciales = res; // Solo recetas de la categoría 'Combos'
      this.loading = false;
      subCombos.unsubscribe();
    }
  });
}

  async AddUpdateInversion(inversion_products?: Inversion_Productos) {

    let success = await this.utilsSvc.presentModal({
      component: AddUpdateInversionComponent,
      cssClass: 'add-update-modal',
      componentProps: { inversion_products }
    })

    if (success) this.getProducts()
  }


  async AddUpdateProductosNoElaborados(productos_no_elaborados?: Productos_No_Elaborados) {

    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductosNoElaboradosComponent,
      cssClass: 'add-update-modal',
      componentProps: { productos_no_elaborados }
    })

    if (success) this.getProducts()
  }

  async AddUpdateRecetas(recetas?: Recetas) {

    let success = await this.utilsSvc.presentModal({
      component: AddUpdateRecetasComponent,
      cssClass: 'add-update-modal',
      componentProps: { recetas }
    })

    if (success) this.getProducts()
  }

  async AddUpdatePromocion(promocion?: Promociones) {

    let success = await this.utilsSvc.presentModal({
      component: AddUpdatePromocionesComponent,
      cssClass: 'add-update-modal',
      componentProps: { promocion }
    })

    if (success) this.getProducts()
  }

  async AddUpdateTasa(tasa_dia?: Tasa_Dia) {

    let success = await this.utilsSvc.presentModal({
      component: AddUpdateTasaDolarComponent,
      cssClass: 'add-update-modal',
      componentProps: { tasa_dia }
    })

    if (success) this.getProducts()
  }

  async openPopover(event: Event) {
    const popover = await this.popoverCtrl.create({
      component: PopoverTasaComponent,
      event: event,
      translucent: true,
    });
    popover.componentProps = {
      ultimaTasaParalelo: this.ultimaTasaParalelo,
      ultimaTasaCentral: this.ultimaTasaCentral,
    };
    return await popover.present();
  }

}
