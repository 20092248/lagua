import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FireworkComponent } from './firework.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [FireworkComponent],
  exports: [FireworkComponent]
})
export class FireworkComponentModule {}
