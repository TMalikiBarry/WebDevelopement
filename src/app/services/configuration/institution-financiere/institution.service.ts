import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Institution} from "../../../model/Institution";

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
  private host = environment.host;

  constructor(private http: HttpClient ) { }
  getAll(): Observable<Institution[]> {
    return this.http.get<Institution[]>(this.host + "/type-")
  }
}
