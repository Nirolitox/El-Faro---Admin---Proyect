import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'productos',
        loadChildren: () => import('./productos/productos.module').then( m => m.ProductosPageModule)
      },
      {
        path: 'menu',
        loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
      },
      {
        path: 'seccion-especial',
        loadChildren: () => import('./seccion-especial/seccion-especial.module').then( m => m.SeccionEspecialPageModule)
      },
      {
        path: 'combos',
        loadChildren: () => import('./combos/combos.module').then( m => m.CombosPageModule)
      },
      {
        path: 'carrito',
        loadChildren: () => import('./carrito/carrito.module').then( m => m.CarritoPageModule)
      },
    ]
  },
  {
    path: 'detail',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'consulta',
    loadChildren: () => import('./consulta/consulta.module').then( m => m.ConsultaPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'seccion-especial',
    loadChildren: () => import('./seccion-especial/seccion-especial.module').then( m => m.SeccionEspecialPageModule)
  },
  {
    path: 'combos',
    loadChildren: () => import('./combos/combos.module').then( m => m.CombosPageModule)
  },
  {
    path: 'carrito',
    loadChildren: () => import('./carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'pagar-pedidos',
    loadChildren: () => import('./pagar-pedidos/pagar-pedidos.module').then( m => m.PagarPedidosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
