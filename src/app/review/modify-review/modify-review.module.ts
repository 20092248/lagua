import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifyReviewPageRoutingModule } from './modify-review-routing.module';

import { ModifyReviewPage } from './modify-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifyReviewPageRoutingModule
  ],
  declarations: [ModifyReviewPage]
})
export class ModifyReviewPageModule {}
