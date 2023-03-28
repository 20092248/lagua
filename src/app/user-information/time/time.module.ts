import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimePageRoutingModule } from './time-routing.module';

import { TimePage } from './time.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimePageRoutingModule
  ],
  declarations: [TimePage]
})
export class TimePageModule {}
