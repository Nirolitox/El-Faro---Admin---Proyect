// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {


   form = new FormGroup({
      uid: new FormControl(''),
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required]),
      name: new FormControl('', [Validators.required, Validators.minLength(4), this.noNumbersOrSpecialCharsValidator()]), // Aplicar el validador
      telefono : new FormControl('',[Validators.required, Validators.minLength(11)]),
      cedula: new FormControl('',[Validators.required, Validators.minLength(7)]),
    })

   firebaseSvc = inject(FirebaseService);
   utilsSvc = inject(UtilsService);


    ngOnInit(){}

    onInputCedula(event) {
      const inputValue = event.target.value;
      if (inputValue.length > 8) {
        event.target.value = inputValue.slice(0, 8);
      }
    }

    // Validador personalizado para el nombre
noNumbersOrSpecialCharsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const valid = /^[a-zA-Z\s]+$/.test(value); // Solo letras y espacios
    return valid ? null : { invalidName: true }; // Devuelve un error si es inválido
  };
}

    onInputNombreApellido(event) {
      const inputValue = event.target.value;
      if (inputValue.length > 40) {
        event.target.value = inputValue.slice(0, 40);
      }
    }

    onInputTelefono(event) {
      const inputValue = event.target.value;
      if (inputValue.length > 11) {
        event.target.value = inputValue.slice(0, 11);
      }
    }

    onInputCorreo(event) {
      const inputValue = event.target.value;
      if (inputValue.length > 65) {
        event.target.value = inputValue.slice(0, 65);
      }
    }

    onInputPassword(event) {
      const inputValue = event.target.value;
      if (inputValue.length > 52) {
        event.target.value = inputValue.slice(0, 52);
      }
    }


    async submit() {
      if (this.form.valid) {
        const loading = await this.utilsSvc.loading();
        await loading.present();

        // Verificar si el usuario ya existe con la misma cédula o correo electrónico
        this.firebaseSvc.getUserByCedulaOrEmail(this.form.value.cedula, this.form.value.email).then(async (user) => {
          if (user) {
            // Si el usuario ya existe, mostrar un mensaje de error
            this.utilsSvc.presentToast({
              message: 'El usuario ya existe con la misma cédula o correo electrónico',
              duration: 4500,
              color: 'primary',
              position: 'middle',
              icon: 'alert-circle-outline'
            });
          } else {
            // Si el usuario no existe, proceder con el registro
            this.firebaseSvc.signUp(this.form.value as User).then(async (res) => {
              await this.firebaseSvc.updateUser(this.form.value.name);
              let uid = res.user.uid;
              this.form.controls.uid.setValue(uid);

              this.setUserInfo(uid);
            }).catch((error) => {
              console.log(error);

              this.utilsSvc.presentToast({
                message: error.message,
                duration: 4500,
                color: 'primary',
                position: 'middle',
                icon: 'alert-circle-outline'
              });
            });
          }
        }).catch((error) => {
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



  async setUserInfo(uid:string) {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;
      delete this.form.value.password;
      this.firebaseSvc.setDocument(path,this.form.value).then(async res=>{

        this.utilsSvc.saveInLocalStorage('user',this.form.value);
        this.utilsSvc.routerLink('/main/home/menu');
        this.form.reset();


      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message:error.message,
          duration:4500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();
      })
    }
    // console.log(this.form.value);
  }
}
