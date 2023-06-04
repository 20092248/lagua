import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LessonPage } from './lesson.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { LessonsPageRoutingModule } from './lesson-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    LessonsPageRoutingModule
  ],
  declarations: [LessonPage]
})
export class LessonsPageModule {}
