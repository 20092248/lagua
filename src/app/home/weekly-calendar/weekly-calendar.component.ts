import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-weekly-calendar',
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.scss'],
})
export class WeeklyCalendarComponent implements OnInit {

  currentDate: Date = new Date();

  constructor(private authentificationService: AuthentificationService) { }

  get user() {
    return this.authentificationService.user;
  }

  ngOnInit() {}

  getDailyIcon(infoDay: any) {
    if (infoDay) {
      const todayMinusOneWeek = new Date();
      const utcDay = todayMinusOneWeek.getUTCDay() ? todayMinusOneWeek.getUTCDay() : 7;
      if (utcDay > infoDay.day) {
        todayMinusOneWeek.setDate(todayMinusOneWeek.getDate() - 7);
        if (infoDay.timestamp.toDate().getTime() > todayMinusOneWeek.getTime()) {
          return "checkbox-outline";
        }
      } else if (utcDay == infoDay.day) {
        return "checkbox-outline";
      }
    }
    return "square-outline";
  }

}
