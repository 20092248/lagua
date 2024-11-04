import { ErrorHandler, Injectable } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { AnalyticsService } from '../services/analytics.service';
import { AuthentificationService } from '../services/authentification.service';
import { SettingService } from '../services/setting.service';

@Injectable()
export class CrashlyticsErrorHandler implements ErrorHandler {

    constructor(private authentificationService: AuthentificationService, private alertService: AlertService, private settingService: SettingService, private analyticsService: AnalyticsService) { }
    handleError(error: any) {
        try {
            if (this.settingService.isCapacitor && this.displayError(error)) {
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
