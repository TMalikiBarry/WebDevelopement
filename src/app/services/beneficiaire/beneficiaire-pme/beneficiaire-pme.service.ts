import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseBenef } from 'src/app/model/api-response-benef';
import { BeneficiairePME } from 'src/app/model/beneficiaire-pme';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BeneficiairePmeService {

  private host = environment.host;

  constructor(private http: HttpClient ) { }


  save(pme: BeneficiairePME): Observable<ApiResponseBenef> {
    return this.http.post<ApiResponseBenef>(this.host + "/beneficiairepmes", pme)
  }

  update(pme: BeneficiairePME): Observable<ApiResponseBenef> {
    return this.http.put<ApiResponseBenef>(this.host + "/beneficiairepmes", pme)
  }

  getById(id: number): Observable<BeneficiairePME> {
    return this.http.get<BeneficiairePME>(this.host + "/beneficiairepmes/"+id)
  }

  getAll(): Observable<BeneficiairePME[]> {
    return this.http.get<BeneficiairePME[]>(this.host + "/beneficiairepmes")
  }

  deleteById(id : number ){
    return this.http.delete<BeneficiairePME>(this.host + "/beneficiairepmes/"+id);
  }

}
