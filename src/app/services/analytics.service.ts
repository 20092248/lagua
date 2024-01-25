import { Injectable } from '@angular/core';
import { Analytics, EventParams, getAnalytics, logEvent, setUserId, setUserProperties } from '@angular/fire/analytics';
import { Auth } from '@angular/fire/auth';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Platform } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {

  constructor(private router: Router, private platform: Platform) { 
    
  }

  setUserId(userId: string) {
    setUserId(getAnalytics(), userId);
  }

  setUserProperties(name: string) {
    setUserProperties(getAnalytics(), {
      dialect_selected: name
    });
  }

  logEvent(name: string, param: EventParams) {
    logEvent(getAnalytics(), 
      name, {
      params: param,
  });
  }

}
