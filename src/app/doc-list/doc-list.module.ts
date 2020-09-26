import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocListPageRoutingModule } from './doc-list-routing.module';

import { DocListPage } from './doc-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocListPageRoutingModule
  ],
  declarations: [DocListPage]
})
export class DocListPageModule {}
