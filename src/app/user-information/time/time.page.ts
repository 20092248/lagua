import { Component, OnInit } from '@angular/core';
import { CodeLabel } from 'src/app/model/codeLabel.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { SettingService } from 'src/app/services/setting.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-from',
  templateUrl: './time.page.html',
  styleUrls: ['./time.page.scss'],
})
export class TimePage implements OnInit {

  time: any[] | undefined;

  constructor(private settingService: SettingService, private authentificationService: AuthentificationService) { }

  ngOnInit() {
    this.time = this.settingService.userInformation?.time;
  }

  selectedItem(timeSelected: CodeLabel) {
    const dialect = this.authentificationService.dialect;
    this.authentificationService.user.dialects[dialect].time = timeSelected;
  }

}
