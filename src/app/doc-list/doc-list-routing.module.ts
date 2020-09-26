import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocListPage } from './doc-list.page';

const routes: Routes = [
  {
    path: '',
    component: DocListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocListPageRoutingModule {}
