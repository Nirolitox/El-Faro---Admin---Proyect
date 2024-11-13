import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthAdminPageRoutingModule } from './auth-admin-routing.module';

import { AuthAdminPage } from './auth-admin.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthAdminPageRoutingModule,
    SharedModule
  ],
  declarations: [AuthAdminPage]
})
export class AuthAdminPageModule {}
