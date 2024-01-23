import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { Platform } from '@ionic/angular';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { NotificationsService } from './services/notification.service';
import { LoadingService } from './services/loading.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private themeService: ThemeService, private platform: Platform, private pushNotificationsService: NotificationsService, private loadingService: LoadingService) {

    const value = localStorage.getItem('selected-app-theme');
    this.themeService.setAppTheme(value ? value : 'sunny');
    this.initializeApp();
  }

  initializeApp() {
    if (this.platform.is('capacitor')) { 
      StatusBar.setOverlaysWebView({overlay: false});
      StatusBar.setStyle({ style: Style.Dark});
      StatusBar.setBackgroundColor({ color: '#46895c' });
    }
    if (this.platform.is('capacitor')) { this.loadingService.present('Chargement...'); }
    this.pushNotificationsService.initPush();
    this.platform.ready().then(async () => {
      if (this.platform.is('capacitor')) {
        await SplashScreen.hide();
        await SplashScreen.show();
        this.loadingService.dismiss();
      }
      GoogleAuth.initialize();
      FacebookLogin.initialize({
        appId: '771703417822238'
      });
    });
  }
}
