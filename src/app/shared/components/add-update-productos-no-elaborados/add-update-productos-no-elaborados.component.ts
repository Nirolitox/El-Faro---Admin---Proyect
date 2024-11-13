import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { Productos_No_Elaborados } from 'src/app/models/productos_no_elaborados.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-productos-no-elaborados',
  templateUrl: './add-update-productos-no-elaborados.component.html',
  styleUrls: ['./add-update-productos-no-elaborados.component.scss'],
})
export class AddUpdateProductosNoElaboradosComponent  implements OnInit {

  constructor() { }
  @Input() products: Productos_No_Elaborados;
  valorTotalDolares: any;
  valorTotalBs: any; // Valor total en Bolívares
  tasaParalelo: number | null = null;
  tasaBCV: number | null = null;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]),
    precio_unidad: new FormControl(null, [Validators.required, Validators.min(0)]),
    cantidad_comprar: new FormControl(null, [Validators.required, Validators.min(1)]),
    tipo_tasa: new FormControl(''),
    valor_total_dolares: new FormControl(''),
    valor_total_bolivares: new FormControl(''),
    precio_venta: new FormControl(null, [Validators.required, Validators.min(0)]),
    descripcion: new FormControl('')
  });

  ngOnInit() {
    if (this.products) this.form.setValue(this.products);
    this.getTasas(); // Obtener tasas al iniciar
    // Listeners para recalcular el total cuando cambien los valores
    this.form.controls.precio_unidad.valueChanges.subscribe(() => this.calculateTotalDolares());
    this.form.controls.cantidad_comprar.valueChanges.subscribe(() => this.calculateTotalDolares());
    this.form.controls.tipo_tasa.valueChanges.subscribe(() => this.calculateTotalDolares());
  }

  close() {
    this.utilsSvc.dismissModal();
  }

    // Tomar o seleccionar una imagen
    async takeImage() {
      const dataUrl = (await this.utilsSvc.takePicture('Imagen Del Producto')).dataUrl;
      this.form.controls.image.setValue(dataUrl);
    }

    onInputNombre(event) {
      const inputValue = event.target.value;
      if (inputValue.length > 30) {
        event.target.value = inputValue.slice(0, 30);
      }
    }


  onInputCantidad(event) {
    const inputValue = event.target.value;
    if (inputValue.length > 4) {
      event.target.value = inputValue.slice(0, 4);
    }
  }

  onInputPrecio(event) {
    const inputValue = event.target.value;
    if (inputValue.length > 6) {
      event.target.value = inputValue.slice(0, 6);
    }
  }

  submit() {
    if (this.form.valid) {
      this.setNumberInputs(); // Convertir valores de tipo string a numéricos
      if (this.products) {
        this.updateProduct(); // Actualizar producto existente
      } else {
        this.createProduct(); // Crear nuevo producto
      }
    }
  }

   // Convierte valores de tipo string a numérico
   setNumberInputs() {
    let { precio_unidad, precio_venta, cantidad_comprar} = this.form.controls;
    if (precio_unidad.value) precio_unidad.setValue(parseFloat(precio_unidad.value));
    if (precio_venta.value) precio_venta.setValue(parseFloat(precio_venta.value));
    if (cantidad_comprar.value) cantidad_comprar.setValue(parseFloat(cantidad_comprar.value));
}

async getTasas() {
  const path = 'tasa_dolar';
  try {
    const tasas = await this.firebaseSvc.getCollectionData(path, {
      limit: 1,
      orderBy: { field: 'fecha', direction: 'desc' }
    }).pipe(first()).toPromise();

    if (tasas.length > 0) {
      this.tasaParalelo = tasas[0]['valor_paralelo'];
      this.tasaBCV = tasas[0]['valor_central'];
    }
  } catch (error) {
    console.error('Error al obtener tasas:', error);
  }
}


calculateTotalDolares() {
  const cantidad = this.form.get('cantidad_comprar').value || 0;
  const costo = this.form.get('precio_unidad').value || 0;

  // Calcula el total en dólares
  this.valorTotalDolares = parseFloat((cantidad * costo).toFixed(2));
  this.form.get('valor_total_dolares').setValue(this.valorTotalDolares);

  // Verifica el tipo de tasa seleccionada
  if (this.form.controls.tipo_tasa.value === 'Paralelo' && this.tasaParalelo) {
    this.valorTotalBs = parseFloat((this.valorTotalDolares * this.tasaParalelo).toFixed(2));
  } else if (this.form.controls.tipo_tasa.value === 'BCV' && this.tasaBCV) {
    this.valorTotalBs = parseFloat((this.valorTotalDolares * this.tasaBCV).toFixed(2));
  } else {
    this.valorTotalBs = 0;
  }

  // Asignar el valor calculado en bolívares al formulario
  this.form.get('valor_total_bolivares').setValue(this.valorTotalBs);
}

async createProduct() {
  const path = 'productos_no_elaborados'; // Agrega un documento con un ID generado automáticamente
  const loading = await this.utilsSvc.loading();
  await loading.present();

  // Subir imagen y obtener URL
  let dataUrl = this.form.value.image;
  let imagePath = `${Date.now()}`;
  let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
  this.form.controls.image.setValue(imageUrl);

  delete this.form.value.id;

  this.firebaseSvc.addDocument(path, this.form.value).then(async () => {
    this.utilsSvc.dismissModal({ success: true });

    this.utilsSvc.presentToast({
      message: 'Producto Registrado Exitosamente',
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

async updateProduct() {
  const path = `productos_no_elaborados/${this.products.id}`;
  const loading = await this.utilsSvc.loading();
  await loading.present();

  if (this.form.value.image !== this.products.image) {
    let dataUrl = this.form.value.image;
    let imagePath = await this.firebaseSvc.getFilePath(this.products.image);
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);
  }

  delete this.form.value.id;

  this.firebaseSvc.updateDocument(path, this.form.value).then(async () => {
    this.utilsSvc.dismissModal({ success: true });

    this.utilsSvc.presentToast({
      message: 'Producto Actualizado Exitosamente',
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
