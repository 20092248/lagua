import { Injectable } from '@angular/core';
import { CONSTANTS } from '../utils/constants';
import { AlertService } from './alert.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as mail from '@sendgrid/mail';

@Injectable({
  providedIn: 'root',
})
export class EmailService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + CONSTANTS.EMAIL_API_KEY
    })
  };

  constructor(private http: HttpClient, private alertService: AlertService) { }

  sendEmail(to: string, subject: string, text: string) {

    // this.http.post(CONSTANTS.URL_SEND_GRID, {
    //   personalizations: [{ to: [{ email: to }] }],
    //   from: { from: CONSTANTS.TEAM_LAGUA_EMAIL },
    //   subject: subject,
    //   content: [{ type: 'text/plain', value: text }],
    // }, this.httpOptions).subscribe(() => {
    //   this.alertService.presentToast('Votre message a été envoyé.', 3000, 'success');
    // });


    mail.setApiKey(CONSTANTS.EMAIL_API_KEY);
    mail.send({
      to: to,
      from: CONSTANTS.TEAM_LAGUA_EMAIL,
      subject: subject,
      text: text,
      html: '<strong>' + text + '</strong>',
    }).then(res => {
      console.log(res);
    });
  }

}