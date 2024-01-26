import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TopicsPageRoutingModule } from './topics-routing.module';

import { TopicsPage } from './topics.page';
import { BarStatusComponentModule } from '../bar-status/bar-status.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TopicsPageRoutingModule,
    BarStatusComponentModule
  ],
  declarations: [TopicsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TopicsPageModule {}
