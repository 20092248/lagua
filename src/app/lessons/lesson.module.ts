import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LessonPage } from './lesson.page';

import { LessonsPageRoutingModule } from './lesson-routing.module';
import { BarStatusComponentModule } from '../bar-status/bar-status.module';
import { LottieModule } from 'ngx-lottie';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LessonsPageRoutingModule,
    BarStatusComponentModule,
    LottieModule
  ],
  declarations: [LessonPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LessonsPageModule {}
