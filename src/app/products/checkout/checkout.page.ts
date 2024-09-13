import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { CodeLabel } from 'src/app/model/codeLabel.model';
import { AlertService } from 'src/app/services/alert.service';
import { SettingService } from 'src/app/services/setting.service';

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

  constructor(private router: Router, private settingService: SettingService, private alertService: AlertService) { }

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
      } else if(!alertResult.data.values) {
        this.alertService.presentToast('Veuillez sélectionner un choix', 3000, 'lagua');
      }
    });
  }

}
