import { ErrorHandler, Injectable } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { Platform } from '@ionic/angular';
import { AnalyticsService } from '../services/analytics.service';
import { AuthentificationService } from '../services/authentification.service';

@Injectable()
export class CrashlyticsErrorHandler implements ErrorHandler {

    constructor(private authentificationService: AuthentificationService, private alertService: AlertService, private platform: Platform, private analyticsService: AnalyticsService) { }
    handleError(error: any) {
        try {
            if (this.platform.is('capacitor') && this.displayError(error)) {
                this.alertService.presentToast(error, 3000, 'danger');
            }
            this.analyticsService.logEvent('error', {transaction_id: this.authentificationService.user?.uid, event_label: error.message}) //method
        } catch (e) {
            console.error(e);
        }
        throw error;
    }

    displayError(error: any){
        return error && error.message && error.message.indexOf('this.loading.dismiss') === -1;
    }

}
