import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CodeLabel } from 'src/app/model/codeLabel.model';
import { QuestionService } from 'src/app/services/questions.service';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.page.html',
  styleUrls: ['./type.page.scss'],
})
export class TypePage implements OnInit {

  types: CodeLabel[] = [];
  constructor(private router: Router, private settingsService: SettingService, private questionService: QuestionService) { }

  ngOnInit() {
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
