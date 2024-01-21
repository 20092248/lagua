import { ErrorHandler, Injectable } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { Platform } from '@ionic/angular';

@Injectable()
export class CrashlyticsErrorHandler implements ErrorHandler {

    constructor(private alertService: AlertService, private platform: Platform) { }
    handleError(error: any) {
        try {
            if (this.platform.is('capacitor')) {
                this.alertService.presentToast(error, 8000, 'danger');
            }
        } catch (e) {
            console.error(e);
        }
        throw error;
    }

}
