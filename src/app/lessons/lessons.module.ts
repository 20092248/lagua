import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LessonsPage } from './lessons.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { LessonsPageRoutingModule } from './lessons-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    LessonsPageRoutingModule
  ],
  declarations: [LessonsPage]
})
export class LessonsPageModule {}
