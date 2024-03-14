import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {TrancheAge} from "../../../model/tranche-age";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {TrancheNombreAnneeActivite} from "../../../model/tranche-nombre-annee-activite";

@Injectable({
  providedIn: 'root'
})
export class TrancheAnneeActiviteService {

  private host = environment.host;

  constructor(private http: HttpClient) { }

  getAll(): Observable<TrancheNombreAnneeActivite[]> {
    return this.http.get<TrancheNombreAnneeActivite[]>(this.host + "/tranche-annee-activites")
  }
}
