import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BeneficiaireME} from "../../model/beneficiaire-me";
import {ApiResponseBenef} from "../../model/api-response-benef";
import {ApiResponseDemandeOffres} from "../../model/demande-offres";
import {TemplateAF} from "../../model/templateAF";

@Injectable({
  providedIn: 'root'
})
export class TouchPointService {

  private host = environment.host;

  constructor(private http: HttpClient) { }

  getAllPersonnes(): Observable<any> {
    return this.http.get<any>(this.host +"/intouch/all")
  }

  getAllBeneficiaires(): Observable<any> {
    return this.http.get<any>(this.host +"/beneficiaires/touchpoint")
  }

  getAllDemandes(): Observable<any> {
    return this.http.get<any>(this.host +"/demandes/touchpoint")
  }

  validerBeneficiaire(id: number): Observable<ApiResponseBenef> {
    return this.http.get<ApiResponseBenef>(this.host + "/beneficiaires/touchpoint/"+id)
  }
  runMatching(id: number): Observable<any> {
    return this.http.get<any>(this.host + "/matchings/"+id)
  }
  getMatching(id: number): Observable<ApiResponseDemandeOffres> {
    return this.http.get<ApiResponseDemandeOffres>(this.host + "/matchings/demandes/"+id)
  }
  postTemplate(template : TemplateAF){
    return this.http.post<TemplateAF>(this.host + "/template/save", template);
  }
  getAllTemplate(){
    return this.http.get<any>(this.host + "/template");
  }
  getTemplateByDemande(id : number){
    return this.http.get<any>(this.host + "/template/demande"+id);
  }
}
