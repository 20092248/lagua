import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FirstpageDesktopComponent } from './firstpage-desktop.component';
import { FirstpageMobileComponentModule } from '../firstpage-mobile/firstpage-mobile.module';


@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, FirstpageMobileComponentModule],
  declarations: [FirstpageDesktopComponent],
  exports: [FirstpageDesktopComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FirstpageDesktopComponentModule {}
