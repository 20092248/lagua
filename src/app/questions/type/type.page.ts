import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CodeLabel } from 'src/app/model/codeLabel.model';
import { User } from 'src/app/model/user.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { QuestionService } from 'src/app/services/questions.service';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.page.html',
  styleUrls: ['./type.page.scss'],
})
export class TypePage implements OnInit {

  translate: string = 'francais';
  user: User | undefined;
  types: CodeLabel[] = [];
  constructor(private router: Router, private settingsService: SettingService, private questionService: QuestionService, private authentificationService: AuthentificationService) { }

  ngOnInit() {
    this.user = this.authentificationService.user;
    this.questionService.getQuestions(this.user?.learn?.text.toLocaleLowerCase() + '_' + this.translate + '_questions', this.user?.review ? this.user.review : '1_1').then();
    this.settingsService.getSettings('questions').then((data => {
      this.types = data?.types;
    }));
  }

  typeSelected(code: string) {
    this.questionService.type = code;
    switch (this.questionService.type) {
      case 'Q':
        this.router.navigate(['/questions/qcm']);
        break;
      case 'C':
        this.router.navigate(['/questions/memo']);
        break;
    }
  }

}
