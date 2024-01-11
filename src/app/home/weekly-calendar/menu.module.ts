import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeeklyCalendarComponent } from './weekly-calendar.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [WeeklyCalendarComponent],
  exports: [WeeklyCalendarComponent]
})
export class WeeklyCalendarComponentModule {}
