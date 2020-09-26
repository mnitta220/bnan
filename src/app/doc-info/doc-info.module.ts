import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocInfoPageRoutingModule } from './doc-info-routing.module';

import { DocInfoPage } from './doc-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocInfoPageRoutingModule
  ],
  declarations: [DocInfoPage]
})
export class DocInfoPageModule {}
