import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/api-response';
import { ApiResponseSimple } from 'src/app/model/api-response-simple';
import { Demande } from 'src/app/model/demande';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  private host = environment.host;

  constructor(private http: HttpClient ) { }


  save(demande: Demande): Observable<Demande> {
    return this.http.post<Demande>(this.host + "/demandes", demande)
  }

  update(demande: Demande): Observable<Demande> {
    return this.http.put<Demande>(this.host + "/demandes", demande)
  }

  getById(id: number): Observable<Demande> {
    return this.http.get<Demande>(this.host + "/demandes/"+id)
  }

  getAll(): Observable<Demande[]> {
    return this.http.get<Demande[]>(this.host + "/demandes")
  }

  deleteById(id : number ){
    return this.http.delete<Demande>(this.host + "/demandes/"+id);
  }

  // check if the user can do demande
  checkDemandeValidity(id : number ){
    return this.http.get<ApiResponseSimple>(this.host + "/checks/demandes/"+id);
  }

}
