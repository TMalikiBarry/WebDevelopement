import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {DemandeSelection} from "../../model/DemandeSelection";
import {ApiResponse} from "../../model/api-response";
import {TemplateAF} from "../../model/template-af";

@Injectable({
  providedIn: 'root'
})
export class TemplateAFService {

  private host = environment.host;

  constructor(private http: HttpClient) {
  }

  save(template: TemplateAF) {
    return this.http.post<ApiResponse>(this.host + "/api/teranga/template/save", template)
  }
}
