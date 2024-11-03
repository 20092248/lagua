import { Component, OnInit } from '@angular/core';
import { CodeLabel } from 'src/app/model/codeLabel.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { SettingService } from 'src/app/services/setting.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-why',
  templateUrl: './why.page.html',
  styleUrls: ['./why.page.scss'],
})
export class WhyPage implements OnInit {

  why: any[] | undefined;

  constructor(private settingService: SettingService, private authentificationService: AuthentificationService) { }

  ngOnInit() {
    this.why = this.settingService.userInformation?.why;
  }

  selectedItem(whySelected: CodeLabel) {
    const dialect = this.authentificationService.dialect;
    this.authentificationService.user.dialects[dialect].why = whySelected;
  }

}
