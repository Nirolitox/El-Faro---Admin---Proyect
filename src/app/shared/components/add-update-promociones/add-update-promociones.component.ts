import { Component, inject, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Promociones, Recetas_Utilizadas } from 'src/app/models/promociones.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-promociones',
  templateUrl: './add-update-promociones.component.html',
  styleUrls: ['./add-update-promociones.component.scss'],
})
export class AddUpdatePromocionesComponent implements OnInit {

  navCrtl = inject(NavController);
  @Input() promocions: Promociones;

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    precio: new FormControl(null, [Validators.required, Validators.min(0)]),
    tiempo_de_preparacion: new FormControl(''),
    nombre: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]),
    recetas_utilizadas: new FormArray([]),
    descripcion: new FormControl(''),
    categoria: new FormControl('Promocion')
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  recetasMenu: any[] = []; // Productos de la colección recetas

  ngOnInit() {
    this.loadRecetas();
    if (this.promocions) {
      this.loadRecetaData();
    }
  }

  // Cargar recetas de la colección y filtrarlas
  loadRecetas() {
    this.firebaseSvc.getCollectionData('recetas').subscribe((recetas) => {
      this.recetasMenu = recetas.map(receta => ({
        id: receta.id,
        nombre: receta['nombre']
      }));
    });
  }

  // Cargar datos de la promoción existente
  loadRecetaData() {
    this.form.patchValue({
      id: this.promocions.id,
      image: this.promocions.image,
      nombre: this.promocions.nombre,
      categoria: this.promocions.categoria,
      tiempo_de_preparacion: this.promocions.tiempo_de_preparacion,
      precio: this.promocions.precio,
      descripcion: this.promocions.descripcion
    });

    // Cargar el array de productos utilizados
    this.promocions.recetas_utilizadas.forEach(producto => this.addProductos(producto));
  }

  addProducto() {
    const ingredientesArray = this.form.get('recetas_utilizadas') as FormArray;
    ingredientesArray.push(new FormGroup({
      id_receta: new FormControl('', Validators.required),
      nombre: new FormControl(''),
      cantidad: new FormControl(1, [Validators.required, Validators.min(1)])
    }));
  }

  // Agregar productos seleccionados
  addProductos(producto: Recetas_Utilizadas) {
    const ingredientesArray = this.form.get('recetas_utilizadas') as FormArray;
    ingredientesArray.push(new FormGroup({
      id_receta: new FormControl(producto.id_receta, Validators.required),
      nombre: new FormControl(producto.nombre),
      cantidad: new FormControl(producto.cantidad, [Validators.required, Validators.min(1)])
    }));
  }

  removeProducto(index: number) {
    (this.form.get('recetas_utilizadas') as FormArray).removeAt(index);
  }

  close() {
    this.utilsSvc.dismissModal();
  }

  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen Del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      this.setNumberInputs();
      if (this.promocions) {
        this.UpdatePromocion();
      } else {
        this.createPromocion();
      }
    }
  }

  updateNombreProducto(index: number) {
    const ingredientesArray = this.form.get('recetas_utilizadas') as FormArray;
    const idSeleccionado = ingredientesArray.at(index).get('id_receta').value;
    const recetaSeleccionada = this.recetasMenu.find(receta => receta.id === idSeleccionado);

    if (recetaSeleccionada) {
      ingredientesArray.at(index).get('nombre').setValue(recetaSeleccionada.nombre);
    }
  }


  setNumberInputs() {
    this.form.controls.precio.setValue(+this.form.controls.precio.value);
  }

  async createPromocion() {
    const path = 'promociones';
    const loading = await this.utilsSvc.loading();
    await loading.present();

    let dataUrl = this.form.value.image;
    let imagePath = `${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.id;

    this.firebaseSvc.addDocument(path, this.form.value).then(async () => {
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Promoción Creada Exitosamente',
        duration: 4500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 4500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

  async UpdatePromocion() {
    const path = `promociones/${this.promocions.id}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    if (this.form.value.image !== this.promocions.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.promocions.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

    delete this.form.value.id;

    this.firebaseSvc.updateDocument(path, this.form.value).then(async () => {
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Promoción Actualizada Exitosamente',
        duration: 4500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 4500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }
}
