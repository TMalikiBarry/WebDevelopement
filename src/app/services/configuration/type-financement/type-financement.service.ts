import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Titre } from 'src/app/model/titre';
import { TypeFinancement } from 'src/app/model/type-financement';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeFinancementService {

  private host = environment.host;

  constructor(private http: HttpClient ) { }

  getAll(): Observable<TypeFinancement[]> {
    return this.http.get<TypeFinancement[]>(this.host + "/type-financements")
  }
}
