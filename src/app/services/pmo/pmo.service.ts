import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PMO} from 'src/app/model/pmo';
import {environment} from 'src/environments/environment';
import {InfoSelection} from 'src/app/model/info-selection';
import {Demande} from 'src/app/model/demande';
import {IndicateurPMO} from 'src/app/model/Indicateur-pmo';
import {IndicateurRequest} from 'src/app/model/indicateur-request';
import {PersonnePMO} from 'src/app/model/personnePMO';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {DatePipe} from '@angular/common';
import {ExportPMO} from 'src/app/model/exportPMO';

@Injectable({
  providedIn: 'root'
})
export class PmoService {

  private host = environment.host;
  EXCEL_TYPE: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION: string = '.xlsx';

  constructor(private http: HttpClient ) { }

  save(pmo: PersonnePMO): Observable<PMO> {
    return this.http.post<any>(this.host + "/pmos", pmo)
  }

  savePMO(pmo: PersonnePMO): Observable<PMO> {
    return this.http.post<any>(this.host + "/auth/signup", pmo)
  }

  update(personnePMO: PersonnePMO): Observable<PMO> {
    return this.http.put<PMO>(this.host + "/personnes", personnePMO)
  }

  getAllUsers(id:number): Observable<any> {
    return this.http.get<any>(this.host + "/personnes/pmos/"+id)
  }

  searchDemandeById(idDemande:string | undefined): Observable<any> {
    return this.http.get<any>(this.host + "/demande-selections/demandes/"+idDemande)
  }
  getDemandeById(idDemande:string | undefined): Observable<any> {
    return this.http.get<any>(this.host + "/demandes/"+idDemande)
  }

  searchDemandeByIdBis(idDemande:string, idPmo:number): Observable<any> {
    return this.http.get<any>(this.host + "/demande-selections/demandes/"+idDemande + "/pmos/" + idPmo)
  }

  updateDemande(demande: Demande): Observable<Demande> {
    return this.http.put<Demande>(this.host + "/demandes", demande)
  }

  updaterejectDemande(infoDemandeReject: InfoSelection): Observable<InfoSelection> {
    return this.http.post<InfoSelection>(this.host + "/demande-rejetes", infoDemandeReject)
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(this.host + "/pmos/"+id)
  }

  getAll(id: number, page?: any, size?: any, sortField?: any, sortOrder?: any): Observable<any> {
    let params = new HttpParams().set("page", page).set("size", size).set("name", sortField).set("accesseur", sortOrder);
    return this.http.get<any>(this.host + "/demande-selections/pmos/" + id, {params: params})
  }

  getAllDemandeExport(exportPMO: ExportPMO): Observable<any> {
    // return this.http.post<any>(this.host + "/beneficiaire"+typeBeneficiaire+"/export/pmos/", exportPmo);
    return this.http.post<any>(this.host + "/demandes/bo/export/pmos/", exportPMO);

  }

  getAllActivitesIndicateurs(): Observable<InfoSelection[]> {
    return this.http.get<any>(this.host + "/activites")
  }

  getAllActivitesIndicateursByPMO(idPmo: number): Observable<InfoSelection[]> {
    return this.http.get<any>(this.host + "/pmos/"+idPmo+"/activites")
  }

  getIndicateurs(indicateurRequest:IndicateurRequest): Observable<IndicateurPMO> {
    return this.http.post<IndicateurPMO>(this.host + "/indicateur-pmos", indicateurRequest)
  }
  getAllDemandeApprouve(idPmo:number, page:number, size:number, sortField:string, sortOrder:string): Observable<any> {
    let params = new HttpParams().set("page",page).set("size", size).set("name", sortField).set("accesseur", sortOrder);
    return this.http.get<any>(this.host + "/demande-selections/pmos/"+idPmo+"/approuver", {params: params })
    }


  getAllDemandeRejete(idPmo:number, page:number, size:number, sortField:string, sortOrder:string): Observable<any> {
    let params = new HttpParams().set("page",page).set("size", size).set("name", sortField).set("accesseur", sortOrder);
    return this.http.get<any>(this.host + "/demande-rejetes/pmos/"+idPmo, {params: params })
  }

  getAllDemandeActivite2(idPmo:number, page:number, size:number, sortField:string, sortOrder:string): Observable<any> {
    let params = new HttpParams().set("page",page).set("size", size).set("name", sortField).set("accesseur", sortOrder);
    return this.http.get<any>(this.host + "/demande-selections/pmos/"+idPmo+"/activite-teranga", {params: params })
  }

  deleteById(id :number): Observable<PMO[]> {
    return this.http.delete<PMO[]>(this.host + "/pmos/"+id) ;
  }

  getAllReferer(): Observable<PMO[]>{
    return this.http.get<PMO[]>(this.host + "/pmos/referes")
  }

  getBeneficiaireById(id: number |undefined, typeBeneficiaire:string | undefined): Observable<any> {
    return this.http.get<any>(this.host + '/beneficiaire'+typeBeneficiaire?.toLowerCase()+'s/'+id)
  }

  getRegionById(id: number): Observable<any> {
    return this.http.get<any>(this.host + '/zone-geographiques/'+id)
  }

  checkIfCanRegisterBenef(id: number): Observable<any> {
    return this.http.get<any>(this.host + '/checks/pmos/'+id)
  }

  checkIfPMOSpecial(id: number): Observable<any> {
    return this.http.get<any>(this.host + '/checks/specialzed/pmos/'+id)
  }

  getTitre(): Observable<any> {
    return this.http.get<any>(this.host + '/titres')
  }

  changePassword(oldPassword: string, newPassword: string, username: string) {
    return this.http.post<any>(this.host + "/acces/pmo/reinitialisation-password", { oldPassword, newPassword, username })
  }

  getAllBeneficiaire(id:number, typeBeneficiaire:string, page:number, size:number, sortField:string, sortOrder:string): Observable<any> {
    let params = new HttpParams().set("page",page).set("size", size).set("name", sortField).set("accesseur", sortOrder);
    return this.http.get<any>(this.host + "/beneficiaire"+typeBeneficiaire+"/pmos/"+id, {params: params });
  }

  getAllBeneficiairePME(id:number, typeBeneficiaire:string, page:number, size:number, sortField:string, sortOrder:string): Observable<any> {
    let params = new HttpParams().set("page",page).set("size", size).set("denominationSociale", sortField).set("accesseur", sortOrder);
    return this.http.get<any>(this.host + "/beneficiaire"+typeBeneficiaire+"/bo/pmos/"+id, {params: params });
  }

  getAllBeneficiaireExport(typeBeneficiaire:string, exportPmo:ExportPMO): Observable<any> {
    return this.http.post<any>(this.host + "/beneficiaire"+typeBeneficiaire+"/bo/export/pmos/", exportPmo);
  }

  getAllBeneficiairePMEExport(typeBeneficiaire:string, exportPmo:ExportPMO): Observable<any> {
    return this.http.post<any>(this.host + "/beneficiaire"+typeBeneficiaire+"/bo/export/pmos/", exportPmo);
  }

  getNotificationPMO(id : string) : Observable<any> {
    // page and size configuration
    let params = new HttpParams();
    params = params.set('page' , 1);
    params = params.set('size' , 20);
    console.log(environment.host + "/notifications/demandes/"+id);
    return this.http.get<any>(environment.host + "/notifications/demandes/"+id);

  }

 saveAsExcelFile(jsonPME: any[], jsonME: any[], jsonGIE: any[], fileName: string): void {
  const worksheetPME: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonPME);
  const worksheetME: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonME);
  const worksheetGIE: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonGIE);

  const workbook: XLSX.WorkBook = { Sheets: {'PME': worksheetPME , 'ME': worksheetME, 'GIE': worksheetGIE}, SheetNames: ['PME', 'ME', 'GIE'] };

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  const data: Blob = new Blob([excelBuffer], {type: this.EXCEL_TYPE});
  let datePipe = new DatePipe('en-US');

  FileSaver.saveAs(data, fileName + new  Date().getTime() + this.EXCEL_EXTENSION);
}

}
