import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Demande } from 'src/app/model/demande';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Beneficiaire } from 'src/app/model/beneficiaire';
import { Offre } from 'src/app/model/offre';
import { ApiResponse } from 'src/app/model/api-response';
import { DemandeSelection } from 'src/app/model/DemandeSelection';
import { BeneficiaireME } from 'src/app/model/beneficiaire-me';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaireService {
  private host = environment.host;
  constructor(private http: HttpClient) { }

  getAllDemande(id: number): Observable<Beneficiaire> {
    return this.http.get<Beneficiaire>(this.host + "/beneficiaires/"+id)
  }

  getBeneficiaireMEById(id: number): Observable<BeneficiaireME> {
    return this.http.get<BeneficiaireME>(this.host + "/beneficiairemes/"+id)
  }

  getAllOffres(id: number): Observable<DemandeSelection> {
    return this.http.get<DemandeSelection>(this.host + "/matchings/beneficiaire/"+id)
  }

  getOffresSelected(id: number): Observable<DemandeSelection> {
    return this.http.get<DemandeSelection>(this.host + "/demande-selections/demandes/"+id)
  }

  confirmerOffres(demandeSelection: DemandeSelection) {
    return this.http.post<ApiResponse>(this.host + "/demande-selections", demandeSelection)
  }

}
