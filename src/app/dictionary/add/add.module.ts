import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddPageRoutingModule } from './add-routing.module';
import { AddPage } from './add.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AddPageRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [AddPage]
})
export class AddPageModule {}
