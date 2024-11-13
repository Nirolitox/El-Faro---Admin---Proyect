import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CrearPedido } from 'src/app/models/create_pedidos.model';
import { User } from 'src/app/models/user.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-pagar-pedidos',
  templateUrl: './pagar-pedidos.page.html',
  styleUrls: ['./pagar-pedidos.page.scss'],
})
export class PagarPedidosPage implements OnInit {



  navCrtl = inject(NavController); // Inyecta ModalController
  lista_productos: CrearPedido[] = [];  // Almacena la lista de productos
  metodoPago: string = '';  // Almacena el método de pago seleccionado
  imagePago: string = ''; // Almacena la imagen del comprobante de pago
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  pedidos: CrearPedido[] = [];
  valor_local: number = 0;  // Tasa de cambio local (Bs por dólar)
  mostrarSubirImagen: boolean = false;  // Controla si se muestra la opción de subir imagen

  // Para obtener datos del usuario
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ngOnInit() {
    this.obtenerProductos();
    this.obtenerTasaLocal();

  }

  // Obtener la tasa de cambio local
  obtenerTasaLocal() {
    const path = 'tasa_dolar';  // Asegúrate de que el path sea correcto en tu Firebase
    this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          this.valor_local = res[0].valor_local;  // Asigna la tasa más reciente
        } else {
          console.error('No se pudo obtener la tasa de cambio local.');
        }
      },
      error: (err) => {
        console.log('Error obteniendo la tasa de cambio:', err);
      }
    });
  }


  close() {
    this.utilsSvc.dismissModal();
  }

  // Manejar el cambio de método de pago
  onMetodoPagoChange() {
    // Solo mostrar la opción de subir imagen si el método de pago es PagoMóvil o Transferencia
    this.mostrarSubirImagen = this.metodoPago === 'PagoMóvil' || this.metodoPago === 'Transferencia';
  }

// Obtener los productos desde la colección de pedidos
obtenerProductos() {
  const path = `users/${this.user().uid}/pedidos`;

  this.firebaseSvc.getCollectionData(path).subscribe({
    next: (res: any) => {
      // Filtra los productos que solo tienen el estado "Por Pagar..."
      this.lista_productos = res.filter((pedido: CrearPedido) => pedido.status === 'Por Pagar...');
    },
    error: (err) => {
      console.log('Error obteniendo productos:', err);
    }
  });
}


  // Método para seleccionar y subir la imagen del comprobante
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Comprobante De Pago')).dataUrl;
    this.imagePago = dataUrl; // Almacena la imagen seleccionada
  }

  // Calcular el total en dólares
  calculateTotal(): number {
    return this.lista_productos.reduce((total, producto) => total + producto.sub_total, 0);
  }

  // Calcular el total en bolívares
  calculateTotalBs(): number {
    if (this.valor_local > 0) {
      return this.calculateTotal() * this.valor_local;
    }
    return 0;
  }

  async enviarPago() {
    if (!this.metodoPago) {
      this.utilsSvc.presentToast({
        message: 'Selecciona un método de pago.',
        color: 'danger',
        duration: 3000
      });
      return;
    }

    // Verificar comprobante solo si es PagoMóvil o Transferencia
    if ((this.metodoPago === 'PagoMóvil' || this.metodoPago === 'Transferencia') && !this.imagePago) {
      this.utilsSvc.presentToast({
        message: 'Sube un comprobante de pago.',
        color: 'danger',
        duration: 3000
      });
      return;
    }

    const imageUsuario = this.user().image || '';  // Asegúrate de que no sea undefined
    const imagePago = this.metodoPago === 'PagoMóvil' || this.metodoPago === 'Transferencia' ? this.imagePago : '';  // Asegúrate de enviar un string vacío si no hay imagen

    const path = 'pedidos_pagos';
    const pago = {
      image: imageUsuario,  // Imagen del usuario, usa una cadena vacía si no está disponible
      image_pago: imagePago,  // Aquí va la imagen del comprobante de pago si corresponde
      cedula: this.user().cedula,
      name: this.user().name,
      lista_productos: this.lista_productos.map(p => ({
        cantidad: p.cantidad,
        sub_total: p.sub_total,
        tipo_entrega: p.tipo_entrega,
        location: p.tipo_entrega === 'Delivery' ? p.location : null
      })),
      metodo_pago: this.metodoPago,
      status: 'En Espera...'
    };

    // Guardar el pago en Firebase
    try {
      await this.firebaseSvc.addDocument(path, pago);

      // Actualizar el estado de los pedidos a "En Espera..."
      for (const pedido of this.lista_productos) {
        const pedidoPath = `users/${this.user().uid}/pedidos/${pedido.id}`;
        await this.firebaseSvc.updateDocument(pedidoPath, { status: 'En Espera...' });
      }

      this.utilsSvc.presentToast({
        message: 'Pago enviado con éxito.',
        color: 'success',
        duration: 3000
      });

    } catch (error) {
      console.log('Error enviando pago:', error);
      this.utilsSvc.presentToast({
        message: 'Error al enviar el pago.',
        color: 'danger',
        duration: 3000
      });
    }
  }

}
