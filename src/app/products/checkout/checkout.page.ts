import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { first, lastValueFrom, Subscription, switchMap } from 'rxjs';
import { CodeLabel } from 'src/app/model/codeLabel.model';
import { AlertService } from 'src/app/services/alert.service';
import { SettingService } from 'src/app/services/setting.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { CONSTANTS } from 'src/app/utils/constants';
import { IPayPalConfig } from 'ngx-paypal';
import { CryptoService } from 'src/app/services/crypto';
declare let paypal: any;
declare let Stripe: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  productsSetting: any = {};
  dialectSetting: any = {};
  titlePayment: string = '';
  displayPaymentContent: boolean = false;
  urlPayment: SafeResourceUrl = {} as SafeResourceUrl;
  options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  payPalConfig?: IPayPalConfig;
  paymentRequest: any = {} as google.payments.api.PaymentDataRequest;
  subscriptionSelected: any = {};
  buttonRadius = 20;

  get user() {
    return this.authentificationService.user;
  }
  get isOverlay() {
    return this.settingService.isOverlay;
  }
  get isCapacitor() {
    return this.settingService.isCapacitor;
  }

  constructor(private router: Router, private authentificationService: AuthentificationService, private settingService: SettingService, private alertService: AlertService, private http: HttpClient, private cryptoService: CryptoService) {
    this.retrieveClientId();
  }

  ngOnInit() {
    this.settingService.getSettings().then(setting => {
      this.productsSetting = setting.product;
      this.dialectSetting = setting.userInformation;
      this.dialectSetting.learn = this.dialectSetting.learn?.filter((d: any) => d.code !== 'FREN');
    });
    this.subscriptionSelected = { ...this.user.account };
    this.subscriptionSelected.reduction = this.subscriptionSelected && this.subscriptionSelected.originalPrice ? (this.subscriptionSelected.originalPrice * this.subscriptionSelected.percentageReduction).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
    this.subscriptionSelected.price = this.subscriptionSelected && this.subscriptionSelected.price ? this.subscriptionSelected.price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
    this.subscriptionSelected.originalPrice = this.subscriptionSelected && this.subscriptionSelected.originalPrice ? this.subscriptionSelected.originalPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
    this.initConfigPayment();
  }

  initConfigPayment(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: environment.paypal.clientId,
      createOrderOnServer: (data) => fetch(environment.api + '/payButton', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: this.user.uid, email: this.user.email, account: this.user.account })
      }).then((res) => res.json())
        .then((order) => JSON.parse(order).id),
      advanced: { commit: 'true' },
      style: { shape: 'pill', layout: 'vertical', color: 'gold', label: 'paypal' },
      onApprove: (data, actions) => {
        this.alertService.presentToast('Transaction approuvée!', 3000, 'lagua');
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.authentificationService.addPremiumAccount().then(() => {
          this.confirmDisplayPaymentContent();
        }, error => { this.alertService.presentToast(error.message, 5000, 'danger') });
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.alertService.presentToast('Transaction annulé', 5000, 'dark');
      },
      onError: error => {
        this.alertService.presentToast(error, 5000, 'danger');
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      }
    };
  }

  async retrieveClientId() {
    const key = this.user.uid ? this.user.uid : 'test';
    if (!this.settingService.stripe) {
      const data$ = this.http.get<any>(environment.api + '/getKey?uid=' + key).pipe(first());
      const { stripe } = await lastValueFrom(data$);
      this.settingService.stripe = stripe;
    }
    const publishableKey = this.settingService.stripe.prodMode === 'true' ? this.settingService.stripe.key : this.settingService.stripe.keyTest;
    this.paymentRequest = <google.payments.api.PaymentDataRequest>{
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD']
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'stripe',
              'stripe:version': '2018-10-31',
              'stripe:publishableKey': this.cryptoService.decrypt(publishableKey, key)
            }
          }
        }
      ],
      merchantInfo: {
        merchantId: this.user.uid ? this.user.uid : 'test',
        merchantName: 'Forfait Premium Lagua : Débloquer les fonctionnalités Premium du client ' + this.user.email ? this.user.email : 'Test'
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: String(this.user.account ? this.user.account.price : '0.50'),
        currencyCode: 'EUR',
        countryCode: 'FR'
      }
    };
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

  async PaymentCreditCard2() {
    try {
      const data$ = this.httpPost('/create-checkout-session', this.user);
      const { id, client_secret, url, publishableKey } = await lastValueFrom(data$);
      this.titlePayment = 'Moyen de paiement';
      // this.urlPayment = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
      this.displayPaymentContent = true;
      const stripe = Stripe(publishableKey);
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
      this.titlePayment = 'Moyen de paiement';
      const data$ = this.httpPost('/create-payment-intent', { uid: this.user.uid, email: this.user.email, account: this.user.account });
      const { client_secret, publishableKey } = await lastValueFrom(data$);
      const stripe = Stripe(publishableKey);
      const elements = stripe.elements({ clientSecret: client_secret });
      const paymentElement = elements.create('payment');
      paymentElement.mount('#payment-element');

      this.getStripeContent(stripe, elements);
    } catch (e) {
      console.log(e);
    }
  }

  async displayPayPal() {
    paypal
      .Buttons({
        // Sets up the transaction when a payment button is clicked
        createOrder: this.createOrderCallback,
        onApprove: this.onApproveCallback,
        onError: this.onError,
        style: { shape: 'pill', layout: 'vertical', color: 'gold', label: 'paypal' },
        message: { amount: 100 },
      }, this)
      .render('#paypal-button-container');
  }

  async createOrderCallback() {
    const rawData = window.document.querySelector('#rawData > p')?.id;
    const data = rawData?.split('_');
    if (rawData && data) {
      const responseRawValue = await fetch(environment.api + '/payButton', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: data[0], email: data[1], price: data[2] }),
      }).then(response => response.json());
      const response = JSON.parse(responseRawValue);
      if (response?.details?.[0]) {
        this.alertService.presentToast(response?.details?.[0], 5000, 'danger');
      } else if (!response.id) {
        this.alertService.presentToast(CONSTANTS.RESPONSE_KO, 5000, 'danger');
      }
      return response.id;
    }

  }

  async onApproveCallback() {
    this.authentificationService.addPremiumAccount().then(() => {
      this.confirmDisplayPaymentContent();
    }, error => { this.alertService.presentToast(error.message, 5000, 'danger') }
    );
  }

  async onError(e: any) {
    this.alertService.presentToast(CONSTANTS.RESPONSE_KO, 5000, 'danger');
  }

  async PaymentPayPal() {
    // Connect to your backend endpoint, and get every key.
    const data$ = this.http.post<any>(environment.api + '/pay', { uid: this.user.uid, email: this.user.email, price: String(this.user.account.price) }).pipe(first());
    const response = await lastValueFrom(data$);

    console.log(response);
    const url = response?.links.find((link: any) => link.rel === 'approve')?.href;
    this.titlePayment = 'PayPal';
    window.open(url, '_self', 'popup');
    // this.urlPayment = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    this.displayPaymentContent = true;
  }

  // async PaymentGooglePay() {
  //   // Check to be able to use Google Pay on device
  //   const isAvailable = Stripe.isGooglePayAvailable().catch(() => undefined);
  //   if (isAvailable === undefined) {
  //     // disable to use Google Pay
  //     return;
  //   }

  //   Stripe.addListener(GooglePayEventsEnum.Completed, () => {
  //     console.log('GooglePayEventsEnum.Completed');
  //   });

  //   const data$ = this.httpPost('/payment-sheet', this.user);

  //   const { paymentIntent } = await lastValueFrom(data$);

  //   // Prepare Google Pay
  //   await Stripe.createGooglePay({
  //     paymentIntentClientSecret: paymentIntent,

  //     // Web only. Google Pay on Android App doesn't need
  //     paymentSummaryItems: [{
  //       label: 'Lagua',
  //       amount: 1.00
  //     }],
  //     merchantIdentifier: 'merchant.com.getcapacitor.stripe',
  //     countryCode: 'IN',
  //     currency: 'INR',
  //   });

  //   // Present Google Pay
  //   const result = await Stripe.presentGooglePay();
  //   if (result.paymentResult === GooglePayEventsEnum.Completed) {
  //     // Happy path
  //     this.splitAndJoin(paymentIntent);
  //   }
  // }

  getStripeContent(stripe: any, elements: any) {
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
        this.alertService.presentToast(error.message, 5000, 'danger');
      } else {
        this.authentificationService.addPremiumAccount().then(() => {
          this.confirmDisplayPaymentContent();
        }, error => { this.alertService.presentToast(error.message, 5000, 'danger') });
      }
    });
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

  onLoadPaymentData(event: any) {
    console.log('load payment data', event.detail);
    this.authentificationService.addPremiumAccount().then(() => {
      this.confirmDisplayPaymentContent();
    }, error => { this.alertService.presentToast(error.message, 5000, 'danger') });
  }

}
