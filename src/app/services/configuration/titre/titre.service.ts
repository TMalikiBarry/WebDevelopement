import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Titre } from 'src/app/model/titre';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TitreService {

  private host = environment.host;

  constructor(private http: HttpClient ) { }

  getAll(): Observable<Titre[]> {
    return this.http.get<Titre[]>(this.host + "/titres")
  }
}
