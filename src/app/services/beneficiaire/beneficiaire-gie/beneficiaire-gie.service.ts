import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseBenef } from 'src/app/model/api-response-benef';
import { BeneficiaireGie } from 'src/app/model/beneficiaire-gie';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaireGieService {

  private host = environment.host;

  constructor(private http: HttpClient ) { }


  save(gie: BeneficiaireGie): Observable<ApiResponseBenef> {
    return this.http.post<ApiResponseBenef>(this.host + "/beneficiairegies", gie)
  }

  update(gie: BeneficiaireGie): Observable<ApiResponseBenef> {
    return this.http.put<ApiResponseBenef>(this.host + "/beneficiairegies", gie)
  }

  getById(id: number): Observable<BeneficiaireGie> {
    return this.http.get<BeneficiaireGie>(this.host + "/beneficiairegies/"+id)
  }

  getAll(): Observable<BeneficiaireGie[]> {
    return this.http.get<BeneficiaireGie[]>(this.host + "/beneficiairegies")
  }

  deleteById(id : number ){
    return this.http.delete<BeneficiaireGie>(this.host + "/beneficiairegies/"+id);
  }
}
