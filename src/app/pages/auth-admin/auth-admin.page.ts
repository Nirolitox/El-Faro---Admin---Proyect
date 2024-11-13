import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth-admin',
  templateUrl: './auth-admin.page.html',
  styleUrls: ['./auth-admin.page.scss'],
})
export class AuthAdminPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required])
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);


  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        const emailExists = await this.firebaseSvc.AdminExists(this.form.value.email);
        if (!emailExists) {
          throw new Error('Usuario inválido');
        }
        await this.firebaseSvc.signIn(this.form.value as User).then(res => {
          console.log(res);
          this.getUserInfo(res.user.uid);
        }).catch(error => {
          throw new Error('Contraseña incorrecta.');
        });

      } catch (error) {
        console.log(error.message);

        ////TOAST PARA MENSAJE
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 4500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });

      } finally {
        loading.dismiss();
      }
    }
  }


  async getUserInfo(uid:string) {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `admin/${uid}`;

      this.firebaseSvc.getDocument(path).then((user: User) =>{

        this.utilsSvc.saveInLocalStorage('user',user);
        this.utilsSvc.routerLink('/main/home-admin');
        this.form.reset();


        this.utilsSvc.presentToast({
          message: `Bienvenido! ${user.name}`,
          duration:4500,
          color: 'primary',
          position: 'middle',
          icon: 'person-circle-outline'
        })


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

  onInputPassword(event) {
    const inputValue = event.target.value;
    if (inputValue.length > 52) {
      event.target.value = inputValue.slice(0, 52);
    }
  }

  onInputCorreo(event) {
    const inputValue = event.target.value;
    if (inputValue.length > 65) {
      event.target.value = inputValue.slice(0, 65);
    }
  }

}
