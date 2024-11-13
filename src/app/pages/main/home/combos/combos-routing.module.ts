import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CombosPage } from './combos.page';

const routes: Routes = [
  {
    path: '',
    component: CombosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CombosPageRoutingModule {}
