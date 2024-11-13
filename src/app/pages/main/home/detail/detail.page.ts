import { Component, Input, OnInit, inject } from '@angular/core';
import { Paciente } from 'src/app/models/pacientes.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

@Input () pacien: Paciente

  ngOnInit() {
  }
  utilsSvc = inject(UtilsService);

}
