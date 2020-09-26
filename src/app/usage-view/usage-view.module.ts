import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsageViewPageRoutingModule } from './usage-view-routing.module';

import { UsageViewPage } from './usage-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsageViewPageRoutingModule
  ],
  declarations: [UsageViewPage]
})
export class UsageViewPageModule {}
