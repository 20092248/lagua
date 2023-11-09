import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(public loadingController: LoadingController) { }

  async present(message: string) {
    // Dismiss all pending loaders before creating the new one
    await this.dismiss();

    await this.loadingController
      .create({
            message: message,
            spinner: 'circles'
          })
      .then(res => {
        res.present();
      });
  }

  /**
   * Dismiss all the pending loaders, if any
   */
  async dismiss() {
    while (await this.loadingController.getTop() !== undefined) {
      await this.loadingController.dismiss();
    }
  }
  
}