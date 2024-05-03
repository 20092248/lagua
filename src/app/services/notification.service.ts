import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor() { }
  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }
  private registerPush() {
    PushNotifications.requestPermissions().then(permission => {
      if (permission.receive === 'granted') {
        PushNotifications.register();
      }
      else {
        console.warn('If permission is not granted');
      }
    });
    PushNotifications.addListener('registration', (token) => {
      console.log('token', token);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.log('error', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notifications) => {
      console.log('notifications', notifications);
    });

  }
}