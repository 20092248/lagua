import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LegalNoticesPageRoutingModule } from './legal-notices-routing.module';

import { LegalNoticesPage } from './legal-notices.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LegalNoticesPageRoutingModule
  ],
  declarations: [LegalNoticesPage]
})
export class LegalNoticesPageModule {}
