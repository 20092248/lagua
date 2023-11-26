import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Subscription, finalize, interval, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading: HTMLIonLoadingElement = {} as HTMLIonLoadingElement;
  isExist: boolean = false;
  choice: Subscription | undefined;
  constructor(public loadingController: LoadingController) { }

  async present(message: string) {
    this.loading = await this.loadingController
      .create({
        message: message,
        spinner: 'circles'
      });

    await this.loading.present();
  }

  /**
   * Dismiss all the pending loaders, if any
   */
  async dismiss() {
    await this.loading.dismiss();
  }

}