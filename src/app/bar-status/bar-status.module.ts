import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { BarStatusComponent } from './bar-status.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [BarStatusComponent],
  exports: [BarStatusComponent]
})
export class BarStatusComponentModule {}
