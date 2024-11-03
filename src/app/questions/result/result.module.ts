import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultPageRoutingModule } from './result-routing.module';

import { ResultPage } from './result.page';
import { FireworkComponent } from '../../firework/firework.component';
import { FireworkComponentModule } from 'src/app/firework/firework.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultPageRoutingModule,
    FireworkComponentModule
  ],
  declarations: [ResultPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ResultPageModule {}
