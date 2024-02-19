import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MixPageRoutingModule } from './mix-routing.module';

import { MixPage } from './mix.page';
import { QcmPageModule } from '../qcm/qcm.module';
import { TranslatePageModule } from '../translate/translate.module';
import { SpellPageModule } from '../spell/spell.module';
import { MemoPageModule } from '../memo/memo.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MixPageRoutingModule,
    QcmPageModule,
    TranslatePageModule,
    SpellPageModule,
    MemoPageModule
  ],
  declarations: [MixPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class MixPageModule {}
