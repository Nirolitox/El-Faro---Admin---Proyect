import { Component, inject, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Promociones } from 'src/app/models/promociones.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-detail-promociones',
  templateUrl: './detail-promociones.component.html',
  styleUrls: ['./detail-promociones.component.scss'],
})
export class DetailPromocionesComponent  implements OnInit {

  @Input() promocion: Promociones;
  navCrtl = inject(NavController);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
    if (!this.promocion) {
      this.utilsSvc.presentToast({
        message: 'Error al cargar los datos de la promoción',
        color: 'danger',
        duration: 4000
      });
      this.close();
    }
  }

  close() {
    this.utilsSvc.dismissModal();
  }

}
