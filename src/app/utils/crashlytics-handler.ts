import { ErrorHandler, Injectable } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { Platform } from '@ionic/angular';
import { FirebaseCrashlyticsOriginal } from '@awesome-cordova-plugins/firebase-crashlytics';

@Injectable()
export class CrashlyticsErrorHandler implements ErrorHandler {

    constructor(private alertService: AlertService, private platform: Platform, private firebaseCrashlyticsOriginal: FirebaseCrashlyticsOriginal) { }
    handleError(error: any) {
        try {
            if (this.platform.is('capacitor')) {
                this.alertService.presentToast(error, 8000, 'danger');
                this.firebaseCrashlyticsOriginal.crash();
            }
        } catch (e) {
            console.error(e);
        }
        throw error;
    }

}
