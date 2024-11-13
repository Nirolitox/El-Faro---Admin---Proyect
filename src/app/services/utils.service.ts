import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
  import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
  import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  isSupported = false;
  barcodes: Barcode[] = [];

  constructor(private toastController: ToastController, ) {}


  loadingCtrl = inject(LoadingController);
  toastCtrl= inject(ToastController);
  modalCtrl = inject(ModalController)
  router = inject(Router)
  alertCtrl = inject(AlertController)




async takePicture (promptLabelHeader: string) {
  return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source : CameraSource.Prompt,
    promptLabelHeader,
    promptLabelPhoto: 'Selecciona Una Imagen',
    promptLabelPicture: 'Toma Una Foto'
  });
};

/////=======ALERTA======////
async presentAlert(opts?: AlertOptions) {
  const alert = await this.alertCtrl.create(opts);

  await alert.present();
}

  // LOAGING

  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent'})
  }

  //TOAST
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  async presentToas(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración del toast en milisegundos
      position: 'bottom' // Posición del toast
    });
    toast.present();
  }

  //ENRUTAR A CUALQUIER PAGINA
  routerLink(url:string) {
    return this.router.navigateByUrl(url);
  }

  ///GUARDAR ELEMENTOS LOCALMENTE
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
  }

  ///OBTENER DATOS LOCALSTORAGE
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key))
  }

  //MODAL
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(data) return data;
  }

  dismissModal(data?:any) {
    return this.modalCtrl.dismiss(data)
  }

}
