import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactusPageRoutingModule } from './contactus-routing.module';

import { ContactusPage } from './contactus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactusPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ContactusPage]
})
export class ContactusPageModule {}
