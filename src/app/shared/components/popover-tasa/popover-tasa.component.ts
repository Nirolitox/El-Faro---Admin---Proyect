import { Component, inject, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { first } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-popover-tasa',
  templateUrl: './popover-tasa.component.html',
  styleUrls: ['./popover-tasa.component.scss'],
})
export class PopoverTasaComponent  implements OnInit {

  ultimaTasaParalelo: number | null = null;
  ultimaTasaCentral: number | null = null;
  ultimaTasaLocal: number | null = null;
  ultimaTasaDelivery: number | null = null;
  fecha: string | null = null;
  cargando: boolean = true;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor(private popoverCtrl: PopoverController) {}

  ngOnInit() {
    this.obtenerUltimaTasa();
  }

  close() {
    this.popoverCtrl.dismiss(); // Cierra el popover
  }

    // Método para obtener la última tasa desde Firebase
    async obtenerUltimaTasa() {
      try {
        const path = 'tasa_dolar';

        this.firebaseSvc.getCollectionData(path, {
          limit: 1,  // Limita a obtener solo el último registro
          orderBy: { field: 'fecha', direction: 'desc' }  // Ordena por fecha descendente
        }).pipe(first())  // Toma el primer valor emitido
        .subscribe(tasas => {
          if (tasas.length > 0) {
            const ultimaTasa = tasas[0];

            // Acceder a las propiedades usando la notación de corchetes
            this.ultimaTasaParalelo = ultimaTasa['valor_paralelo'];
            this.ultimaTasaCentral = ultimaTasa['valor_central'];
            this.ultimaTasaLocal = ultimaTasa['valor_local'];
            this.ultimaTasaDelivery = ultimaTasa['valor_delivery'];
            this.fecha = ultimaTasa['fecha'];

          }
          this.cargando = false; // Datos cargados, esconder skeleton

        });

      } catch (error) {
        console.error('Error obteniendo la última tasa:', error);
        this.cargando = false; // Error, esconder skeleton

      }
    }

}
