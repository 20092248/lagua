import { Component, OnInit } from '@angular/core';
import { CodeLabel } from 'src/app/model/codeLabel.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { SettingService } from 'src/app/services/setting.service';

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

  selectedItem(timeSelected: CodeLabel) {
    this.authentificationService.user.time = timeSelected;
  }

}
