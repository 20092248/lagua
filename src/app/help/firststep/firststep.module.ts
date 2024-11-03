import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FirststepPageRoutingModule } from './firststep-routing.module';

import { FirststepPage } from './firststep.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FirststepPageRoutingModule
  ],
  declarations: [FirststepPage]
})
export class FirststepPageModule {}
