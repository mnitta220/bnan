import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsageDocPageRoutingModule } from './usage-doc-routing.module';

import { UsageDocPage } from './usage-doc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsageDocPageRoutingModule
  ],
  declarations: [UsageDocPage]
})
export class UsageDocPageModule {}
