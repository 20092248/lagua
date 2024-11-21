import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/model/lesson.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { SettingService } from 'src/app/services/setting.service';
import { register } from 'swiper/element/bundle';
register();
@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.page.html',
  styleUrls: ['./agreement.page.scss'],
})
export class AgreementPage implements OnInit {

  agreementLesson: Lesson = {} as Lesson;
  isOverlay: boolean | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private authentificationService: AuthentificationService, private settingService: SettingService) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation()?.extras?.state) {
        this.agreementLesson = this.router.getCurrentNavigation()?.extras?.state?.['data'] as Lesson;
      }
    });
  }

  ngOnInit() {
    this.isOverlay = this.settingService.isOverlay;
  }

  saveLesson() {
    if (this.authentificationService.user.uid && this.agreementLesson) {
      this.authentificationService.updateLesson(this.agreementLesson, 'users', this.authentificationService.user.uid).then(() => {
        this.router.navigate(['/tabs/lessons']);
      });
    } else {
      console.error('Erreur lors de la sauvegarde de la leçon');
    }
  }

}
