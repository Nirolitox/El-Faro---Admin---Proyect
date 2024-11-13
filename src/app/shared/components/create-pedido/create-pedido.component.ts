import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Productos_No_Elaborados } from 'src/app/models/productos_no_elaborados.model';
import { Recetas } from 'src/app/models/recetas.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-pedido',
  templateUrl: './create-pedido.component.html',
  styleUrls: ['./create-pedido.component.scss'],
})
export class CreatePedidoComponent implements OnInit {
  @Input() pedido: Recetas;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user = {} as User;
  quantity: number = 1; // Inicializar la cantidad a 1
  deliveryMethod: string = ''; // Para guardar el método de entrega seleccionado
  location: string = ''; // Para guardar la ubicación del delivery
  reservationType: string = 'Lo_mas_pronto_posible'; // Para guardar el tipo de reserva
  fullDateTime: string; // Para almacenar la fecha y hora seleccionadas
  reservationDate: string; // Para almacenar solo la fecha
  reservationTime: string; // Para almacenar solo la hora

  // Variables para los valores de tasa de dólar
  valorDelivery: number;
  valorLocal = 1; // Asignar un valor predeterminado para evitar división por cero

  // Para las validaciones de fecha
  minDate: string;
  formValid: boolean = false; // Para controlar si el formulario está completo

  form = new FormGroup({
    id_producto: new FormControl(''),
    image: new FormControl(''), // Agregado para la imagen
    producto: new FormControl(''),
    categoria: new FormControl(''),
    descripcion: new FormControl(''),
    cantidad: new FormControl(null),
    sub_total: new FormControl(null),
    status: new FormControl('Por Pagar...'),
    tipo_entrega: new FormControl(''),
    location: new FormControl(''), // Agregado para la ubicación
    fecha: new FormControl(''), // Para la fecha separada
    hora: new FormControl(''), // Para la hora separada
  });

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    this.setMinDate();

    // Obtener la fecha y hora actual y formatearla adecuadamente
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.fullDateTime = `${year}-${month}-${day}T${hours}:${minutes}`; // Formato ISO con hora actual
    this.validateForm(); // Verifica el estado del formulario al inicializar
  }

  setMinDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establecer a media noche
    this.minDate = today.toISOString(); // La fecha mínima es hoy
  }

  setDefaultDateTime() {
    const currentDateTime = new Date();
    this.fullDateTime = currentDateTime.toISOString(); // Establecer la fecha y hora actual como valor predeterminado
  }

  getDollarRates() {
    this.firebaseSvc.getCollectionData('tasa_dolar').subscribe((dollarRates: any[]) => {
      if (dollarRates && dollarRates.length > 0) {
        const lastRate = dollarRates[dollarRates.length - 1];
        this.valorDelivery = lastRate.valor_delivery;
        this.valorLocal = lastRate.valor_local;
      }
    });
  }

  validateForm() {
    // Habilita el botón solo si se cumplen las condiciones
    this.formValid =
      this.deliveryMethod !== '' &&
      (this.deliveryMethod !== 'Delivery' ||
        (this.deliveryMethod === 'Delivery' && this.location && this.location.length >= 5)) && // Verifica que la ubicación tenga al menos 5 caracteres
      this.quantity && this.fullDateTime !== undefined && // Asegúrate de que se haya seleccionado una fecha
      !this.isFridayEvening(); // Verifica que no sea viernes por la tarde
  }

  isFridayEvening(): boolean {
    if (!this.fullDateTime) return false;
    const selectedDate = new Date(this.fullDateTime);
    const dayOfWeek = selectedDate.getDay();
    const hour = selectedDate.getHours();
    return dayOfWeek === 5 && hour >= 18;
  }

  onDeliveryMethodChange() {
    this.validateForm(); // Verifica el formulario cuando se cambia el método de entrega
  }

  close() {
    this.utilsSvc.dismissModal();
  }

  increaseQuantity() {
    this.quantity++;
  }

  // Método para decrementar la cantidad
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  calculateSubtotal(): number {
    // Calcular el subtotal solo en base al precio y la cantidad, sin agregar el costo de delivery
    let subtotal = this.pedido.precio * this.quantity;
    return parseFloat(subtotal.toFixed(2));
  }

  onReservationChange() {
    // Aquí puedes manejar cualquier lógica adicional si es necesario al cambiar el tipo de reserva
    if (this.reservationType === 'Lo_mas_pronto_posible') {
      this.fullDateTime = undefined; // Limpiar la fecha y hora si selecciona "Lo más antes posible"
    }
  }

  async AddCart() {
    if (this.form.invalid) {
      this.utilsSvc.presentToast({
        message: 'Por favor, completa todos los campos obligatorios',
        duration: 4500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
      return;
    }
    const path = `users/${this.user.uid}/pedidos`; // Agrega un documento con un ID generado automáticamente
    const loading = await this.utilsSvc.loading();
    await loading.present();

    // Separar fecha y hora de fullDateTime
    if (this.fullDateTime) {
      const dateObj = new Date(this.fullDateTime);
      this.reservationDate = dateObj.toISOString().split('T')[0]; // Guardar solo la fecha
      this.reservationTime = dateObj.toTimeString().split(' ')[0]; // Guardar solo la hora
    }

    // Actualiza el formulario con los datos relevantes
    this.form.patchValue({
      id_producto: this.pedido.id,
      producto: this.pedido.nombre, // Nombre del producto
      cantidad: this.quantity, // Convertir a string
      categoria: this.pedido.categoria, // Convertir a string
      descripcion: this.pedido.descripcion, // Convertir a string
      sub_total: this.calculateSubtotal(), // Convertir a string
      image: this.pedido.image, // Agrega la imagen del producto
      location: this.location, // Agregar la ubicación si es delivery
      fecha: this.reservationDate, // Agregar la fecha separada
      hora: this.reservationTime, // Agregar la hora separada
      status: 'Por Pagar...',
      tipo_entrega: this.deliveryMethod // Agrega el tipo de entrega (delivery o retiro)
    });

    this.firebaseSvc.addDocument(path, this.form.value).then(async () => {
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Producto Asignado A Mis Pedidos',
        duration: 4500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    }).catch(error => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 4500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }).finally(() => loading.dismiss());
  }
}
