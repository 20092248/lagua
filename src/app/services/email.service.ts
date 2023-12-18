import { Injectable } from '@angular/core';
import '../utils/smtp.js';
declare let Email: any;

@Injectable({
  providedIn: 'root',
})
export class EmailService {

  constructor() { }

  sendEmail(to: string, subject: string, text: string) {

  }

}

// 6B171CB1BFE2E2D2F144552FC7A773B4616D