import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastController: ToastController) { }
  
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
}