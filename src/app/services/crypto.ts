import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  //To encrypt input data
  public encrypt(password: string, key: string): string {
    return CryptoJS.AES.encrypt(password, key).toString();
  }

  //To decrypt input data
  public decrypt(passwordToDecrypt: string, key: string) {
    return CryptoJS.AES.decrypt(passwordToDecrypt, key).toString(CryptoJS.enc.Utf8);
  }

}