export interface ProductoPedido {
  id: string;
  id_producto: string;
  image: string;
  producto: string;
  status: string;
  cantidad: number;
  categoria: string;
  descripcion: string;
  fecha: string;
  hora: string;
  sub_total: number;
  bolivares: number;
  tipo_entrega: string;
  reservationDate: string;
  hora_pedido: string;
  location?: string | null;
}
export interface PedidosPagos {
  userId:string;
  id: string;
  image: string;            // Imagen del usuario
  image_pago: string;       // Comprobante de pago
  cedula: string;           // Cédula del usuario
  name: string;             // Nombre del usuario
  lista_productos: ProductoPedido[]; // Lista de productos pedidos
  metodo_pago: string;      // Método de pago (PagoMóvil, Transferencia, Efectivo, etc.)
  status: string;           // Estado del pago (e.g., "En Espera...")
  telefono: string;           // Estado del pago (e.g., "En Espera...")
  total_dolares: number;
  total_bolivares: number;
}
