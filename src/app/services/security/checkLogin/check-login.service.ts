import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckLoginService {

  constructor(private http : HttpClient) {

  }

   url = environment.host ;

  checkLogin(login : string ):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(this.url+'/checks/login/'+login);
  }

  checkNumPiece(numero_cni : string, id: any ):Observable<ApiResponse>{
      return this.http.get(this.url+'/checks/numero-cni', {
        params: {
          numeroCni: numero_cni,
          id: id
        }
      })
    //this.http.get<ApiResponse>(this.url+'/checks/numero-cni/'+numero_cni);
  }

  checkCodeClient(codeClient : string, typeBenef: any ):Observable<ApiResponse>{
    return this.http.get(this.url+'/connectoruimcec/'+typeBenef+'/'+codeClient);
  //this.http.get<ApiResponse>(this.url+'/checks/numero-cni/'+codeClient);
}

}
