import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GooglePayEventsEnum, PaymentFlowEventsEnum, PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { first, lastValueFrom } from 'rxjs';
import { CodeLabel } from 'src/app/model/codeLabel.model';
import { AlertService } from 'src/app/services/alert.service';
import { SettingService } from 'src/app/services/setting.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  isOverlay: boolean | undefined;
  animation: AnimationItem = {} as AnimationItem;
  productsSetting: any = {};
  options: AnimationOptions = { path: 'assets/img/comoros_flag.json', loop: true, name: 'comoros_flag' };
  styles: Partial<CSSStyleDeclaration> = { margin: 'auto', width: '35%', maxWidth: '300px' };
  displayPayPalContent: boolean = false;
  urlPayPal: SafeResourceUrl = {} as SafeResourceUrl;
  data: any = {};

  constructor(private router: Router, private settingService: SettingService, private alertService: AlertService, private http: HttpClient, private domSanitizer: DomSanitizer) {
    this.data = { name: 'Name', email: 'email@test.com', amount: 1, currency: 'eur' };
  }

  ngOnInit() {
    this.isOverlay = this.settingService.isOverlay;
    this.settingService.getSettings().then(setting => {
      this.productsSetting = setting.product;
    });
  }

  animationCreated(animation: any) {
    this.animation = animation as AnimationItem;
  }

  complete(event: any) {
    console.log('hide countdown');
    this.animation.destroy('countdown');
  }

  goToCheckout() {
    this.router.navigate(['/products/checkout']);
  }

  async showPayment() {
    const choices: CodeLabel[] = [{ code: 'ALL', label: 'Ponctuel (en 1 seul fois)', src: '' }, { code: 'MENSUEL', label: 'Mensuel', src: '' }];
    this.alertService.presentAlertWithRadio('Sélectionner la période de paiement', choices).then(alertResult => {
      if (alertResult.role === 'validate' && alertResult.data.values) {
        this.goToCheckout();
      } else if (!alertResult.data.values) {
        this.alertService.presentToast('Veuillez sélectionner un choix', 3000, 'lagua');
      }
    });
  }

  async PaymentCreditCard() {
    try {
      // be able to get event of PaymentSheet
      Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
        console.log('PaymentSheetEventsEnum.Completed');
      });

      // Connect to your backend endpoint, and get every key.
      const data$ = this.http.post<{
        paymentIntent: string;
        ephemeralKey: string;
        customer: string;
      }>(environment.api + 'payment-sheet', this.data).pipe(first());

      const { paymentIntent, ephemeralKey, customer } = await lastValueFrom(data$);

      // prepare PaymentSheet with CreatePaymentSheetOption.
      await Stripe.createPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        merchantDisplayName: 'Lagua'
      });


      // present PaymentSheet and get result.
      const result = await Stripe.presentPaymentSheet();
      if (result.paymentResult === PaymentSheetEventsEnum.Completed) {
        // Happy path
        // document.querySelectorAll('#stripe-card-element').forEach((doc) => {
        //   if(doc.querySelectorAll('.stripe-heading')[0]) {
        //     doc.querySelectorAll('.stripe-heading')[0].innerHTML = 'Ajouter vos informations bancaires';
        //     doc.querySelectorAll('.stripe-section-title')[0].innerHTML = 'Informations bancaires';
        //   }
        //   if(doc.querySelectorAll('.stripe-section-title')[1]) {
        //     doc.querySelectorAll('.stripe-section-title')[1].innerHTML = 'Code Postal';
        //   }
        // });
      }
    } catch (e) {
      if (e) { console.log(e); }
    }
  }

  async PaymentCreditCard2() {
    try {
      // be able to get event of PaymentFlow
      Stripe.addListener(PaymentFlowEventsEnum.Completed, () => {
        console.log('PaymentFlowEventsEnum.Completed');
      });

      // Connect to your backend endpoint, and get every key.
      const data$ = this.http.post<{
        paymentIntent: string;
        ephemeralKey: string;
        customer: string;
      }>(environment.api + 'payment-sheet', {}).pipe(first());

      const { paymentIntent, ephemeralKey, customer } = await lastValueFrom(data$);

      // Prepare PaymentFlow with CreatePaymentFlowOption.
      Stripe.createPaymentFlow({
        paymentIntentClientSecret: paymentIntent,
        // setupIntentClientSecret: setupIntent,
        customerEphemeralKeySecret: ephemeralKey,
        customerId: customer,
      });

      // Present PaymentFlow. **Not completed yet.**
      const presentResult = await Stripe.presentPaymentFlow();
      console.log(presentResult); // { cardNumber: "●●●● ●●●● ●●●● ****" }

      // Confirm PaymentFlow. Completed.
      const confirmResult = await Stripe.confirmPaymentFlow();
      if (confirmResult.paymentResult === PaymentFlowEventsEnum.Completed) {
        // Happy path
      }
    } catch (e) {
      console.log(e);
    }
  }

  async PaymentPayPal() {
    // Connect to your backend endpoint, and get every key.
    const data$ = this.http.post<any>(environment.api + 'pay', this.data).pipe(first());
    const response = await lastValueFrom(data$);

    console.log(response);
    const url = response?.links.find((link: any) => link.rel === 'approve')?.href;
    this.urlPayPal = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    this.displayPayPalContent = true;
  }

  async PaymentGooglePay() {
    try {
      // Check to be able to use Google Pay on device
      const isAvailable = Stripe.isGooglePayAvailable().catch(() => undefined);
      if (isAvailable === undefined) {
        // disable to use Google Pay
        return;
      }

      Stripe.addListener(GooglePayEventsEnum.Completed, () => {
        console.log('GooglePayEventsEnum.Completed');
      });

      // Connect to your backend endpoint, and get paymentIntent.
      const data$ = this.http.post<{
        paymentIntent: string;
      }>(environment.api + 'payment-sheet', this.data).pipe(first());

      const { paymentIntent } = await lastValueFrom(data$);

      // Prepare Google Pay
      await Stripe.createGooglePay({
        paymentIntentClientSecret: paymentIntent,

        // Web only. Google Pay on Android App doesn't need
        paymentSummaryItems: [{
          label: 'Lagua',
          amount: 1099.00
        }],
        merchantIdentifier: 'lagua',
        countryCode: 'FR',
        currency: 'eur',
      });

      // Present Google Pay
      const result = await Stripe.presentGooglePay();
      if (result.paymentResult === GooglePayEventsEnum.Completed) {
        // Happy path
      }
    } catch (e) {
      console.log(e);
    }
  }

}
