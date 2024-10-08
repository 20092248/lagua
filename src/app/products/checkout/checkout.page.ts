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
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
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
  public payPalConfig ? : IPayPalConfig;

  get user() {
    return this.authentificationService.user;
  }
  get isOverlay() {
    return this.settingService.isOverlay;
  }

  constructor(private router: Router, private authentificationService: AuthentificationService, private settingService: SettingService, private alertService: AlertService, private http: HttpClient, private domSanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.settingService.getSettings().then(setting => {
      this.productsSetting = setting.product;
      this.dialectSetting = setting.userInformation;
      this.dialectSetting.learn = this.dialectSetting.learn?.filter((d: any) => d.code !== 'FREN');
    });
    this.displayPayPal();
    this.initConfig();
  }

  private initConfig(): void {
    this.payPalConfig = {
        currency: 'EUR',
        clientId: 'Aex9Pkp_nDfTNSiv7z_BiupH2xJk6ZKN8U-4glIyUpEz1EonylEf_WogONgzWYN8F2VMMxOxKYTdIxF-',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: '9.99',
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: '9.99'
                        }
                    }
                },
                items: [{
                    name: 'Enterprise Subscription',
                    quantity: '1',
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                        currency_code: 'EUR',
                        value: '9.99',
                    },
                }]
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then((details: any) => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);

        },
        onError: err => {
            console.log('OnError', err);
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
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
        style: { shape: "pill", layout: "vertical", color: "gold", label: "paypal" },
        message: { amount: 100 },
      }, this)
      .render("#paypal-button-container");
  }

  async createOrderCallback() {
    const rawData = window.document.querySelector('#rawData > p')?.id;
    const data = rawData?.split('_');
    if(rawData && data) {
      const responseRawValue = await fetch(environment.api + '/payButton', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: data[0], email: data[1], price: data[2] }),
    }).then(response => response.json());
    const response = JSON.parse(responseRawValue); 
    if(response?.details?.[0]){
      this.alertService.presentToast(response?.details?.[0], 5000, 'danger');
    } else if(!response.id) {
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
        }, error => { this.alertService.presentToast(error.message, 5000, 'danger') }
        );
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

}
