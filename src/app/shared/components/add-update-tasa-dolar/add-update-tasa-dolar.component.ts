import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { first } from 'rxjs';
import { Tasa_Dia } from 'src/app/models/tasa_dia.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-tasa-dolar',
  templateUrl: './add-update-tasa-dolar.component.html',
  styleUrls: ['./add-update-tasa-dolar.component.scss'],
})
export class AddUpdateTasaDolarComponent  implements OnInit {

  @Input() tasa: Tasa_Dia;

  // Variables para almacenar las tasas
  ultimaTasaParalelo: number | null = null;
  ultimaTasaCentral: number | null = null;
  ultimaTasaLocal: number | null = null;
  ultimaTasaDelivery: number | null = null;
  fecha: string | null = null;
  cargando: boolean = true;


  form = new FormGroup({
    // valor_paralelo:new FormControl(null, [Validators.required, Validators.min(1)]),
    valor_central:new FormControl(null, [Validators.required, Validators.min(1)]),
    valor_local:new FormControl(null, [Validators.required, Validators.min(1)]),
    valor_delivery:new FormControl(null, [Validators.required, Validators.min(1)]),
    fecha: new FormControl('', [Validators.required]),
    hora: new FormControl('', [Validators.required]),

  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  modalCtrl = inject(ModalController); // Inyecta ModalController


  ngOnInit() {
    this.obtenerUltimaTasa();
  }

    // Método para eliminar todos los registros de la colección 'tasa_dolar'
    async eliminarTodosLosRegistros() {
      const path = 'tasa_dolar';
      try {
        const tasas = await this.firebaseSvc.getCollectionData(path).pipe(first()).toPromise();

        const deletePromises = tasas.map(tasa => {
          return this.firebaseSvc.deleteDocument(`${path}/${tasa.id}`);
        });

        await Promise.all(deletePromises); // Espera a que se eliminen todos los registros
      } catch (error) {
        console.error('Error eliminando registros:', error);
      }
    }

    async submit() {
      const path = `tasa_dolar`;

      const loading = await this.utilsSvc.loading();
      await loading.present();

      // Eliminar todos los registros antes de enviar el nuevo
      await this.eliminarTodosLosRegistros();

      // Obtener la fecha actual del sistema
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      // Obtener la hora actual del sistema
      const hours = currentDate.getHours().toString().padStart(2, '0');
      const minutes = currentDate.getMinutes().toString().padStart(2, '0');
      const seconds = currentDate.getSeconds().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}:${seconds}`;

      // Establecer la fecha y la hora en los campos del formulario
      this.form.controls.fecha.setValue(formattedDate);
      this.form.controls.hora.setValue(formattedTime);

      // Asegurarse de que los valores sean numéricos
      this.setNumberInputs();

      // Enviar los datos a Firebase
      this.firebaseSvc.addDocument(path, this.form.value).then(async () => {
        this.utilsSvc.presentToast({
          message: 'Precio del dólar agregado/actualizado',
          duration: 4500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle'
        });
        this.form.reset();
        await this.modalCtrl.dismiss();
      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 4500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
    }

////////////////////////////////////////////////////////
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
          // this.ultimaTasaParalelo = ultimaTasa['valor_paralelo'];
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

  onInputCentral(event) {
    const inputValue = event.target.value;
    if (inputValue.length > 5) {
      event.target.value = inputValue.slice(0, 5);
    }
  }

  onInputParalelo(event) {
    const inputValue = event.target.value;
    if (inputValue.length > 5) {
      event.target.value = inputValue.slice(0, 5);
    }
  }


  close() {
    this.utilsSvc.dismissModal();
  }

  //////////////////////////////////////////////////////////////
    //====== CONVIERTE VALORES DE TIPO STRING A NUMERICO ====////

    setNumberInputs() {

      let { valor_central, valor_local} = this.form.controls;

      if(valor_central.value) valor_central.setValue(parseFloat(valor_central.value));
      if(valor_local.value) valor_local.setValue(parseFloat(valor_local.value));
    }

}
