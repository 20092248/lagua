import { Component, OnInit } from '@angular/core';
import { CodeTextTranslate } from 'src/app/model/codeTextTranslate.model';
import { Dialect } from 'src/app/model/dialect.model';
import { Dialects } from 'src/app/model/dialects.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { SettingService } from 'src/app/services/setting.service';
import { CONSTANTS } from 'src/app/utils/constants';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.page.html',
  styleUrls: ['./learn.page.scss'],
})
export class LearnPage implements OnInit {

  learn: CodeTextTranslate[] = [];
  frenchFlag: CodeTextTranslate = {} as CodeTextTranslate;

  constructor(private settingService: SettingService, private authentificationService: AuthentificationService) { }

  ngOnInit() {
    this.learn = this.settingService.userInformation?.learn.filter((f: CodeTextTranslate) => f.code !== CONSTANTS.FRENCH_DIALECT);
    this.frenchFlag = this.settingService.userInformation.learn.find((f: CodeTextTranslate) => f.code === CONSTANTS.FRENCH_DIALECT);
  }

  selectedItem(learnSelected: CodeTextTranslate) {
    this.authentificationService.dialect = Utils.findDialect(learnSelected.code);
    this.authentificationService.user.dialectSelected = learnSelected;
    if(!this.authentificationService.user.dialects){
      this.authentificationService.user.dialects = {} as Dialects;
      this.authentificationService.user.dialects[this.authentificationService.dialect] = {} as Dialect;
    }
    this.authentificationService.user.dialects[this.authentificationService.dialect].learn = learnSelected;
  }

}
