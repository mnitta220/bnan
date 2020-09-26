import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocViewPage } from './doc-view.page';

const routes: Routes = [
  {
    path: '',
    component: DocViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocViewPageRoutingModule {}
