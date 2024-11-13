export interface Notificaciones {
  id: string;            // Identificador único de la notificación
  mensaje: string;      // Mensaje de la notificación
  pedidoId: string;
  timestamp: Date;      // Cambiado a Date
  userId: string;
}
