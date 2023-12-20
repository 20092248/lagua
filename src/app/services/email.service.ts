import { Injectable } from '@angular/core';
import { CONSTANTS } from '../utils/constants';
import { AlertService } from './alert.service';
import { User } from '../model/user.model';
import emailjs from '@emailjs/browser';
import { Utils } from '../utils/utils';
declare let Email: any;

@Injectable({
  providedIn: 'root',
})
export class EmailService {

  constructor(private alertService: AlertService) { }

  async sendEmailJs(infoContact: any, user: User, addAttachment: boolean) {
    const templateParams = {
      to_email: CONSTANTS.TEAM_LAGUA_EMAIL,
      from_name: CONSTANTS.TEAM_LAGUA_NAME,
      subject: infoContact.question + ' : ' + infoContact.subject + '(' + infoContact.mail + ')',
      message: infoContact.description + Utils.addUserInfo(user),
      content: infoContact.attachment && addAttachment ? await Utils.convertFileToDataUri(infoContact.attachment) : null
    };
    emailjs.send('service_9zwb5dc', 'template_l5012pe', templateParams, 'FO89YWCo-XOmSAsSs')
      .then((response) => {
        this.alertService.presentToast('Votre message a été envoyé.', 3000, 'success');
      }, (err) => {
        console.warn(err);
        this.sendEmailJs(infoContact, user, false);
      });
  }

}
