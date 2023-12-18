import { Injectable } from '@angular/core';
import { CONSTANTS } from '../utils/constants';
import { AlertService } from './alert.service';
declare let Email: any;

@Injectable({
  providedIn: 'root',
})
export class EmailService {

  constructor(private alertService: AlertService) { }

  sendEmail(infoContact: any) {
    var data = {
      SecureToken: '7c063671-d48e-4020-b796-891ecc9bbfc4',
      // Host: 'smtp.gmail.com',
      // Username: CONSTANTS.TEAM_LAGUA_EMAIL,
      // Password: '6B171CB1BFE2E2D2F144552FC7A773B4616D',
      To: infoContact.to,
      From: CONSTANTS.TEAM_LAGUA_EMAIL,
      Subject: infoContact.subject,
      Body: infoContact.text,
    };
    if(infoContact.attachment) {
      data.Body.Attachments = [];
      data.Body.Attachments.push({name: '', data: ''}); // A FAIRE
    }
    Email.send(data).then(() => this.alertService.presentToast('Votre message a été envoyé.', 3000, 'success'))
    .error(() => this.alertService.presentToast(CONSTANTS.SEND_EMAIL_KO, 3000, 'success'));
CONSTANTS
  }

}
