import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { Platform } from '@ionic/angular';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { NotificationsService } from './services/notification.service';
import { LoadingService } from './services/loading.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import { NavigationBar} from '@mauricewegner/capacitor-navigation-bar';

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
      NavigationBar.setColor({color: '#74a884', darkButtons: false});
      // NavigationBar.setTransparency({ isTransparent: true });
    }
    this.pushNotificationsService.initPush();
    this.platform.ready().then(async () => {
      GoogleAuth.initialize();
      FacebookLogin.initialize({ appId: '771703417822238' });
    });
  }
}
