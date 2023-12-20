import { Injectable } from '@angular/core';
import { CONSTANTS } from '../utils/constants';
import { AlertService } from './alert.service';
import { User } from '../model/user.model';
import { Utils } from '../utils/utils';
declare let Email: any;

@Injectable({
  providedIn: 'root',
})
export class EmailService {

  constructor(private alertService: AlertService) { }

  async sendEmail(infoContact: any, user: User) {
    const attachment = infoContact.attachment ? [{
      name : infoContact.attachment.name,
      path : await Utils.convertFileToDataUri(infoContact.attachment)
    }] : null;
    var data = {
      SecureToken: '7c063671-d48e-4020-b796-891ecc9bbfc4',
      // Host: 'smtp.gmail.com',
      // Username: CONSTANTS.TEAM_LAGUA_EMAIL,
      // Password: '6B171CB1BFE2E2D2F144552FC7A773B4616D',
      To: CONSTANTS.TEAM_LAGUA_EMAIL,
      From: CONSTANTS.TEAM_LAGUA_EMAIL,
      Subject: infoContact.question + ' : ' + infoContact.subject,
      Body: infoContact.description.replaceAll('\n', '<br/>'),
      Attachments: attachment,
    };
    Email.send(data).then(() => this.alertService.presentToast('Votre message a été envoyé.', 3000, 'success'));
  }

}
