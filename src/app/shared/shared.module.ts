import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './componets/header/header.component';
import { CustomInputComponent } from './componets/custom-input/custom-input.component';
import { IonicModule, PopoverController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdatePersonComponent } from './componets/add-update-person/add-update-person.component';
import { AddUpdateTasaDolarComponent } from './components/add-update-tasa-dolar/add-update-tasa-dolar.component';
import { PopoverTasaComponent } from './components/popover-tasa/popover-tasa.component';
import { AddUpdateInversionComponent } from './components/add-update-inversion/add-update-inversion.component';
import { AddUpdateRecetasComponent } from './components/add-update-recetas/add-update-recetas.component';
import { DetailRecetasComponent } from './components/detail-recetas/detail-recetas.component';
import { AddUpdateProductosNoElaboradosComponent } from './components/add-update-productos-no-elaborados/add-update-productos-no-elaborados.component';
import { CreatePedidoComponent } from './components/create-pedido/create-pedido.component';
import { CreatePedidoProductComponent } from './components/create-pedido-product/create-pedido-product.component';
import { ViewPedidosComponent } from './components/view-pedidos/view-pedidos.component';
import { PopoverNotificationsClientComponent } from './components/popover-notifications-client/popover-notifications-client.component';
import { AddUpdatePromocionesComponent } from './components/add-update-promociones/add-update-promociones.component';
import { DetailPromocionesComponent } from './components/detail-promociones/detail-promociones.component';


@NgModule({
  declarations: [
  HeaderComponent,
  CustomInputComponent,
  AddUpdatePersonComponent,
  AddUpdateTasaDolarComponent,
  AddUpdateInversionComponent,
  PopoverTasaComponent,
  AddUpdateRecetasComponent,
  DetailRecetasComponent,
  AddUpdateProductosNoElaboradosComponent,
  CreatePedidoComponent,
  CreatePedidoProductComponent,
  ViewPedidosComponent,
  PopoverNotificationsClientComponent,
  AddUpdatePromocionesComponent,
  DetailPromocionesComponent

  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    ReactiveFormsModule,
    AddUpdatePersonComponent,
    AddUpdateInversionComponent,
    AddUpdateTasaDolarComponent,
    PopoverTasaComponent,
    AddUpdateRecetasComponent,
    DetailRecetasComponent,
    AddUpdateProductosNoElaboradosComponent,
    CreatePedidoComponent,
    CreatePedidoProductComponent,
    ViewPedidosComponent,
    PopoverNotificationsClientComponent,
    AddUpdatePromocionesComponent,
    DetailPromocionesComponent

  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
