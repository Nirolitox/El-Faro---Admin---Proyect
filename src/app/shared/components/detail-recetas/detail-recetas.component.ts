import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recetas } from 'src/app/models/recetas.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-detail-recetas',
  templateUrl: './detail-recetas.component.html',
  styleUrls: ['./detail-recetas.component.scss'],
})
export class DetailRecetasComponent  implements OnInit {
  receta: Recetas;
  constructor(private route: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    const recetaId = this.route.snapshot.paramMap.get('id');
    if (recetaId) {
      this.getReceta(recetaId);
    } else {
      console.error('No se ha proporcionado un ID de receta.');
    }
  }

  close() {
    this.utilsSvc.dismissModal();
  }

  async getReceta(id: string) {
    const path = `recetas/${id}`;
    try {
      const data = await this.firebaseSvc.getDocument(path);
      this.receta = {
        id,  // Asigna manualmente el ID
        image: this.receta.image,
        nombre: this.receta.nombre,
        tiempo_de_preparacion: this.receta.tiempo_de_preparacion,
        precio: this.receta.precio,
        descripcion: this.receta.descripcion,
        ingredientes_utilizados: this.receta.ingredientes_utilizados
      } as Recetas;
    } catch (error) {
      console.error('Error al obtener la receta:', error);
    }
  }


}
