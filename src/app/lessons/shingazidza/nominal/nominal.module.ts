import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NominalPageRoutingModule } from './nominal-routing.module';

import { NominalPage } from './nominal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NominalPageRoutingModule
  ],
  declarations: [NominalPage]
})
export class NominalPageModule {}
