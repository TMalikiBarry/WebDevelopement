import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TypeFinancement} from "../../../model/type-financement";
import {Garantie} from "../../../model/garantie";
@Injectable({
  providedIn: 'root'
})
export class GarantieService {
  private host = environment.host;
  constructor(private http: HttpClient ) { }

  getAll(): Observable<Garantie[]> {
    return this.http.get<Garantie[]>(this.host + "/garanties")
  }
}
