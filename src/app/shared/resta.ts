  // Restar la cantidad de productos utilizados en la base de datos
  // await this.updateProductoCantidad();


    // Actualizar la cantidad de productos en la base de datos
// async updateProductoCantidad() {
//   const IngredientesUtilizados = this.form.value.ingredietes_utilizados;

//   for (let producto of productosUtilizados) {
//     // Filtrar productos que coincidan con el nombre
//     let productosDB = this.inversionProductos.filter(p => p.nombre === producto.producto);

//     // Ordenar por medida en orden ascendente (de menor a mayor)
//     productosDB = productosDB.sort((a, b) => a.medida - b.medida);

//     let cantidadRestante = producto.cantidad;

//     // Recorrer los productos ordenados por medida
//     for (let productoDB of productosDB) {
//       if (cantidadRestante <= 0) {
//         break; // Si ya se ha restado todo, salir del bucle
//       }

//       const nuevaCantidad = productoDB.medida - cantidadRestante;

//       if (nuevaCantidad <= 0) {
//         // Si la nueva cantidad es 0 o menor, eliminar el producto
//         await this.firebaseSvc.deleteDocument(`inversion_productos/${productoDB.id}`);
//         cantidadRestante = Math.abs(nuevaCantidad); // Continuar restando el sobrante
//       } else {
//         // Si la nueva cantidad es mayor que 0, actualizar la medida y detener la resta
//         await this.firebaseSvc.updateDocument(`inversion_productos/${productoDB.id}`, { medida: nuevaCantidad });
//         cantidadRestante = 0; // Ya se restó toda la cantidad necesaria
//       }
//     }

//     if (cantidadRestante > 0) {
//       // Si después de restar a todos los productos aún queda cantidad por restar
//       console.error(`No hay suficiente stock para restar ${producto.cantidad} de ${producto.producto}`);
//       this.utilsSvc.presentToast({
//         message: `No hay suficiente stock para ${producto.producto}`,
//         duration: 4500,
//         color: 'warning',
//         position: 'middle',
//         icon: 'alert-circle-outline'
//       });
//     }
//   }
// }
