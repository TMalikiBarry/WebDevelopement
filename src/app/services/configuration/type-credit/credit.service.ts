import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TypeCredit} from "../../../model/TypeCredit";

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private host = environment.host;

  constructor(private http: HttpClient ) { }
  getAll(): Observable<TypeCredit[]> {
    return this.http.get<TypeCredit[]>(this.host + "/type-")
  }
}
