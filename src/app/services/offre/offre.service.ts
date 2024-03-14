import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Offre } from 'src/app/model/offre';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OffreService {

  private host = environment.host;

  constructor(private http: HttpClient ) { }


  save(offre: Offre): Observable<Offre> {
    return this.http.post<Offre>(this.host + "/offres", offre)
  }

  update(offre: Offre): Observable<Offre> {
    return this.http.put<Offre>(this.host + "/offres", offre)
  }

  getById(id: number): Observable<Offre> {
    return this.http.get<Offre>(this.host + "/offres/"+id)
  }

  getAll(): Observable<Offre[]> {
    return this.http.get<Offre[]>(this.host + "/offres")
  }

  deleteById(id : number ){
    return this.http.delete<Offre>(this.host + "/offres/"+id);
  }
}
