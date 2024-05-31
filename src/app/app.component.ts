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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private themeService: ThemeService, private platform: Platform, private pushNotificationsService: NotificationsService, private loadingService: LoadingService, private settingService: SettingService) {
    const value = localStorage.getItem('selected-app-theme');
    this.themeService.setAppTheme(value ? value : 'sunny');
    this.initializeApp();
  }
  
  initializeApp() {
    Utils.customCapacitorApp(this.settingService);
    this.pushNotificationsService.initPush();
    this.platform.ready().then(async () => {
      this.hideSplashScreen();
      GoogleAuth.initialize();
      FacebookLogin.initialize({ appId: '771703417822238' });
    });
  }
  
  async hideSplashScreen() {
    await SplashScreen.hide();
  }
}
