import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnlockPage } from './unlock.page';

const routes: Routes = [
  {
    path: '',
    component: UnlockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnlockPageRoutingModule {}
