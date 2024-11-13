import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageCacheService {
  private cache: { [key: string]: string } = {};


  constructor() { }

  // Obtener imagen de la caché
  getImage(url: string): string | null {
    return this.cache[url] || null;
  }

   // Almacenar imagen en la caché
   setImage(url: string, data: string): void {
    this.cache[url] = data;
  }
}
