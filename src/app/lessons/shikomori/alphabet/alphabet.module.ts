import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlphabetPageRoutingModule } from './alphabet-routing.module';

import { AlphabetPage } from './alphabet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlphabetPageRoutingModule
  ],
  declarations: [AlphabetPage]
})
export class AlphabetPageModule {}
