import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/api-response';
import { Support } from 'src/app/model/support';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  host = environment.host ;
  constructor(
      private http : HttpClient
  ) { }

  sendMailSupport(message: Support): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.host + "/supports", message);
  }

}
