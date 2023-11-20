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

    this.loading.present().then(() => {
      this.isExist = true;
    });
  }

  /**
   * Dismiss all the pending loaders, if any
   */
  async dismiss() {
    const customInterval = interval(200).pipe(
      take(10), //take only the first 10 values interval 200ms (10 secondes)
      finalize(async() => this.dismissIfLoadingPresent()) // Execute when the observable completes or unsubscribe
    );
    this.choice = customInterval.subscribe(async () => this.dismissIfLoadingPresent());
  }

  async dismissIfLoadingPresent() {
    if (JSON.stringify(this.loading) !== '{}') {
      await this.loading.dismiss();
      this.stopTimer();
    }
  }

  stopTimer() {
    this.choice?.unsubscribe();
    this.choice = undefined; // Clear the timeoutId
  }

}