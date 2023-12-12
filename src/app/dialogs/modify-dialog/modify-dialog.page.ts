import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { CHAT } from 'src/app/dialogs/detail/chat';
import { User } from 'src/app/model/user.model';
import { AlertService } from 'src/app/services/alert.service';
import { DialogService } from 'src/app/services/dialog.service';
import { CONSTANTS } from 'src/app/utils/constants';

@Component({
  selector: 'app-modify-dialog',
  templateUrl: './modify-dialog.page.html',
  styleUrls: ['./modify-dialog.page.scss'],
})
export class ModifyDialogPage implements OnInit {

  user: User = {} as User;
  chats: any[] = [];
  chat: any = { userId: '', userName: '', translate: '', text: { shindzuani: '', shingazidja: '', shimwali: '', shimaore: '', } };
  paramModifyReview: string = '';
  constructor(private route: ActivatedRoute, private dialogService: DialogService, private actionSheetCtrl: ActionSheetController, private alertService: AlertService) { }

  ngOnInit() {
    this.paramModifyReview = this.route.snapshot.paramMap.get('id') || '';
    this.dialogService.getChats(CONSTANTS.COLLECTION_DIALOG, this.paramModifyReview).then(dialog => {
      this.chats = dialog.length ? dialog : CHAT;
    });
  }

  addChat(index: number) {
    if (this.chats.length) {
      this.chats.splice(index + 1, 0, this.chats[index]);
    } else {
      this.chats.splice(index + 1, 0, this.chat);
    }
  }

  removeChat(index: number) {
    this.chats.splice(index, 1);
  }

  saveDialogs() {
    this.confirmActionSheet();
  }

  async confirmActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Confirmer la modification ?',
      subHeader: JSON.stringify(this.chats, (key, value) => key === 'userId' || key === 'text' ? undefined : value),
      buttons: [
        {
          text: 'Confirmer',
          role: 'confirm',
          data: {
            action: 'confirm',
          },
        },
        {
          text: 'Annuler',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    if (result.role === 'confirm') {
      this.dialogService.updateChats(CONSTANTS.COLLECTION_DIALOG, this.paramModifyReview, this.chats).then(() => {
        this.alertService.presentToast('La mise à jour a été effectué.', 1000, 'success');
      }, () => this.alertService.presentToast('Erreur lors de la mise à jour du questionnaire.', 1000, 'error'));
    }
  }

}
