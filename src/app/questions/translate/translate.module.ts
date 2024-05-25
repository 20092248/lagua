import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslatePageRoutingModule } from './translate-routing.module';

import { TranslatePage } from './translate.page';
import { CountdownComponentModule } from 'src/app/countdown/countdown.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslatePageRoutingModule,
    CountdownComponentModule
  ],
  declarations: [TranslatePage],
  exports: [TranslatePage]
})
export class TranslatePageModule {}
