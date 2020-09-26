import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocInfoPage } from './doc-info.page';

const routes: Routes = [
  {
    path: '',
    component: DocInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocInfoPageRoutingModule {}
