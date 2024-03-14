import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InstrumentFinancement } from 'src/app/model/instrument-financement';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstrumentFinancementService {

  private host = environment.host;

  constructor(private http: HttpClient ) { }

  getAll(): Observable<InstrumentFinancement[]> {
    return this.http.get<InstrumentFinancement[]>(this.host + "/instrument-financements")
  }


}
