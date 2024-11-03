import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CHAT } from 'src/app/dialogs/detail/chat';
import { User } from 'src/app/model/user.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { DialogService } from 'src/app/services/dialog.service';
import { SettingService } from 'src/app/services/setting.service';
import { CONSTANTS } from 'src/app/utils/constants';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  user: User = {} as User;
  infoChats: any = {};
  chat: any = { date: '', userId: '', userName: '', senderId: '', senderName: '', translate: '', text: { shindzuani: '', shingazidja: '', shimwali: '', shimaore: '', } };
  paramModifyReview: string = '';
  isOverlay: boolean | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private dialogService: DialogService, private authentificationService: AuthentificationService, private settingService: SettingService) { }

  ngOnInit() { 
    this.isOverlay = this.settingService.isOverlay;
  }

   ionViewWillEnter() {
    this.initialize();
  }

  initialize() {
    this.paramModifyReview = this.route.snapshot.paramMap.get('dialog') || '';
    this.dialogService.getChats(CONSTANTS.COLLECTION_DIALOG, this.paramModifyReview).then(dialog => {
      this.infoChats = JSON.stringify(dialog) !== '{}' ? dialog : CHAT;
    });
    this.user = this.authentificationService.user;
  }

  modifyDetail() {
    this.router.navigate(['/tabs/dialogs/modify-dialog/' + this.paramModifyReview]);
  }

  getInitial(name: string) {
    return Utils.getInitial(name);
  }

  getDialectText(text: any) {
    return text[CONSTANTS.transcodeDialect[this.user.dialectSelected.code]];
  }

}
