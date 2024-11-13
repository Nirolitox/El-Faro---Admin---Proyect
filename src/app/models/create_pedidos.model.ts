export interface CrearPedido{
  id: string,
  id_producto: string,
  image: string,
  producto: string,
  categoria: string,
  cantidad: string,
  descripcion: string,
  sub_total: number,
  status: string,
  tipo_entrega: string,
  location: string,
  fecha: string,
  hora: string,
  hora_pedido: Date,
  reservationDate: Date
}
