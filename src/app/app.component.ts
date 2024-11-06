import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { Platform } from '@ionic/angular';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { NotificationsService } from './services/notification.service';
import { LoadingService } from './services/loading.service';
import { SplashScreen } from '@capacitor/splash-screen'
import { Utils } from './utils/utils';
import { SettingService } from './services/setting.service';
import { Location } from '@angular/common';
import { AlertService } from './services/alert.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { App } from '@capacitor/app';
import { environment } from 'src/environments/environment';
import { AdMobService } from './services/admob.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private router: Router, private location: Location, private alertService: AlertService, private themeService: ThemeService, private platform: Platform, private pushNotificationsService: NotificationsService, private adMobService: AdMobService, private settingService: SettingService) {
    const value = localStorage.getItem('selected-app-theme');
    this.themeService.setAppTheme(value ? value : 'sunny');
    this.initializeApp();
  }

  initializeApp() {
    Utils.customCapacitorApp(this.settingService);
    this.pushNotificationsService.initPush();
    this.platform.ready().then(async () => {
      this.adMobService.initializeAdmob();
      this.hideSplashScreen();
      GoogleAuth.initialize();
      FacebookLogin.initialize({ appId: '771703417822238' });
    });
    this.hardwareBackButtonListener();
  }

  hardwareBackButtonListener() {
    if(this.settingService.isCapacitor) {
      // this.addListenerChangeRoute();
      this.platform.backButton.subscribeWithPriority(-1, () => {
        this.location.back();
        this.exitApp();
      });
    }
  }

  addListenerChangeRoute() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      Utils.previousUrl = Utils.currentUrl;
      Utils.currentUrl = event.url.substring(event.url.lastIndexOf("/") + 1);
      console.log(Utils.previousUrl + '-' + Utils.currentUrl);
    });
  }
  
  exitApp() {
    const url = this.router.url.substring(this.router.url.lastIndexOf("/") + 1);
    if (url && (url === 'home' || url === 'firstpage')) {
      App.exitApp();
    }
  }

  async hideSplashScreen() {
    await SplashScreen.hide();
  }
}
