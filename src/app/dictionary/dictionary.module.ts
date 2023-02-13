import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
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
  declarations: [DictionaryPage]
})
export class DictionaryPageModule {}
