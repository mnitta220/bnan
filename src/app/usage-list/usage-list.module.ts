import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsageListPageRoutingModule } from './usage-list-routing.module';

import { UsageListPage } from './usage-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsageListPageRoutingModule
  ],
  declarations: [UsageListPage]
})
export class UsageListPageModule {}
