import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Offre } from 'src/app/model/offre';
import { SecteurActivite } from 'src/app/model/secteur-activite';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecteurActiviteService {

  private host = environment.host;

  constructor(private http: HttpClient ) { }

  getAll(): Observable<SecteurActivite[]> {
    return this.http.get<SecteurActivite[]>(this.host + "/secteur-activites")
  }

}
