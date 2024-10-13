import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { AudioService } from 'src/app/services/audio.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.page.html',
  styleUrls: ['./confirm-payment.page.scss'],
})
export class ConfirmPaymentPage implements OnInit {

  animation: AnimationItem = {} as AnimationItem;
  options: AnimationOptions = { path: 'assets/img/confirm_payment.json', loop: false, name: 'confirm_payment' };
  styles: Partial<CSSStyleDeclaration> = { margin: 'auto', width: '55%' };

  constructor(private router: Router, private audioService: AudioService) { }

  ngOnInit() {
    
    Utils.preloadAudio(this.audioService);
  }

  animationCreated(animation: any) {
    this.animation = animation as AnimationItem;
    this.animation.playSpeed = 0.35;
  }

  complete(event: any) {
    console.log('hide comoros flag');
    this.animation.destroy('comoros flag');
  }

  goToHome() {
    const navigationExtras: NavigationExtras = {
      state: { data: { newAccount: true } }
    };
    this.router.navigate([''], navigationExtras);
  }

}
