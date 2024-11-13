import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-seleccion-user',
  templateUrl: './seleccion-user.page.html',
  styleUrls: ['./seleccion-user.page.scss'],
})
export class SeleccionUserPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }
}
