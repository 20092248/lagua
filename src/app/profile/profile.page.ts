import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Share } from '@capacitor/share';
import { AuthentificationService } from '../services/authentification.service';
import { SettingService } from '../services/setting.service';
import { Utils } from '../utils/utils';
import { CONSTANTS } from '../utils/constants';
import { AlertService } from '../services/alert.service';
declare let Donation: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  currentDate: Date = new Date();
  nbrWordsToRevise: number = 0;
  nbrWordsToLearn: number = 0;
  nbrWordsLearned: number = 0;
  percentWordsToRevise: number = 0;
  percentWordsToLearn: number = 0;
  percentWordsLearned: number = 0;
  nbrWords: number = 0;
  activeConnection: Date = new Date(0);
  score: number = 0;
  profileSetting: any = {};
  initial: string = '';

  constructor(private router: Router, private authentificationService: AuthentificationService, private settingService: SettingService, private alertService: AlertService) { }

  get user() {
    return this.authentificationService.user;
  }
  get dialect() {
    return this.authentificationService.dialect;
  }
  get userDialect() {
    return this.user.dialects[this.dialect];
  }

  get isOverlay() {
    return this.settingService.isOverlay;
  }

  ngOnInit() {
    console.log(Donation);
    Donation.Button({
      env: 'production',
      hosted_button_id: 'RLY74AVE59HPS',
      image: {
        src: 'https://www.paypalobjects.com/fr_FR/FR/i/btn/btn_donateCC_LG.gif',
        alt: 'Bouton Faites un don avec PayPal',
        title: 'PayPal - The safer, easier way to pay online!',
      }
    }).render('#paypal-donate-button-container');
    Utils.customCapacitorTabs(this.settingService);
    this.profileSetting = this.settingService.profile;
    if (JSON.stringify(this.profileSetting) === '{}') {
      this.settingService.getSettings().then(setting => {
        this.profileSetting = setting.profile;
      });
    }
    this.initial = !this.user.photoURL && this.user.displayName ? Utils.getInitial(this.user.displayName) : '';
    this.userDialect.resultReviews?.forEach(review => {
      this.nbrWordsToRevise += review.toRevise.length;
      this.nbrWordsToLearn += review.toLearn.length;
      this.nbrWordsLearned += review.learned.length;
      this.nbrWords += review.toRevise.length + review.toLearn.length + review.learned.length;
      this.score += (this.nbrWordsToLearn * 50) + (this.nbrWordsLearned * 100);
    });
    this.score += this.userDialect.resultLessons.length * 100;
    this.percentWordsToRevise = this.nbrWordsToRevise * 100 / this.nbrWords;
    this.percentWordsToLearn = this.nbrWordsToLearn * 100 / this.nbrWords;
    this.percentWordsLearned = this.nbrWordsLearned * 100 / this.nbrWords;
    if (this.user.timerActiveConnection) {
      this.activeConnection = new Date(this.user.timerActiveConnection);
    }
  }

  getActualLevelByCode() {
    const code = this.userDialect?.level?.code;
    if (code === '0') {
      return 'Découverte';
    } else if (code === '1') {
      return 'Débutant';
    } else if (code === '2') {
      return 'Intermédiaire';
    } else if (code === '3') {
      return 'Intermédiaire avancé';
    } else if (code === '4') {
      return 'Avancé';
    } else {
      return '';
    }
  }

  displayUnknownUser() {
    this.user.photoURL = this.settingService.profile.icon?.unknownUserSrc;
  }

  getDay(value: Date) {
    return Math.trunc(value.getTime() / 1000 / 60 / 60 / 24);
  }

  donate() {
    const donate = document.getElementById('donate-button');
    console.log(donate);
  }

  async share() {
    await Share.share({
      title: CONSTANTS.SHARE_MSG_TITLE,
      text: CONSTANTS.SHARE_MSG_OBJECT,
      url: 'https://lagua-shikomori.firebaseapp.com',
      dialogTitle: 'Partager via...',
    });
  }

  logout() {
    this.authentificationService.logout(true).then(() => {
      this.router.navigate(['/firstpage']);
    });
  }

  deleteAccount() {
    this.alertService.presentActionSheetConfirmation('Confirmation', CONSTANTS.CONFIRM_DELETE_ACCOUNT_ACTION_SHEET, 'action-sheet-danger').then(result => {
      console.log(result);
    });
  }

}
