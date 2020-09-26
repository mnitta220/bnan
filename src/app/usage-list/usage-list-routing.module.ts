import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsageListPage } from './usage-list.page';

const routes: Routes = [
  {
    path: '',
    component: UsageListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsageListPageRoutingModule {}
