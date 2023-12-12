import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountmanagementPageRoutingModule } from './accountmanagement-routing.module';

import { AccountmanagementPage } from './accountmanagement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountmanagementPageRoutingModule
  ],
  declarations: [AccountmanagementPage]
})
export class AccountmanagementPageModule {}
