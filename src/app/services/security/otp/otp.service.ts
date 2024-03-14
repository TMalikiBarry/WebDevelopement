import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private host = environment.host;
  constructor(private http : HttpClient) { }

  sendCode(code:  String , id : number ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.host + "/otp/"+code+"/personnes/" + id)
  }

  regenerateCode(numero:  String , id : number ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.host + "/otp/regeneration-otp/" + numero + "/personnes/" + id );
  }

  sendCodeNewNumero(numero:  String , id : number ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.host + "/personnes/" + id + "/numero/" + numero );
  }

  resetPassword(identifiant:  String): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.host + "/acces/"+identifiant)
  }

  changeTelephone(telephone:  String): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.host + "/acces/"+telephone)
  }

  // save(demande: Demande): Observable<Demande> {
  //   return this.http.post<Demande>(this.host + "/demandes", demande)
  // }

  validateResetPassword(otp: string, newPassword: string, username: string) {
    return this.http.post<ApiResponse>(this.host + "/acces/reset-password", { otp, newPassword, username })
  }

}
