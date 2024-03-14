import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {TrancheNombreAnneeActivite} from "../../../model/tranche-nombre-annee-activite";
import {Observable} from "rxjs";
import {TranchAnneeActivite} from "../../../model/tranch-annee-activite";

@Injectable({
  providedIn: 'root'
})
export class TranchAnneeActivitesService {

  private host = environment.host;

  constructor(private http: HttpClient) { }

  getAll(): Observable<TranchAnneeActivite[]>{
    return this.http.get<TranchAnneeActivite[]>(this.host + "/tranche-annee-activites")

  }

}
