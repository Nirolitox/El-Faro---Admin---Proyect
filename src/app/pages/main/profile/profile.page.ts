// import { Component, OnInit } from '@angular/core';
import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { Paciente } from 'src/app/models/pacientes.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

 firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  navCtrl = inject(NavController)


  ngOnInit() {
  }


  user() :User {
    return this.utilsSvc.getFromLocalStorage('user')
  }

  async takeImage() {

    let user = this.user();
    let path = `users/${user.uid}`; // Esto añadirá un documento con un ID generado automáticamente por Firestore

    const dataUrl = (await this.utilsSvc.takePicture('Imagen Del Perfil')).dataUrl;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = `${user.uid}/profile`;
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

    this.firebaseSvc.updateDocument(path,{image: user.image}).then(async () => {

      this.utilsSvc.saveInLocalStorage('user', user);

      this.utilsSvc.presentToast({
        message: 'Imagen actuliazada exitosamente',
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

  close() {
    this.navCtrl.back();
  }

}
