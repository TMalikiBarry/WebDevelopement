import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Statut} from "../../../model/Statut";

@Injectable({
  providedIn: 'root'
})
export class StatutService {
  private host = environment.host;

  constructor(private http: HttpClient ) { }
  getAll(): Observable<Statut[]> {
    return this.http.get<Statut[]>(this.host + "/type-")
  }
}
