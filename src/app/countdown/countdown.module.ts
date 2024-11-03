import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CountdownComponent } from './countdown.component';
import { LottieModule } from 'ngx-lottie';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, LottieModule],
  declarations: [CountdownComponent],
  exports: [CountdownComponent]
})
export class CountdownComponentModule {}
