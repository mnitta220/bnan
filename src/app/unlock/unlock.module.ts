import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UnlockPageRoutingModule } from './unlock-routing.module';

import { UnlockPage } from './unlock.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UnlockPageRoutingModule
  ],
  declarations: [UnlockPage]
})
export class UnlockPageModule {}
