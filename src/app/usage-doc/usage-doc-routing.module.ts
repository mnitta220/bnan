import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsageDocPage } from './usage-doc.page';

const routes: Routes = [
  {
    path: '',
    component: UsageDocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsageDocPageRoutingModule {}
