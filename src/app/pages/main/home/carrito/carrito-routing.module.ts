import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarritoPage } from './carrito.page';
import { MenuPage } from '../menu/menu.page';

const routes: Routes = [
  {
    path: '',
    component: CarritoPage
  },
  {
    path: 'menu',
    component: MenuPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarritoPageRoutingModule {}
