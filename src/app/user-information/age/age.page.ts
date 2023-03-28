import { Component, OnInit } from '@angular/core';
import { CodeLabel } from 'src/app/model/codeLabel.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-age',
  templateUrl: './age.page.html',
  styleUrls: ['./age.page.scss'],
})
export class AgePage implements OnInit {

  age: any[] | undefined;

  constructor(private settingService: SettingService, private authentificationService: AuthentificationService) { }

  ngOnInit() {
    this.age = this.settingService.userInformation?.age;
  }

  selectedItem(ageSelected: CodeLabel) {
    this.authentificationService.user.age = ageSelected;
  }

}
