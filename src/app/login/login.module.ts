import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogInPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { BarStatusComponentModule } from '../bar-status/bar-status.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogInPageRoutingModule
  ],
  declarations: [LoginPage]
})
export class LoginInPageModule {}
