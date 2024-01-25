import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewPageRoutingModule } from './review-routing.module';

import { ReviewPage } from './review.page';
import { BarStatusComponentModule } from '../bar-status/bar-status.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewPageRoutingModule,
    BarStatusComponentModule
  ],
  declarations: [ReviewPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReviewPageModule {}
