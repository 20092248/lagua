import { Component, OnInit } from '@angular/core';
import { DialogService } from '../services/dialog.service';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { CONSTANTS } from '../utils/constants';
import { Utils } from '../utils/utils';

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.page.html',
  styleUrls: ['./dialogs.page.scss'],
})
export class DialogsPage implements OnInit {

  dialogs: any[] = [];
  displayFirstAccordion: string = '';

  constructor(private router: Router, private authentificationService: AuthentificationService, private dialogService: DialogService) { }

  ngOnInit() {
    const category = Utils.getCategoryExtended(this.authentificationService.user.review.category);
      this.dialogService.getDialogs(category).then(dialogs => {
        this.dialogs = dialogs;
        this.displayFirstAccordion = this.dialogs && this.dialogs.length ? this.dialogs[0].type : '';
      })
  }

  goToDetail(dialogCode: any) {
    this.router.navigate(['/tabs/dialogs/' + dialogCode.code]);
  }

}
