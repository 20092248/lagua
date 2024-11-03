import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { MenuComponentModule } from './menu/menu.module';
import { WeeklyCalendarComponentModule } from './weekly-calendar/menu.module';
import { BarStatusComponentModule } from '../bar-status/bar-status.module';
import { LottieModule } from 'ngx-lottie';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MenuComponentModule,
    WeeklyCalendarComponentModule,
    BarStatusComponentModule,
    LottieModule
  ],
  declarations: [HomePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
