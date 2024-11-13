import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Productos_No_Elaborados } from 'src/app/models/productos_no_elaborados.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-pedido-product',
  templateUrl: './create-pedido-product.component.html',
  styleUrls: ['./create-pedido-product.component.scss'],
})
export class CreatePedidoProductComponent implements OnInit {

  @Input() pedido: Productos_No_Elaborados;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user = {} as User;
  quantity: number = 1;
  deliveryMethod: string = '';
  location: string = '';
  reservationType: string = 'Lo_mas_pronto_posible';
  fullDateTime: string;
  reservationDate: string;
  reservationTime: string;
  minDate: string;
  maxQuantity: number;
  formValid: boolean = false; // Para controlar si el formulario está completo


  form = new FormGroup({
    id_producto: new FormControl(''),
    image: new FormControl(''),
    producto: new FormControl(''),
    categoria: new FormControl('Producto No Elaborado'),
    cantidad: new FormControl(null),
    sub_total: new FormControl(null),
    status: new FormControl('Por Pagar...'),
    tipo_entrega: new FormControl(''),
    location: new FormControl(''),
    fecha: new FormControl(''),
    hora: new FormControl(''),
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

    this.maxQuantity = this.pedido.cantidad_comprar || 0; // Asigna la cantidad disponible del producto
    this.validateForm(); // Verifica el estado del formulario al inicializar
  }


  setMinDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDate = today.toISOString();
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
  validateForm() {
    // Habilita el botón solo si se cumplen las condiciones
    this.formValid =
      this.deliveryMethod !== '' &&
      (this.deliveryMethod !== 'Delivery' ||
        (this.deliveryMethod === 'Delivery' && this.location && this.location.length >= 5)) && // Verifica que la ubicación tenga al menos 5 caracteres
      this.quantity <= this.maxQuantity &&
      this.fullDateTime !== undefined && // Asegúrate de que se haya seleccionado una fecha
      !this.isFridayEvening(); // Verifica que no sea viernes por la tarde
  }

  close() {
    this.utilsSvc.dismissModal();
  }

  increaseQuantity() {
    if (this.quantity < this.pedido.cantidad_comprar) { // Verifica que no supere el stock
      this.quantity++;
    } else {
      this.utilsSvc.presentToast({
        message: `No hay mas unidades disponibles.`,
        duration: 3000,
        color: 'warning',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  calculateSubtotal(): number {
    return this.pedido.precio_venta * this.quantity;
  }

  onReservationChange() {
    if (this.reservationType === 'Lo_mas_pronto_posible') {
      this.fullDateTime = undefined;
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

    if (this.quantity > this.pedido.cantidad_comprar) { // Verificación final antes de agregar al carrito
      this.utilsSvc.presentToast({
        message: `La cantidad solicitada excede la cantidad disponible (${this.pedido.cantidad_comprar} unidades).`,
        duration: 4500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
      return;
    }

    const path = `users/${this.user.uid}/pedidos`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    if (this.fullDateTime) {
      const dateObj = new Date(this.fullDateTime);
      this.reservationDate = dateObj.toISOString().split('T')[0];
      this.reservationTime = dateObj.toTimeString().split(' ')[0];
    }

    this.form.patchValue({
      id_producto: this.pedido.id,
      producto: this.pedido.nombre,
      categoria: "Producto No Elaborado",
      cantidad: this.quantity,
      sub_total: this.calculateSubtotal(),
      image: this.pedido.image,
      location: this.location,
      fecha: this.reservationDate,
      hora: this.reservationTime,
      status: 'Por Pagar...',
      tipo_entrega: this.deliveryMethod
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
