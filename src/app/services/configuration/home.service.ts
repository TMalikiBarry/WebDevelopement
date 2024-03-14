import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Indicateur } from 'src/app/model/indicateur';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private host = environment.host;
  constructor(private http: HttpClient) { }

  getAIndicateurSuqali(): Observable<Indicateur> {
    return this.http.get<Indicateur>(this.host + "/indicateurs")
  }
}
