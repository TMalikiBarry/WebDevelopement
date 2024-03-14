import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/security/auth/auth.service";
import {PmoService} from "../../../services/pmo/pmo.service";
import {Offre} from "../../../model/offre";
import {InfoSelection} from "../../../model/info-selection";
import {PMO} from "../../../model/pmo";
import {Demande} from "../../../model/demande";
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { IndicateurPMO } from 'src/app/model/Indicateur-pmo';
import { IndicateurRequest } from 'src/app/model/indicateur-request';

@Component({
  selector: 'app-indicateurs',
  templateUrl: './indicateurs.component.html',
  styleUrls: ['./indicateurs.component.scss']
})
export class IndicateursComponent implements OnInit {
  idPmo: number = 0;
  isSpinning = false;
  pmo?: PMO;
  indicateurs:  IndicateurPMO = new IndicateurPMO();
  activites: any;
  dateMaxCreation = new Date();
  isVisible = false;
  dateMaxCreationString = this.dateMaxCreation.getFullYear() + '-' + (this.dateMaxCreation.getMonth()+1)+'-'+(this.dateMaxCreation.getDate()>=10 ? this.dateMaxCreation.getDate() : '0'+this.dateMaxCreation.getDate());

  indicateursForm = this.fb.group({
    activite : [ '' , [ Validators.required]],
    typeBeneficiaire : [ '' , [ Validators.required]],
    date : [ '' , [ Validators.required]]
  });

  constructor(private authService : AuthService, private fb : UntypedFormBuilder, private pmoService:PmoService) { }

  ngOnInit(): void {
    //console.log(new Date().toJSON());
    if (localStorage.getItem('currentUser')) {
      let user = this.authService.currentUserValue;
      this.idPmo = user.idParent;
      this.onGetAllActivite();
    }
   // this.indicateursForm?.controls?.date?.setValue(new Date())

  }

  onGetAllActivite(){
    this.pmoService.getAllActivitesIndicateursByPMO(this.idPmo).subscribe((response) => {
      //console.log(response);
      this.activites = response;
      // this.offers = response?.offres;
    })
  }

  onGetIndicateurs(){
    let indicateurRequest = new IndicateurRequest();
    indicateurRequest.date = new Date(this.indicateursForm.controls.date.value).toJSON();
    indicateurRequest.code = this.indicateursForm.controls.activite.value;
    indicateurRequest.pmoID = this.idPmo;
      indicateurRequest.typeBeneficiaire = this.indicateursForm.controls.typeBeneficiaire.value;
      indicateurRequest.typeBeneficiaire = this.indicateursForm?.controls?.typeBeneficiaire.value;

    //console.log(indicateurRequest);
    this.isSpinning = true;
    this.pmoService.getIndicateurs(indicateurRequest).subscribe((response) => {
      this.isSpinning = false;
      //console.log(response);
      this.indicateurs = response;
        this.isVisible = true;
    },
    (error)=>{
      this.isSpinning = false;
      //console.log('error',error);
    })
  }

  visualiser(){

  }

}
