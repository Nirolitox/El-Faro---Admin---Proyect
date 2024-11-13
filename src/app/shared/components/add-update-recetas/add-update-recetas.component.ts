import { Component, inject, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Ingredientes_Utilizados, Recetas } from 'src/app/models/recetas.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-recetas',
  templateUrl: './add-update-recetas.component.html',
  styleUrls: ['./add-update-recetas.component.scss'],
})
export class AddUpdateRecetasComponent implements OnInit {



  navCrtl = inject(NavController); // Inyecta ModalController
  @Input() recetas: Recetas;


  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    precio: new FormControl(null, [Validators.required, Validators.min(0)]),
    tiempo_de_preparacion: new FormControl(''),
    nombre: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]),
    ingredientes_utilizados: new FormArray([]),
    descripcion: new FormControl(''),
    categoria: new FormControl('')
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  productos: any[] = []; // Guardar las recetas con categoría 'Menu'


  ngOnInit() {
    this.loadProductos();
    if (this.recetas) {
      this.loadProductosData();
    }
  }


  // Cargar recetas de la colección y filtrarlas
  loadProductos() {
    this.firebaseSvc.getCollectionData('inversion_productos').subscribe((producto) => {
      this.productos = producto.map(product => ({
        id: product.id,
        nombre: product['nombre']
      }));
    });
  }


  // Cargar datos de la promoción existente
  loadProductosData() {
    this.form.patchValue({
      id: this.recetas.id,
      image: this.recetas.image,
      nombre: this.recetas.nombre,
      categoria: this.recetas.categoria,
      tiempo_de_preparacion: this.recetas.tiempo_de_preparacion,
      precio: this.recetas.precio,
      descripcion: this.recetas.descripcion
    });

    // Cargar el array de productos utilizados
    this.recetas.ingredientes_utilizados.forEach(producto => this.addProductos(producto));
  }

  addProducto() {
    const ingredientesArray = this.form.get('ingredientes_utilizados') as FormArray;
    ingredientesArray.push(new FormGroup({
      id_ingrediente: new FormControl('', Validators.required),
      nombre: new FormControl(''),
      medida: new FormControl(null, [Validators.required, Validators.min(0)])
    }));
  }

  get ingredientes_utilizados() {
    return this.form.get('ingredientes_utilizados') as FormArray;
  }


    // Agregar productos seleccionados
    addProductos(producto: Ingredientes_Utilizados) {
      const ingredientesArray = this.form.get('ingredientes_utilizados') as FormArray;
      ingredientesArray.push(new FormGroup({
        id_ingrediente: new FormControl(producto.id_ingrediente, Validators.required),
        nombre: new FormControl(producto.nombre),
        medida: new FormControl(producto.medida, [Validators.required])
      }));
    }

      // Eliminar un producto del FormArray
  removeProducto(index: number) {
    (this.form.get('ingredientes_utilizados') as FormArray).removeAt(index);
  }

  close() {
    this.utilsSvc.dismissModal();
  }

  updateNombreIngrediente(index: number) {
    const ingredientesArray = this.form.get('ingredientes_utilizados') as FormArray;
    const idSeleccionado = ingredientesArray.at(index).get('id_ingrediente').value;
    const recetaSeleccionada = this.productos.find(product => product.id === idSeleccionado);

    if (recetaSeleccionada) {
      ingredientesArray.at(index).get('nombre').setValue(recetaSeleccionada.nombre);
    }
  }

  setNumberInputs() {
    this.form.controls.precio.setValue(+this.form.controls.precio.value);
  }

  // Tomar o seleccionar una imagen
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen Del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }


  submit() {
    // Verificar que el formulario sea válido y que el array ingredientes_utilizados tenga al menos un elemento
    if (this.form.valid && this.ingredientes_utilizados.length > 0) {
      const allIngredientsFilled = this.ingredientes_utilizados.controls.every((control) =>
        control.get('id_ingrediente').value && control.get('medida').value
      );

      if (allIngredientsFilled) {
        this.setNumberInputs(); // Convertir valores de tipo string a numéricos

        if (this.recetas) {
          // Actualiza la receta si ya existe
          this.UpdateReceta();
        } else {
          // Crea una nueva receta
          this.createReceta();
        }
      } else {
        this.utilsSvc.presentToast({
          message: 'Por favor, complete todos los campos de los ingredientes.',
          duration: 4500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }
    } else {
      this.utilsSvc.presentToast({
        message: 'Por favor, complete todos los campos del formulario.',
        duration: 4500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }
  }


  onInputNombre(event) {
    const inputValue = event.target.value;
    if (inputValue.length > 30) {
      event.target.value = inputValue.slice(0, 30);
    }
  }

  onInputCantidad(event) {
    const inputValue = event.target.value;
    if (inputValue.length > 5) {
      event.target.value = inputValue.slice(0, 5);
    }
  }

  onInputPrecio(event) {
    const inputValue = event.target.value;
    if (inputValue.length > 4) {
      event.target.value = inputValue.slice(0, 4);
    }
  }

  onInputTiempo(event) {
    const inputValue = event.target.value;
    if (inputValue.length > 10) {
      event.target.value = inputValue.slice(0, 10);
    }
  }

  async createReceta() {
    const path = 'recetas';
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
        message: 'Receta Creada Exitosamente',
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

  async UpdateReceta() {
    const path = `recetas/${this.recetas.id}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    if (this.form.value.image !== this.recetas.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.recetas.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

    delete this.form.value.id;

    this.firebaseSvc.updateDocument(path, this.form.value).then(async () => {
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Receta Actualizada Exitosamente',
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
