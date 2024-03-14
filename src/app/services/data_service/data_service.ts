import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Demande } from 'src/app/model/demande';
import { InfoSelection } from 'src/app/model/info-selection';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private infoSelection: any = new BehaviorSubject('');
  private demandeBeneficiaire: any = new BehaviorSubject('');
  private apiResponseSubject: any = new BehaviorSubject('');
  private messageSubject: any = new BehaviorSubject('');
  private messageFormSubject: any = new BehaviorSubject('');
  private messageFormMeSubject: any = new BehaviorSubject('');
  private updatePersonneSubject: any = new BehaviorSubject('');
  currentMessage: any;
  currentMessageBis: any;
  apiResponse: any;
  updatePersonne: any;
  message: any;
  messageForm: any;
  messageFormMe: any;

  constructor() {
    this.currentMessage = this.infoSelection.asObservable();
    this.currentMessageBis = this.demandeBeneficiaire.asObservable();
    this.apiResponse = this.apiResponseSubject.asObservable();
    this.updatePersonne = this.updatePersonneSubject.asObservable();
    this.message = this.messageSubject.asObservable();
    this.messageForm = this.messageFormSubject.asObservable();
    this.messageFormMe = this.messageFormMeSubject.asObservable();
  }

  changeMessage(message: InfoSelection) {
    //console.log(message);
    this.infoSelection.next(message);
  }

  changeMessageBeneficiaire(message: Demande) {
    //console.log(message);
    this.demandeBeneficiaire.next(message);
  }

  changeMessagePMO(message: string) {
    //console.log(message);
    this.apiResponseSubject.next(message);
  }

  changeMessageString(message: string) {
    //console.log(message);
    this.messageSubject.next(message);
  }

  changeMessageFormString(message: string) {
    //console.log(message);
    this.messageFormSubject.next(message);
  }

  changeMessageFormMeString(message: string) {
    //console.log(message);
    this.messageFormMeSubject.next(message);
  }

  updatePersonnePMO(personnePmo: any) {
    //console.log(message);
    this.updatePersonneSubject.next(personnePmo);
  }
}
