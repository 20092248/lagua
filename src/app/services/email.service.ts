import { Injectable } from '@angular/core';
import { CONSTANTS } from '../utils/constants';
import { AlertService } from './alert.service';
declare let Email: any;

@Injectable({
  providedIn: 'root',
})
export class EmailService {

  constructor(private alertService: AlertService) { }

  sendEmail(to: string, subject: string, text: string) {
    Email.send({
      SecureToken: '7c063671-d48e-4020-b796-891ecc9bbfc4',
      // Host: 'smtp.gmail.com',
      // Username: CONSTANTS.TEAM_LAGUA_EMAIL,
      // Password: '6B171CB1BFE2E2D2F144552FC7A773B4616D',
      To: to,
      From: CONSTANTS.TEAM_LAGUA_EMAIL,
      Subject: subject,
      Body: text,
      // Attachments: [
      //   {
      //     name: 'list.pdf',
      //     data: pdfBase64
      //   }]
    }).then(() => {
      this.alertService.presentToast('Votre message a été envoyé.', 3000, 'success');
    }
    );

  }

}
