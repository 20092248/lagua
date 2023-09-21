import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private route: ActivatedRoute, private topicService: TopicService) { }

  ngOnInit() {
    const paramTopic = this.route.snapshot.paramMap.get('topic');
    if (paramTopic) {
      this.title = CONSTANTS.topicDocument[paramTopic].value;
      this.topicService.getTopic(CONSTANTS.topicDocument[paramTopic].code).then(data => {
        this.topic = data ? data['topic'] : [];
        this.displayFirstAccordion = this.topic && this.topic.length ? this.topic[0].type : '';
      });
    }
  }

}
