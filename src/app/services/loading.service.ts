import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading: boolean = false;

  constructor(public loadingController: LoadingController) { }

  // async present(message: string) {
  //   this.isLoading = true;
  //   return await this.loadingController.create({
  //     message: message,
  //   }).then(a => {
  //     a.present().then(() => {
  //       console.log('presented');
  //       if (!this.isLoading) {
  //         a.dismiss().then(() => console.log('abort presenting'));
  //       }
  //     });
  //   });
  // }

  // async dismiss() {
  //   console.log(this.loadingController.getTop());
  //   if(await this.loadingController.getTop()) {
  //   this.isLoading = false;
  //   await this.loadingController.dismiss().then(() => console.log('dismissed'));
  //   }
  // }

  async present(message: string) {
    // Dismiss all pending loaders before creating the new one
    await this.dismiss();

    await this.loadingController
      .create({
            message: message,
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