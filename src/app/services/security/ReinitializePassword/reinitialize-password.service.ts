import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/api-response';
import { ReinitModel } from 'src/app/model/reinit-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReinitializePasswordService {

  constructor(private http : HttpClient) { }

  reinitializePassword(newPasswordObject : ReinitModel ) : Observable<ApiResponse>{
    return this.http.post<ApiResponse>(environment.host+'/acces/reinitialisation-password',newPasswordObject);
  }
}
