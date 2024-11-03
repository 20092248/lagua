import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Question } from 'src/app/model/question.model';
import { AudioService } from 'src/app/services/audio.service';
import { QuestionService } from 'src/app/services/question.service';
import { SettingService } from 'src/app/services/setting.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
})
export class PreviewPage implements OnInit {

  questions: any[] = [];
  helps: any[] = [];

  constructor(private router: Router, private questionService: QuestionService, private audioService: AudioService, private settingService: SettingService) { }

  ngOnInit() {
    this.questionService.type = 'R';
    this.questions = Utils.displayText(this.questionService.questions?.questions);
    this.questions = Utils.shuffledArray(this.questions);
    this.helps = this.questionService.questions?.helps;
    Utils.preloadAudio(this.audioService);
    this.settingService.getSetting('questions').then();
  }

  continue() {
    this.questionService.type = 'R';
    const navigationExtras: NavigationExtras = { state: { newReview: true } };
    this.router.navigate(['/questions/mix'], navigationExtras);
  }
}
