import { Component, OnInit } from '@angular/core';
import { CodeLabel } from 'src/app/model/codeLabel.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { SettingService } from 'src/app/services/setting.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-level',
  templateUrl: './level.page.html',
  styleUrls: ['./level.page.scss'],
})
export class LevelPage implements OnInit {

  level: any[] | undefined;

  constructor(private settingService: SettingService, private authentificationService: AuthentificationService) { }

  ngOnInit() {
    this.level = this.settingService.userInformation?.level;
  }

  selectedItem(levelSelected: CodeLabel) {
    const levelSelectedMin = Utils.convertToCodeLabelMin(levelSelected);
    const dialect = this.authentificationService.dialect;
    this.authentificationService.user.dialects[dialect].level = levelSelectedMin;
  }

}
