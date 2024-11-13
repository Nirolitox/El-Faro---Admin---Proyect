import { Component, Input, OnInit, inject } from '@angular/core';
import { Paciente } from 'src/app/models/pacientes.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdatePersonComponent } from 'src/app/shared/componets/add-update-person/add-update-person.component';
import { DetailPage } from './detail/detail.page';
import { orderBy} from 'firebase/firestore';
import { ConsultaPage } from './consulta/consulta.page';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private tabsVisible: boolean = true;


  ngOnInit() {
  }

  setTabsVisibility(visible: boolean) {
    this.tabsVisible = visible;
  }

  areTabsVisible(): boolean {
    return this.tabsVisible;
  }

}
