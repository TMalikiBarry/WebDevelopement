import {Injectable} from '@angular/core';

import ls from 'localstorage-slim';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // private readonly saltValue = (window as any).process.env.SUQALI_CRYPT_SALT;
  // private readonly secretKeyValue = (window as any).process.env.SUQALI_CRYPT_SECRET_KEY;
  private readonly secretKeyValue = 'RANDOM_SECRET_KEY_TERANGA_SUQALI_CRYPT-01';


  constructor() {
    /*    // Encrypt
        let ciphertext = CryptoJS.AES.encrypt(message, secretKey).toString();

    // Decrypt
        let bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        let originalText = bytes.toString(CryptoJS.enc.Utf8);*/
  }

  setItem(key: string, value: string) {
    ls.set(key, value, {encrypt: true});
    // console.log('ENCRYPTED TEXT ', ciphertext);
    // // localStorage.setItem(key, encrypt(value, this.secretKeyValue, this.saltValue)!)
    // localStorage.setItem(key,ciphertext);
    // return ciphertext;
  }

  // encryptData(value : string) {
  //   return CryptoJS.AES.encrypt(value, this.secretKeyValue)
  // }

  getItem(key: string): string {
    // return decrypt(localStorage.getItem(key)!, this.secretKeyValue, this.saltValue)!

    /*let bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKeyValue);
    return bytes.toString(CryptoJS.enc.Utf8);*/
    return ls.get(key, {decrypt: true})!;

  }
}
