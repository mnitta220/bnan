import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocViewPageRoutingModule } from './doc-view-routing.module';

import { DocViewPage } from './doc-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocViewPageRoutingModule
  ],
  declarations: [DocViewPage]
})
export class DocViewPageModule {}
