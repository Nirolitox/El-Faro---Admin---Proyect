import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeAdminPage } from './home-admin.page';

const routes: Routes = [
  {
    path: '',
    component: HomeAdminPage
  },
  {
    path: 'visualizer-products',
    loadChildren: () => import('./visualizer-products/visualizer-products.module').then( m => m.VisualizerProductsPageModule)
  },
  {
    path: 'visualizer-recetas',
    loadChildren: () => import('./visualizer-recetas/visualizer-recetas.module').then( m => m.VisualizerRecetasPageModule)
  },
  {
    path: 'visualizer-products-no-elaborados',
    loadChildren: () => import('./visualizer-products-no-elaborados/visualizer-products-no-elaborados.module').then( m => m.VisualizerProductsNoElaboradosPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'view-pago',
    loadChildren: () => import('./view-pago/view-pago.module').then( m => m.ViewPagoPageModule)
  },
  {
    path: 'visualizer-promociones',
    loadChildren: () => import('./visualizer-promociones/visualizer-promociones.module').then( m => m.VisualizerPromocionesPageModule)
  },
  {
    path: 'ventas',
    loadChildren: () => import('./ventas/ventas.module').then( m => m.VentasPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeAdminPageRoutingModule {}
