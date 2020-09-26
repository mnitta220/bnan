import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsageViewPage } from './usage-view.page';

const routes: Routes = [
  {
    path: '',
    component: UsageViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsageViewPageRoutingModule {}
