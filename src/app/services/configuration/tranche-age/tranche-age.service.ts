import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {NiveauInstruction} from "../../../model/niveau-instruction";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {TrancheAge} from "../../../model/tranche-age";

@Injectable({
  providedIn: 'root'
})
export class TrancheAgeService {

  private host = environment.host;

  constructor(private http: HttpClient) { }

  getAll(): Observable<TrancheAge[]> {
    return this.http.get<TrancheAge[]>(this.host + "/tranche-ages")
  }
}
