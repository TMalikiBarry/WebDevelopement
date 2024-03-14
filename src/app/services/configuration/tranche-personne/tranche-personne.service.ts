import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TrancheNombrePersonne} from "../../../model/tranche-nombre-personne";

@Injectable({
  providedIn: 'root'
})
export class TranchePersonneService {

  private host = environment.host;

  constructor(private http: HttpClient) { }

  getAll(): Observable<TrancheNombrePersonne[]>{
    return this.http.get<TrancheNombrePersonne[]>(this.host + "/tranche-personnes");
  }
}
