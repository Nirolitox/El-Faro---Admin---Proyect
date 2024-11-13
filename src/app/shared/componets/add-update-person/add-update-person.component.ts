
import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Paciente } from 'src/app/models/pacientes.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-person',
  templateUrl: './add-update-person.component.html',
  styleUrls: ['./add-update-person.component.scss'],
})
export class AddUpdatePersonComponent implements OnInit {

  @Input() pacien: Paciente;
  selectedCarrera: string;
  asma: boolean; // Agrega la propiedad asma y define su tipo como boolean
  hipertencion: boolean; // Agrega la propiedad asma y define su tipo como boolean
  diabetes: boolean; // Agrega la propiedad asma y define su tipo como boolean
  Quirurgicos: boolean;
  anticovid: boolean;

  form = new FormGroup({
    id: new FormControl(''),
    cedula:new FormControl(null, [Validators.required, Validators.min(1)]),
    image: new FormControl('', [Validators.required]),
    nombres: new FormControl('', [Validators.required, Validators.minLength(4)]),
    apellidos: new FormControl('', [Validators.required, Validators.minLength(4)]),
    edad: new FormControl(null, [Validators.required, Validators.min(1)]),
    fechanacimiento: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required, Validators.min(1)]),
    peso: new FormControl('', [Validators.required, Validators.min(1)]),
    // sexo: new FormControl('',[Validators.required, Validators.minLength(4)]),
    estatura: new FormControl('', [Validators.required, Validators.min(1)]),
    direccion: new FormControl('', [Validators.required, Validators.minLength(4)]),
    telefonoEmergencia: new FormControl('', [Validators.required, Validators.min(1)]),
    tipoSangre: new FormControl('', [Validators.required]),  // nuevo control de formulario para el tipo de sangre
    //alergia: new FormControl('', [Validators.required, Validators.minLength(4)]),
    semestre: new FormControl(''),
    carrera: new FormControl(''),

    ///ASMA//////////////////////////////////
    asma: new FormControl(''),
    desdeCuando: new FormControl(''),
    tratamientoActual: new FormControl(''),
    ultimaCrisis: new FormControl(''),
    /////////////////////////////////////////////
    ////////////HIPERTENCION/////////////////////
    hipertencion: new FormControl(''),
    fechadiagnostico: new FormControl(''),
    tratamientoActualHiper: new FormControl(''),
    /////////////////////////////////////////////
    ///////////////DIABETES//////////////////////
    diabetes: new FormControl(''),
    fechadiagnosticodiabete: new FormControl(''),
    tratamientoActualdiabete: new FormControl(''),
    /////////////////////////////////////////////////
    //////////////Quirúrgicos////////////////////////
    Quirurgicos: new FormControl(''),
    descripcion: new FormControl(''),
    //////////////////////////////////////////////////
     //////////////Anticovid////////////////////////
    anticovid: new FormControl(''),
    descripcionanticovid: new FormControl(''),
     //////////////////////////////////////////////////

    ocupacion: new FormControl('', [Validators.required, Validators.minLength(4)]),
    //patologia: new FormControl('', [Validators.required, Validators.minLength(4)]),
    //pdf: new FormControl('', [Validators.required]),




  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  //  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService) {}
// user = {} as User;

onEdadChange(event: any) {
  const nuevaEdad = event.detail.value;
  this.actualizarFechaNacimiento(nuevaEdad);
}


actualizarFechaNacimiento(nuevaEdad: number) {
  const fechaNacimiento = this.calcularFechaNacimiento(nuevaEdad);
  const fechaFormateada = fechaNacimiento.toISOString().substring(0, 10);
  this.form.controls.fechanacimiento.setValue(fechaFormateada);
}

calcularFechaNacimiento(edad: number): Date {
  const fechaActual = new Date();
  const fechaNacimiento = new Date(fechaActual.getFullYear() - edad, fechaActual.getMonth(), fechaActual.getDate());
  return fechaNacimiento;
}



// Método para formatear la fecha de nacimiento
formatFechaNacimiento(fecha: Date) {
  const day = fecha.getDate().toString().padStart(2, '0');
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Sumar 1 porque en JavaScript los meses van de 0 a 11
  const year = fecha.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}



  ngOnInit() {

   //this.pacien = this.utilsSvc.getFromLocalStorage('pacientes');
    if (this.pacien) this.form.setValue(this.pacien);
  }

  //////////////////////ASMA///////////////////
  updateAsma(checked: boolean) {
    // Implementa aquí la lógica para actualizar el valor de asma
    this.asma = checked;
  if (this.asma) {
    this.form.controls['asma'].setValue('Asma Bronquial');
  }
}
onInput(event) {
  const inputValue = event.target.value;
  if (inputValue.length > 8) {
    event.target.value = inputValue.slice(0, 8);
  }
}


  /////////////////////HIPERTENCION//////////////////////
  updateHipertencion(checked: boolean) {
    // Implementa aquí la lógica para actualizar el valor de asma
    this.hipertencion = checked;
  }

   /////////////////////DIABETES//////////////////////
   updateDiabetes(checked: boolean) {
    // Implementa aquí la lógica para actualizar el valor de asma
    this.diabetes = checked;
  }

   /////////////////////Quirurgicos//////////////////////
   updateQuirurgicos(checked: boolean) {
    // Implementa aquí la lógica para actualizar el valor de asma
    this.Quirurgicos = checked;
  }

     /////////////////////Anticovid//////////////////////
     updateAnticovid(checked: boolean) {
      // Implementa aquí la lógica para actualizar el valor de asma
      this.anticovid = checked;
    }



  // TOMAR O SELECCIONAR UNA FOTO

  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen Del Paciente')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }


  submit() {
    if (this.form.valid) {

      if (this.pacien) this.updatePerson();
      else this.createPaciente()
    }
  }

  //====== CONVIERTE VALORES DE TIPO STRING A NUMERICO ====////

  setNumberInputs() {

    let { cedula,edad} = this.form.controls;

    if(cedula.value) cedula.setValue(parseFloat(cedula.value));
    if(edad.value) edad.setValue(parseFloat(edad.value));
  }

  async createPaciente() {

    let path = 'pacientes'; // Esto añadirá un documento con un ID generado automáticamente por Firestore

   //   this.form.controls.fechanacimiento.setValue(this.formatFechaNacimiento());




    const loading = await this.utilsSvc.loading();
    await loading.present();

    // //=====SUBIR LA IMAGEN Y OBTENER LA URL====//

    let dataUrl = this.form.value.image;
    let imagePath = `${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.id;

    this.firebaseSvc.addDocument(path, this.form.value).then(async () => {
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Paciente registrado exitosamente',
        duration: 4500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
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


  //ACTUALIZAR PACIENTE//////
  async updatePerson() {

    let path = `pacientes/${this.pacien.id}`; // Esto añadirá un documento con un ID generado automáticamente por Firestore

   // this.form.controls.fechanacimiento.setValue(this.formatFechaNacimiento());


    const loading = await this.utilsSvc.loading();
    await loading.present();

    // //=====SUBIR LA IMAGEN Y OBTENER LA URL====//
    if (this.form.value.image !== this.pacien.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.pacien.image)
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);

    }


    delete this.form.value.id;



    this.firebaseSvc.updateDocument(path, this.form.value).then(async () => {
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Paciente actuliazado exitosamente',
        duration: 4500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
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
}
