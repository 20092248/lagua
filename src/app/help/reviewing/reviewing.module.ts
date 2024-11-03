import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewingPageRoutingModule } from './reviewing-routing.module';

import { ReviewingPage } from './reviewing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewingPageRoutingModule
  ],
  declarations: [ReviewingPage]
})
export class ReviewingPageModule {}
