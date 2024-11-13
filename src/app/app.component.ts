import { Component } from '@angular/core';
import { DomController, Platform } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform, private domCtrl: DomController) {
    this.platform.ready().then(() => {
      this.domCtrl.read(() => {
        const color = getComputedStyle(document.body).getPropertyValue('--ion-color-primary').trim();
        StatusBar.setBackgroundColor({ color });
      });
    });
  }
}
