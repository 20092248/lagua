import { Injectable } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";
import { Platform } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {

  constructor(private router: Router, private platform: Platform) {
    FirebaseAnalytics.initializeFirebase(environment.firebase);
    if(this.platform.is('capacitor')){
      this.router.events.pipe(
        filter((e: any) => e instanceof NavigationEnd)
      ).subscribe((e: RouterEvent) => {
        console.log('route changed: ', e.url);
        this.setScreenName(e.url, 'screen : ' + e.url);
      });
    }
  }

  setUserId(userId: string) {
    FirebaseAnalytics.setUserId({
      userId: userId,
    });
  }

  setUserProperty(name: string, value: string) {
    FirebaseAnalytics.setUserProperty({
      name: name,
      value: value,
    });
  }

  getAppInstanceId() {
    FirebaseAnalytics.getAppInstanceId();
  }

  setScreenName(screenName: string, nameOverride: string) {
    FirebaseAnalytics.setScreenName({
      screenName: screenName,
      nameOverride: nameOverride,
    });
  }

  reset() {
    FirebaseAnalytics.reset();
  }

  logEvent(name: string, param: any) {
    FirebaseAnalytics.logEvent({
      name: name,
      params: {
        content_type: "image",
        content_id: "P12453",
        items: [{ name: "Kittens" }],
      },
    });
  }

  setCollectionEnabled(enabled: boolean) {
    FirebaseAnalytics.setCollectionEnabled({
      enabled: enabled,
    });
  }

  setSessionTimeoutDuration(duration: number) {
    FirebaseAnalytics.setSessionTimeoutDuration({
      duration: duration,
    });
  }

}
