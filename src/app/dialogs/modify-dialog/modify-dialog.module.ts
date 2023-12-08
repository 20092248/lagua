import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifyDialogPageRoutingModule } from './modify-dialog-routing.module';

import { ModifyDialogPage } from './modify-dialog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifyDialogPageRoutingModule
  ],
  declarations: [ModifyDialogPage]
})
export class ModifyDialogPageModule {}
