import { Component, OnInit } from '@angular/core';
import { Notificaciones } from 'src/app/models/notificaciones.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AlertController } from '@ionic/angular';
import { where } from '@angular/fire/firestore';

@Component({
  selector: 'app-popover-notifications-client',
  templateUrl: './popover-notifications-client.component.html',
  styleUrls: ['./popover-notifications-client.component.scss'],
})
export class PopoverNotificationsClientComponent implements OnInit {
  notifications: Notificaciones[] = [];

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
      this.getNotifications();
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ///=====CONFIRMAR ELIMINACIÓN=====///
  async deleteNotificacion(notification: Notificaciones) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro que deseas eliminar esta notificación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Si',
          handler: () => {
            this.delete(notification);
          }
        }
      ]
    });

    await alert.present();
  }

  ///=====ELIMINAR LA NOTIFICACION=====///
  async delete(notificacion: Notificaciones) {
    const path = `notificaciones/${notificacion.id}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      await this.firebaseSvc.deleteDocument(path);
      this.notifications = this.notifications.filter(p => p.id !== notificacion.id);
      this.utilsSvc.presentToast({
        message: 'Notificación eliminada',
        duration: 4500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    } catch (error) {
      console.log(error);
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

  getNotifications() {
    let path = 'notificaciones';
    let query = where('userId', '==', this.user().uid);
    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.notifications = res.map((notification: any) => ({
          ...notification,
          timestamp: notification.timestamp
            ? new Date(notification.timestamp.seconds * 1000)
            : null
        }));
        sub.unsubscribe();
      },
      error: (error) => {
        console.error("Error al obtener notificaciones:", error);
      }
    });
  }

}
