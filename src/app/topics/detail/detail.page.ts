import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { SettingService } from 'src/app/services/setting.service';
import { TopicService } from 'src/app/services/topic.service';
import { CONSTANTS } from 'src/app/utils/constants';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  title: string = '';
  topic: any[] = [];
  displayFirstAccordion: string = ''; 
  isCapacitor: boolean = false;

  constructor(private route: ActivatedRoute, private authentificationService: AuthentificationService, private topicService: TopicService, private settingService: SettingService) { }

  get user() {
    return this.authentificationService.user;
  }
  get isOverlay(){
    return this.settingService.isOverlay;
  }  
  
  ngOnInit() {
    this.isCapacitor = this.settingService.isCapacitor;
    const paramTopic = this.route.snapshot.paramMap.get('topic');
    if (paramTopic) {
      this.title = CONSTANTS.topicDocument[paramTopic].value;
      this.topicService.getTopic(CONSTANTS.transcodeCollectionTopics[this.user.dialectSelected.code], CONSTANTS.topicDocument[paramTopic].code).then(data => {
        this.topic = data ? data['topic'] : [];
        this.displayFirstAccordion = this.topic && this.topic.length ? this.topic[0].type : '';
      });
    }
  }

}
