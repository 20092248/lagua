import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { AuthentificationService } from '../services/authentification.service';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: User | undefined;
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
  numbers: number[] = Array(10).fill(undefined, 0, 5).map((x,i)=>i);

  constructor(private router: Router, private authentificationService: AuthentificationService, private settingService: SettingService) { }

  ngOnInit() {
    this.profileSetting = this.settingService.profile;
    if(!this.profileSetting){
      this.settingService.getSettings().then(setting => {
        this.profileSetting = setting.profile;
      });
    }
    this.user = this.authentificationService.user;
    this.user.resultReviews?.forEach(review => {
      this.nbrWordsToRevise += review.toRevise.length;
      this.nbrWordsToLearn += review.toLearn.length;
      this.nbrWordsLearned += review.learned.length;
      this.nbrWords += review.toRevise.length + review.toLearn.length + review.learned.length;
      this.score += (this.nbrWordsToLearn * 50) + (this.nbrWordsLearned * 100);
    });
    this.score += this.user.resultLessons.length * 100;
    this.percentWordsToRevise = this.nbrWordsToRevise * 100 / this.nbrWords;
    this.percentWordsToLearn = this.nbrWordsToLearn * 100 / this.nbrWords;
    this.percentWordsLearned = this.nbrWordsLearned * 100 / this.nbrWords;
    if (this.user.timerActiveConnection) {
      this.activeConnection = new Date(this.user.timerActiveConnection);
    }
  }

  getActualLevelByCode() {
    const code = this.user?.level?.code;
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

  getDay(value: Date) {
    return Math.trunc(value.getTime() / 1000 / 60 / 60 / 24);
  }

  logout() {
    this.authentificationService.logout().then(() => {
      this.router.navigate(['/firstpage']);
    });
  }

}
