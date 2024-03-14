import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BeneficiaireME} from "../../../model/beneficiaire-me";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import { ApiResponseBenef } from 'src/app/model/api-response-benef';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaireMEService {

  private host = environment.host;

  constructor(private http: HttpClient) { }

  save(beneficiaireME: BeneficiaireME): Observable<ApiResponseBenef> {

    return this.http.post<ApiResponseBenef>(this.host + "/beneficiairemes", beneficiaireME)

  }

  update(beneficiaireME: BeneficiaireME): Observable<ApiResponseBenef> {
    return this.http.put<ApiResponseBenef>(this.host + "/beneficiairemes", beneficiaireME)
  }

  get(id: number): Observable<BeneficiaireME> {
    return this.http.get<BeneficiaireME>(this.host + "/beneficiairemes"+id)
  }

  getAll(): Observable<BeneficiaireME[]> {
    return this.http.get<BeneficiaireME[]>(this.host + "/beneficiairemes")
  }

  search(keyword: string): Observable<BeneficiaireME[]> {
    return this.http.get<BeneficiaireME[]>(this.host + "beneficiairemes?telephone_like="+keyword)
  }

  deleteById(id: number): Observable<BeneficiaireME[]> {
    return this.http.get<BeneficiaireME[]>(this.host + "/beneficiairemes/ "+id)
  }
}
