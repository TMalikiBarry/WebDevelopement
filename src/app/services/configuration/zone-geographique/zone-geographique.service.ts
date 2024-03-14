import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Titre } from 'src/app/model/titre';
import { ZoneGeographique } from 'src/app/model/zone-geographique';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZoneGeographiqueService {

  private host = environment.host;

  constructor(private http: HttpClient ) { }

  getAll(): Observable<ZoneGeographique[]> {
    return this.http.get<ZoneGeographique[]>(this.host + "/zone-geographiques")
  }
}
