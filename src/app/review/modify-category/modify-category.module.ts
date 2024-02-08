import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifyCategoryPageRoutingModule } from './modify-category-routing.module';

import { ModifyCategoryPage } from './modify-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifyCategoryPageRoutingModule
  ],
  declarations: [ModifyCategoryPage]
})
export class ModifyCategoryPageModule {}
