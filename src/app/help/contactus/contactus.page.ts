import { Component, OnInit } from '@angular/core';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.page.html',
  styleUrls: ['./contactus.page.scss'],
})
export class ContactusPage implements OnInit {

  constructor(private emailService: EmailService) { }

  ngOnInit() {
  }

  sendEmail() {
    this.emailService.sendEmail('brady91700@gmail.com', 'Test', 'Ceci est un test.');
  }

}
