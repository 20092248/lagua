import { Component, OnInit } from '@angular/core';
import { CodeTextTranslate } from 'src/app/model/codeTextTranslate.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.page.html',
  styleUrls: ['./learn.page.scss'],
})
export class LearnPage implements OnInit {

  learn: CodeTextTranslate[] | undefined;

  constructor(private settingService: SettingService, private authentificationService: AuthentificationService) { }

  ngOnInit() {
    this.learn = this.settingService.userInformation?.learn;
  }

  selectedItem(learnSelected: CodeTextTranslate) {
    this.authentificationService.user.learn = learnSelected;
  }

}
