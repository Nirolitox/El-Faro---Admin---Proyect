export interface Ingredientes_Utilizados {
  id_ingrediente: string,
  nombre: string,
  medida: number;
}

export interface Recetas {
  id: string;
  image: string;
  nombre: string;
  tiempo_de_preparacion: string;
  categoria: string,
  precio: number;
  descripcion: string;
  ingredientes_utilizados: Ingredientes_Utilizados[]; // Asegúrate de que sea un array de objetos
}
