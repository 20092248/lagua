import { Component, OnInit } from '@angular/core';
import { DialogService } from '../services/dialog.service';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { Utils } from '../utils/utils';
import { User } from '../model/user.model';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.page.html',
  styleUrls: ['./dialogs.page.scss'],
})
export class DialogsPage implements OnInit {

  dialogs: any[] = [];
  displayFirstAccordion: string = '';
  user: User = {} as User;
  category: string = '';
  segments: any[] = [{ code: 'A1_A2', label: 'Débutant' }, { code: 'B1_B2', label: 'Intermédiaire' }];

  constructor(private router: Router, private authentificationService: AuthentificationService, private dialogService: DialogService, private loadingService: LoadingService) { }

  ngOnInit() {
    this.user = this.authentificationService.user;
    this.category = Utils.getCategoryExtended(this.authentificationService.user.review.category);
    this.dialogService.getDialogs(this.category).then(dialogs => {
      this.dialogs = dialogs;
      this.displayFirstAccordion = this.dialogs && this.dialogs.length ? this.dialogs[0].type : '';
    });
  }

  goToDetail(dialogCode: any) {
    this.router.navigate(['/tabs/dialogs/' + dialogCode.code]);
  }

  changeCategoryDialog(code: string) {
    if(this.category !== code){
      this.category = code;
      this.loadingService.present('Chargement...');
      this.dialogService.getDialogs(code).then(dialogs => {
        this.loadingService.dismiss();
        this.dialogs = dialogs;
        this.displayFirstAccordion = this.dialogs && this.dialogs.length ? this.dialogs[0].type : '';
      });
    }
  }

}
