import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { LessonService } from 'src/app/services/lesson.service';
import { register } from 'swiper/element/bundle';
register();
@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.page.html',
  styleUrls: ['./agreement.page.scss'],
})
export class AgreementPage implements OnInit {

  constructor(private router : Router, private authentificationService: AuthentificationService, private lessonService: LessonService) { }

  ngOnInit() {
  }

  saveLesson() {
    if(this.authentificationService.user.uid){
      this.authentificationService.updateLesson(this.authentificationService.user.lesson, 'users', this.authentificationService.user.uid).then(()=>{
        this.router.navigate(['/tabs/lessons']);
      });
    } else {
      console.error('Impossible de sauvegarder sans l\'identifiant de l\'utilisateur');
    }
  }

}
