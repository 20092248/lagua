import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FirstpageMobileComponent } from './firstpage-mobile.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [FirstpageMobileComponent],  
  exports: [FirstpageMobileComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FirstpageMobileComponentModule {}
