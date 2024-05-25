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

  constructor(private router: Router, private questionService: QuestionService, private audioService: AudioService, private settingService: SettingService) { }

  ngOnInit() {
    this.questions = Utils.shuffledArray(this.questionService.questions?.questions);
    Utils.preloadAudio(this.audioService);
    this.settingService.getSetting('questions').then();
  }

  displayText(text: string, content: any) {
    if(text.indexOf('$') !== -1) {
      const choice = content.choices.find((c:any)=>c.answer)?.choice;
      return text.replace('$', choice);
    }
    return text;
  }

  continue() {
    const navigationExtras: NavigationExtras = { state: { newReview: true } };
    this.router.navigate(['/questions/mix'], navigationExtras);
  }
}
