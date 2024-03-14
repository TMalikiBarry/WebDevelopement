import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Genre } from 'src/app/model/genre';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private host = environment.host;

  constructor(private http: HttpClient ) { }

  getAll(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.host + "/genres")
  }

}
