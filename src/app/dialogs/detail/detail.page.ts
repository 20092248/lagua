import { Component, OnInit } from '@angular/core';
import { CHAT } from 'src/app/dialogs/detail/chat';
import { User } from 'src/app/model/user.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { DialogService } from 'src/app/services/dialog.service';
import { CONSTANTS } from 'src/app/utils/constants';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  user: User = {} as User;
  chats: any[] = [];
  chat: any = { date: '', userId: '', userName: '', senderId: '', senderName: '', translate: '', text: { shindzuani: '', shingazidja: '', shimwali: '', shimaore: '', } };
  paramModifyReview: string = '';

  constructor(private dialogService: DialogService, private authentificationService: AuthentificationService) { }

  ngOnInit() {
    this.chats = CHAT;
    this.user = this.authentificationService.user;
  }

  getInitial(name: string) {
    return Utils.getInitial(name);
  }

  getDialectText(text: any) {
    return text[CONSTANTS.transcodeDialect[this.user.learn.code]];
  }

}
