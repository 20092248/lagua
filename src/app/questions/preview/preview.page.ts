import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
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

  constructor(private router: Router, private questionService: QuestionService, private audioService: AudioService, private settingService: SettingService) { }

  get questions() {
    return this.questionService.questions?.questions;
  }

  ngOnInit() {
    Utils.preloadAudio(this.audioService);
    this.settingService.getSetting('questions').then();
  }

  

  continue() {
    const navigationExtras: NavigationExtras = { state: { newReview: true } };
    this.router.navigate(['/questions/mix'], navigationExtras);
  }
}
