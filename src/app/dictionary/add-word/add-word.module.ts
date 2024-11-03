import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddWordPageRoutingModule } from './add-word-routing.module';

import { AddWordPage } from './add-word.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddWordPageRoutingModule
  ],
  declarations: [AddWordPage]
})
export class AddWordPageModule {}
