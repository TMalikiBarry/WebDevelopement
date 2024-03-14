import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {NiveauInstruction} from "../../model/niveau-instruction";

@Injectable({
  providedIn: 'root'
})
export class NiveauInstructionService {

  private host = environment.host

  constructor(private http: HttpClient) { }

  getAll(): Observable<NiveauInstruction[]> {
    return this.http.get<NiveauInstruction[]>(this.host + "/niveau-instructions")
  }
}
