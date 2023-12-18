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

    console.log(Email);
    // this.http.post(CONSTANTS.URL_SEND_GRID, {
    //   personalizations: [{ to: [{ email: to }] }],
    //   from: { from: CONSTANTS.TEAM_LAGUA_EMAIL },
    //   subject: subject,
    //   content: [{ type: 'text/plain', value: text }],
    // }, this.httpOptions).subscribe(() => {
    //   this.alertService.presentToast('Votre message a été envoyé.', 3000, 'success');
    // });

    Email.send({
      Host: 'smtp.gmail.com',
      Username: CONSTANTS.TEAM_LAGUA_EMAIL,
      Password: '6B171CB1BFE2E2D2F144552FC7A773B4616D',
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

// 6B171CB1BFE2E2D2F144552FC7A773B4616D