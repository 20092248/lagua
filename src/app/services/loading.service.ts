import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading: HTMLIonLoadingElement = {} as HTMLIonLoadingElement;
  isExist: boolean = false;

  constructor(public loadingController: LoadingController) { }

  async present(message: string) {
    this.loading = await this.loadingController
      .create({
        message: message,
        spinner: 'circles'
      });

    this.loading.present().then(() => {
      this.isExist = true;
    });
  }

  /**
   * Dismiss all the pending loaders, if any
   */
  async dismiss() {
    setTimeout(async () => {
      await this.loadingController.dismiss();
    }, 400);
  }

}