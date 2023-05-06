import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/questions.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {

  constructor(private questionService: QuestionService) { }
  get getType(){
    return this.questionService.type;
  }

  ngOnInit() { }
}
