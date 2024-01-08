import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController, AlertInput, LoadingController, ToastController } from '@ionic/angular';
import { CodeLabel } from '../model/codeLabel.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastController: ToastController, private actionSheetController: ActionSheetController, private alertController: AlertController) { }

  async presentToast(message: string, duration: number, type: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: type
    });
    toast.present();
  }

  async presentToastWithIcon(message: string, duration: number, type: string, icon: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: type,
      icon: icon
    });
    toast.present();
  }

  async presentActionSheetConfirmation(header: string, subHeader: string) {
    const actionSheet = await this.actionSheetController.create({
      header: header,
      subHeader: subHeader,
      buttons: [
        {
          text: 'Oui',
          icon: 'checkmark-outline',
          role: 'selected',
          data: {
            action: 'confirm',
          },
        },
        {
          text: 'Non',
          role: 'cancel',
          icon: 'close-outline',
          data: {
            action: 'cancel',
          },
        },
      ],
    });
    await actionSheet.present();
    return await actionSheet.onDidDismiss();
  }

  async presentAlertWithRadio(header: string, levels: CodeLabel[]) {
    const inputs: AlertInput[] = [];
    levels.forEach(input => {
      inputs.push({ label: input.label, value: input.code, type: 'radio', cssClass: 'ion-alert-radio-element', });
    });
    const alert = await this.alertController.create({
      subHeader: header,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Valider',
          role: 'validate',
          cssClass: 'alert-button-confirm',
        },
      ],
      inputs: inputs,
      cssClass: 'ion-home-alert'
    });

    await alert.present();
    return await alert.onDidDismiss();
  }

}