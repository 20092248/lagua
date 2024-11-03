import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemoPageRoutingModule } from './memo-routing.module';

import { MemoPage } from './memo.page';
import { CountdownComponentModule } from 'src/app/countdown/countdown.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemoPageRoutingModule,
    CountdownComponentModule
  ],
  declarations: [MemoPage],
  exports: [MemoPage]
})
export class MemoPageModule {}
