import { Component, OnInit } from '@angular/core';
import { SettingService } from '../services/setting.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AlertService } from '../services/alert.service';
import { CodeLabel } from '../model/codeLabel.model';
import { AuthentificationService } from '../services/authentification.service';
import { Account } from '../model/account.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  animation: AnimationItem = {} as AnimationItem;
  productsSetting: any = {};
  options: AnimationOptions = { path: 'assets/img/comoros_flag.json', loop: true, name: 'comoros_flag' };
  styles: Partial<CSSStyleDeclaration> = { margin: 'auto', width: '35%', maxWidth: '300px' };

  get isOverlay() {
    return this.settingService.isOverlay;
  }

  get user() {
    return this.authentificationService.user;
  }

  constructor(private router: Router, private settingService: SettingService, private alertService: AlertService, private authentificationService: AuthentificationService) { }

  ngOnInit() {
    this.settingService.getSettings().then(setting => {
      this.productsSetting = setting.product;
    });
  }

  animationCreated(animation: any) {
    this.animation = animation as AnimationItem;
  }

  complete(event: any) {
    console.log('hide comoros flag');
    this.animation.destroy('comoros flag');
  }

  goToCheckout() {
    this.router.navigate(['/products/checkout']);
  }

  async showPayment(formule: any) {
    this.user.account = {} as Account;
    const choices: CodeLabel[] = [{ code: 'ALL', label: 'Ponctuel (en 1 seul fois)', src: '' }, { code: 'MENSUEL', label: 'Mensuel (par mois)', src: '' }];
    this.alertService.presentAlertWithRadio('Sélectionner la période de paiement', choices).then(alertResult => {
      if (alertResult.role === 'validate' && alertResult.data.values) {
        this.goToCheckout();
      } else if(alertResult.role === 'validate' && alertResult.data && !alertResult.data.values) {
        this.alertService.presentToast('Veuillez sélectionner un choix', 3000, 'lagua');
      } 
    });
  }

}
