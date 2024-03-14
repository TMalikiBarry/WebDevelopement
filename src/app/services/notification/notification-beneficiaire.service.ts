import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationBeneficiaireService {

  constructor(private http : HttpClient) { }

  getNotification( id : number, page:number, size:number): Observable<any>{
    let params = new HttpParams().set("page",page).set("size", size);
    // return this.http.get<any>(this.host + "/beneficiaire"+typeBeneficiaire+"/pmos/"+id, {params: params });
    // page and size configuration
    // let params = new HttpParams();
    // params = params.append('page' , 0);
    // params = params.append('size' , 20);
    return this.http.get<any>(environment.host + "/notifications/beneficiaires/"+id, {params: params });
  }

  getNotificationPMO( id : number, page:number, size:number): Observable<any>{
    let params = new HttpParams().set("page",page).set("size", size);
    // page and size configuration
    // let params = new HttpParams();
    // params = params.append('page' , 1);
    // params = params.append('size' , 20);
    return this.http.get<any>(environment.host + "/notifications/pmo/"+id, {params: params });
  }

  getNotificationWithPagination(id : number , page : number , size : number  ) : Observable<any> {
    // page and size configuration
    let params = new HttpParams();
    params = params.append('page' , 1);
    params = params.append('size' , 20);
    return this.http.get<any>(environment.host + "/notifications/demandes/"+id , { params : params });

  }

}
