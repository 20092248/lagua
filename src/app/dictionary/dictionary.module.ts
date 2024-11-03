import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DictionaryPageRoutingModule } from './dictionary-routing.module';
import { DictionaryPage } from './dictionary.page';
import { BarStatusComponentModule } from '../bar-status/bar-status.module';
import { LottieModule } from 'ngx-lottie';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    DictionaryPageRoutingModule,
    BarStatusComponentModule,
    LottieModule
  ],
  declarations: [DictionaryPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DictionaryPageModule {}
