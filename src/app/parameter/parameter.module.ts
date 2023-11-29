import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParameterPageRoutingModule } from './parameter-routing.module';

import { ParameterPage } from './parameter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParameterPageRoutingModule
  ],
  declarations: [ParameterPage]
})
export class ParameterPageModule {}
