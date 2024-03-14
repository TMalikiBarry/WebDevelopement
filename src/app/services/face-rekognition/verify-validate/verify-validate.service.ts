import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class VerifyValidateService {

  constructor(private http  : HttpClient) {

  }

  verifyValidate(formData : FormData) : Observable<any>{
    return this.http.post<any>(environment.host+"/face-rekognitions/verify-validate" , formData);
  }

}
