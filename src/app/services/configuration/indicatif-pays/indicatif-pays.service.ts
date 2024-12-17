import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IndicatifPaysService {
  private _jsonURL = 'assets/country_prefix.json';
  constructor(private http: HttpClient) { }

  public getCountries(): Observable<any> {
    return this.http.get<any>(this._jsonURL);
  }

  public getCountrie(): Observable<any[]> {
    return this.http.get<any[]>(this._jsonURL);
  }
}
