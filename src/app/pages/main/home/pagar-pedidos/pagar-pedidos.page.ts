import { Component, inject, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { CrearPedido } from 'src/app/models/create_pedidos.model';
import { Inversion_Productos } from 'src/app/models/inversion_productos.model';
import { PedidosPagos, ProductoPedido } from 'src/app/models/pedidos_pagos.model';
import { Productos_No_Elaborados } from 'src/app/models/productos_no_elaborados.model';

import { User } from 'src/app/models/user.model';
import { Ventas } from 'src/app/models/ventas.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-pagar-pedidos',
  templateUrl: './pagar-pedidos.page.html',
  styleUrls: ['./pagar-pedidos.page.scss'],
})
export class PagarPedidosPage implements OnInit {

  navCrtl = inject(NavController);
  lista_productos: ProductoPedido[] = []; // Usando el tipo ProductoPedido del modelo
  metodoPago: string = '';
  imagePago: string = '';
  loadingCtrl = inject(LoadingController);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  valor_local: number = 0;
  valor_delivery: number = 0;
  mostrarSubirImagen: boolean = false;
  totalDolares: number = 0;
  totalBolivares: number = 0;
  totalConDelivery: number = 0;


  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ngOnInit() {
    this.obtenerProductos();
    this.obtenerTasaLocal();
  }

  obtenerTasaLocal() {
    const path = 'tasa_dolar';
    this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          this.valor_local = res[0].valor_local;
          this.valor_delivery = res[0].valor_delivery || 0;
          this.calcularTotales();
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



  obtenerProductos() {
    const path = `users/${this.user().uid}/pedidos`;

    this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.lista_productos = res.filter((pedido: CrearPedido) => pedido.status === 'Por Pagar...');

        // Calcular el valor en bolívares para cada producto
        this.lista_productos = this.lista_productos.map((producto: ProductoPedido) => {
          return {
            ...producto,
            bolivares: producto.sub_total * this.valor_local // Calcular bolivares
          };
        });

        this.calcularTotales(); // Asegúrate de recalcular los totales si es necesario
      },
      error: (err) => {
        console.log('Error obteniendo productos:', err);
      }
    });
  }

  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Comprobante De Pago')).dataUrl;

    // Definir un nombre de archivo único para cada imagen
    const filePath = `comprobantes/${this.user().uid}_${new Date().getTime()}.jpg`;

    try {
      this.imagePago = await this.firebaseSvc.uploadImage(filePath, dataUrl);
      this.utilsSvc.presentToast({
        message: 'Imagen subida con éxito.',
        color: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('Error subiendo la imagen:', error);
      this.utilsSvc.presentToast({
        message: 'Error al subir la imagen.',
        color: 'danger',
        duration: 3000
      });
    }
  }

  calcularTotales() {
    // Total en dólares sin incluir el delivery
    this.totalDolares = this.lista_productos.reduce((total, producto) => total + (producto.sub_total || 0), 0);

    // Verificar si hay algún pedido con tipo_entrega 'Delivery' para incluir el costo de delivery
    const tieneDelivery = this.lista_productos.some(producto => producto.tipo_entrega === 'Delivery');
    if (tieneDelivery && this.valor_delivery) {
      this.totalConDelivery = this.totalDolares + (this.valor_delivery / this.valor_local);
    } else {
      this.totalConDelivery = this.totalDolares;
    }

    // Calcular el total en bolívares
    this.totalBolivares = this.totalConDelivery * this.valor_local;
  }

  onMetodoPagoChange() {
    this.mostrarSubirImagen = this.metodoPago === 'PagoMóvil' || this.metodoPago === 'Transferencia';
  }


  calculateTotal(): number {
    return this.lista_productos.reduce((total, producto) => total + (producto.sub_total || 0), 0);
  }

  calculateTotalBs(): number {
    return this.valor_local > 0 ? this.calculateTotal() * this.valor_local : 0;
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

    if ((this.metodoPago === 'PagoMóvil' || this.metodoPago === 'Transferencia') && !this.imagePago) {
      this.utilsSvc.presentToast({
        message: 'Sube un comprobante de pago.',
        color: 'danger',
        duration: 3000
      });
      return;
    }

    const imageUsuario = this.user().image || '';
    const imagePago = (this.metodoPago === 'PagoMóvil' || this.metodoPago === 'Transferencia') ? this.imagePago : '';

    const productosValidos = this.lista_productos.map(p => ({
      id: p.id,
      image: p.image || '',
      producto: p.producto || '',
      status: 'En Espera...',
      cantidad: p.cantidad || 0,
      categoria: p.categoria || '',
      descripcion: p.descripcion || '',
      fecha: p.fecha || '',
      hora: p.hora || '',
      sub_total: p.sub_total || 0,
      bolivares: p.sub_total * this.valor_local,
      tipo_entrega: p.tipo_entrega || '',
      reservationDate: p.reservationDate || '',
      hora_pedido: p.hora_pedido || '',
      location: p.tipo_entrega === 'Delivery' ? (p.location || '') : null
    }));

    const pago = {
      image: imageUsuario,
      image_pago: imagePago,
      cedula: this.user().cedula || '',
      name: this.user().name || '',
      telefono: this.user().telefono || '',
      userId: this.user().uid || '',
      lista_productos: productosValidos,
      metodo_pago: this.metodoPago,
      status: 'En Espera...',
      total_dolares: this.totalDolares, // Asegúrate de tener este valor calculado
      total_bolivares: this.totalBolivares // Agregar total en bolívares


    };

    const loading = await this.loadingCtrl.create({
      message: 'Enviando pago...',
    });
    await loading.present();

    try {
      // Guardar el pago en Firestore
      await this.firebaseSvc.addDocument('pedidos_pagos', pago);

      // Crear y guardar las ventas
      for (const producto of productosValidos) {
        const venta: Ventas = {
          id: producto.id,
          producto: producto.producto,
          descripcion_productos: producto.descripcion,
          fecha_venta: producto.fecha,
          hora_venta: producto.hora,
          cedula_cliente: this.user().cedula || '',
          nombre_cliente: this.user().name || '',
          metodo_pago: this.metodoPago,
          cantidad: producto.cantidad.toString(), // Asegúrate de que sea un string
          sub_total: (producto.sub_total), // Asegúrate de que sea un string
          sub_total_bolivares: (producto.bolivares), // Asegúrate de que sea un string
        };

        await this.firebaseSvc.addDocument('ventas', venta);
      }

      // Actualizar el estado de los pedidos
      for (const pedido of this.lista_productos) {
        const pedidoPath = `users/${this.user().uid}/pedidos/${pedido.id}`;
         // Solo actualiza si el estado actual es "Por Pagar..."
        if (pedido.status === 'Por Pagar...') {
          await this.firebaseSvc.updateDocument(pedidoPath, { status: 'En Espera...' });
        }

        if (pedido.categoria === 'Producto No Elaborado') {
          const productoPath = `productos_no_elaborados/${pedido.id_producto}`; // Asumiendo que el id_producto se relaciona directamente con el id en productos_no_elaborados
          const producto = await this.firebaseSvc.getDocument(productoPath); // Obtener el producto actual
          const cantidadComprar = parseInt(producto['cantidad_comprar']);
          const cantidadPedido = (pedido.cantidad);
          if (!isNaN(cantidadComprar) && !isNaN(cantidadPedido)) {
            const nuevaCantidad = cantidadComprar - cantidadPedido;
            await this.firebaseSvc.updateDocument(productoPath, { cantidad_comprar: nuevaCantidad });
          } else {
            console.error('Error al convertir cantidades a número.');
          }
        }

        if (pedido.categoria === 'Menu' || pedido.categoria === 'Bebidas') {
          const recetaPath = `recetas/${pedido.id_producto}`;
          const receta = await this.firebaseSvc.getDocument(recetaPath);

          if (Array.isArray(receta['ingredientes_utilizados'])) {
            for (const ingrediente of receta['ingredientes_utilizados']) {
              const idIngrediente = ingrediente['id_ingrediente'];
              const medidaIngrediente = ingrediente['medida'];

              if (idIngrediente && medidaIngrediente != null) {
                const ingredientePath = `inversion_productos/${idIngrediente}`;
                const producto = await this.firebaseSvc.getDocument(ingredientePath);

                const medidaProducto = parseFloat(producto['medida']);
                const medidaAUsar = parseFloat(medidaIngrediente) * pedido.cantidad;

                if (!isNaN(medidaProducto) && !isNaN(medidaAUsar)) {
                  const nuevaMedida = medidaProducto - medidaAUsar;

                  // Actualizamos el producto en inversion_productos con la nueva medida
                  await this.firebaseSvc.updateDocument(ingredientePath, { medida: nuevaMedida });
                } else {
                  console.error('Error al convertir las medidas a números.');
                }
              } else {
                console.error('Ingrediente no tiene id_ingrediente o medida.');
              }
            }
          } else {
            console.error('La receta no contiene un array de ingredientes.');
          }
        }

        if (pedido.categoria === 'Promocion') {
          const promocionPath = `promociones/${pedido.id_producto}`;
          const promocion = await this.firebaseSvc.getDocument(promocionPath);

          // Asegúrate de que recetas_utilizadas sea un array
          if (Array.isArray(promocion['recetas_utilizadas'])) {
            for (const recetaPromocion of promocion['recetas_utilizadas']) {
              const idReceta = recetaPromocion['id_receta'];
              const cantidadReceta = recetaPromocion['cantidad'];

              if (idReceta && cantidadReceta != null) { // Validación de existencia de id_receta y cantidad
                const recetaPath = `recetas/${idReceta}`;
                const receta = await this.firebaseSvc.getDocument(recetaPath);

                // Asegúrate de que ingredientes_utilizados sea un array en la receta
                if (Array.isArray(receta['ingredientes_utilizados'])) {
                  for (const ingrediente of receta['ingredientes_utilizados']) {
                    const idIngrediente = ingrediente['id_ingrediente'];
                    const medidaIngrediente = ingrediente['medida'];

                    if (idIngrediente && medidaIngrediente != null) {
                      const ingredientePath = `inversion_productos/${idIngrediente}`;
                      const producto = await this.firebaseSvc.getDocument(ingredientePath);

                      // Convertimos a número las cantidades y validamos
                      const medidaProducto = parseFloat(producto['medida']);
                      const medidaAUsar = parseFloat(medidaIngrediente) * cantidadReceta * pedido.cantidad;

                      if (!isNaN(medidaProducto) && !isNaN(medidaAUsar)) {
                        const nuevaMedida = medidaProducto - medidaAUsar;

                        // Actualizamos el producto en inversion_productos con la nueva medida
                        await this.firebaseSvc.updateDocument(ingredientePath, { medida: nuevaMedida });
                      } else {
                        console.error('Error al convertir las medidas a números.');
                      }
                    } else {
                      console.error('Ingrediente no tiene id_ingrediente o medida.');
                    }
                  }
                } else {
                  console.error('La receta no contiene un array de ingredientes.');
                }
              } else {
                console.error('Receta de la promoción no tiene id_receta o cantidad.');
              }
            }
          } else {
            console.error('La promoción no contiene un array de recetas.');
          }
        }





      }

      this.utilsSvc.presentToast({
        message: 'Pago enviado con éxito.',
        color: 'success',
        duration: 3000
      });
      await loading.dismiss();
      this.close();
    } catch (error) {
      console.log('Error enviando pago:', error);
      this.utilsSvc.presentToast({
        message: 'Ha ocurrido un error inesperado, intenta otra vez dandole al boton.',
        color: 'danger',
        duration: 3000
      });
      await loading.dismiss();
    }
  }



  // Nueva función para copiar texto al portapapeles
  copyText(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.utilsSvc.presentToast({
        message: 'Texto copiado al portapapeles',
        color: 'success',
        duration: 2000
      });
    }).catch(err => {
      console.error('Error al copiar:', err);
      this.utilsSvc.presentToast({
        message: 'Error al copiar el texto',
        color: 'danger',
        duration: 2000
      });
    });
  }
}
