export interface Recetas_Utilizadas {
  id_receta: string,
  nombre: string,
  cantidad: number;
}

export interface Promociones {
  id: string;
  image: string;
  nombre: string;
  tiempo_de_preparacion: string;
  categoria: string,
  precio: number;
  descripcion: string;
  recetas_utilizadas: Recetas_Utilizadas[]; // Asegúrate de que sea un array de objetos
}
