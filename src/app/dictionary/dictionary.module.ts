import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { DictionaryPageRoutingModule } from './dictionary-routing.module';
import { DictionaryPage } from './dictionary.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    DictionaryPageRoutingModule
  ],
  declarations: [DictionaryPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DictionaryPageModule {}
