import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { GooglePayEventsEnum, PaymentFlowEventsEnum, PaymentSheetEventsEnum } from '@capacitor-community/stripe';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { first, lastValueFrom, Subscription, switchMap } from 'rxjs';
import { CodeLabel } from 'src/app/model/codeLabel.model';
import { AlertService } from 'src/app/services/alert.service';
import { SettingService } from 'src/app/services/setting.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { StripeFactoryService, StripeInstance } from 'ngx-stripe';
import { Timestamp } from 'firebase/firestore';
declare let Stripe: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  productsSetting: any = {};
  titlePayment: string = '';
  displayPaymentContent: boolean = false;
  urlPayment: SafeResourceUrl = {} as SafeResourceUrl;
  data: any = {};
  stripe!: StripeInstance;

  get user() {
    return this.authentificationService.user;
  }
  get isOverlay() {
    return this.settingService.isOverlay;
  }

  constructor(private router: Router, private authentificationService: AuthentificationService, private settingService: SettingService, private alertService: AlertService, private http: HttpClient, private stripeFactory: StripeFactoryService, private domSanitizer: DomSanitizer) {
    this.data = { name: 'Name', email: 'email@test.com', amount: 1, currency: 'eur' };
  }

  ngOnInit() {
    this.settingService.getSettings().then(setting => {
      this.productsSetting = setting.product;
    });
  }

  goToCheckout() {
    this.router.navigate(['/products/checkout']);
  }

  httpPost(path: string, body: any) {
    return this.http.post<any>(environment.api + path, body).pipe(first());
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

      const data$ = this.httpPost('/payment-sheet', this.data);

      const { paymentIntent, ephemeralKey, customer } = await lastValueFrom(data$);

      console.log('paymentIntent: ', paymentIntent);

      // prepare PaymentSheet with CreatePaymentSheetOption.
      await Stripe.createPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        merchantDisplayName: 'Lagua'
      });

      console.log('createPaymentSheet');
      // present PaymentSheet and get result.
      const result = await Stripe.presentPaymentSheet();
      console.log('result: ', result);
      if (result && result.paymentResult === PaymentSheetEventsEnum.Completed) {
        // Happy path
        this.splitAndJoin(paymentIntent);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async PaymentCreditCard2() {
    try {
      const data$ = this.httpPost('/create-checkout-session', this.data);
      const { id, client_secret, url } = await lastValueFrom(data$);
      this.titlePayment = 'Moyen de paiement';
      // this.urlPayment = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
      this.displayPaymentContent = true;
      const stripe = Stripe(environment.stripe.publishableKey);
      // Initialize Checkout
      const checkout = await stripe.initEmbeddedCheckout({
        clientSecret: client_secret
      });
      // Mount Checkout
      checkout.mount('#checkout');
    } catch (e) {
      console.log(e);
    }
  }

  async PaymentCreditCard3() {
    try {
      this.displayPaymentContent = true;
      const stripe = Stripe(environment.stripe.publishableKey);
      const data$ = this.httpPost('/create-payment-intent', this.data);
      const { client_secret } = await lastValueFrom(data$);
      this.titlePayment = 'Moyen de paiement';
      const options = {
        clientSecret: client_secret
      };
      const elements = stripe.elements(options);
      const paymentElement = elements.create('payment');
      paymentElement.mount('#payment-element');

      const form = document.getElementById('payment-form');

      form?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const { error } = await stripe.confirmPayment({
          //`Elements` instance that was used to create the Payment Element
          elements,
          confirmParams: {},
          redirect: 'if_required'
        });

        if (error) {
          const messageContainer = document.querySelector('#error-message');
          if (messageContainer) {
            messageContainer.textContent = error.message;
            this.alertService.presentToast(error.message, 5000, 'danger');
          }
        } else {
          this.authentificationService.addPremiumAccount().then(() => {
            this.confirmDisplayPaymentContent();
          }, error => { this.alertService.presentToast(error.message, 5000, 'danger') }
          );
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async PaymentPayPal() {
    // Connect to your backend endpoint, and get every key.
    const data$ = this.http.post<any>(environment.api + '/pay', this.data).pipe(first());
    const response = await lastValueFrom(data$);

    console.log(response);
    const url = response?.links.find((link: any) => link.rel === 'approve')?.href;
    this.titlePayment = 'PayPal';
    this.urlPayment = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    this.displayPaymentContent = true;
  }

  async PaymentGooglePay() {
    // Check to be able to use Google Pay on device
    const isAvailable = Stripe.isGooglePayAvailable().catch(() => undefined);
    if (isAvailable === undefined) {
      // disable to use Google Pay
      return;
    }

    Stripe.addListener(GooglePayEventsEnum.Completed, () => {
      console.log('GooglePayEventsEnum.Completed');
    });

    const data$ = this.httpPost('/payment-sheet', this.data);

    const { paymentIntent } = await lastValueFrom(data$);

    // Prepare Google Pay
    await Stripe.createGooglePay({
      paymentIntentClientSecret: paymentIntent,

      // Web only. Google Pay on Android App doesn't need
      paymentSummaryItems: [{
        label: 'Lagua',
        amount: 1.00
      }],
      merchantIdentifier: 'merchant.com.getcapacitor.stripe',
      countryCode: 'IN',
      currency: 'INR',
    });

    // Present Google Pay
    const result = await Stripe.presentGooglePay();
    if (result.paymentResult === GooglePayEventsEnum.Completed) {
      // Happy path
      this.splitAndJoin(paymentIntent);
    }
  }

  confirmDisplayPaymentContent() {
    this.authentificationService.getInfoUser(this.user.uid).then(() => {
      this.displayPaymentContent = false;
      const endDate = this.user.account.endDate;
      if (this.user.account && this.user.account.premium && endDate.toDate() > new Date()) {
        const navigationExtras: NavigationExtras = {
          state: { data: { newAccount: true } }
        };
        this.router.navigate([''], navigationExtras);
      }
    }, () => { this.displayPaymentContent = false; this.alertService.presentToast('Error lors de la récupération du compte premium. Veuillez contacter le support technique.', 5000, 'danger') });
  }

  splitAndJoin(paymentIntent: any) {
    const result = paymentIntent.split('_').slice(0, 2).join('_');
    console.log(result);
    return result;
  }

}
