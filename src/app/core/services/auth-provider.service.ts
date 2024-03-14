import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthProviderService {

  constructor() { }

  AUTH_TOKEN = 'TOKEN';

  saveAuthData(token : string ){
    sessionStorage.setItem(this.AUTH_TOKEN, token  );

  }

  getAuthData(){

    if(sessionStorage.getItem(this.AUTH_TOKEN) == null ){
      return '';
    }
    else
    {
      return sessionStorage.getItem(this.AUTH_TOKEN) ;
    }

  }


}
