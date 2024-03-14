import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Demande} from "../../model/demande";
import {IdentifyEntrepreneurComponent} from "./identify-entrepreneur/identify-entrepreneur.component";
import {IdentifyEntrepriseComponent} from "./identify-entreprise/identify-entreprise.component";
import {Validators} from "@angular/forms";
import {Beneficiaire} from "../../model/beneficiaire";
import {TemplateAF} from "../../model/templateAF";
import {BeneficiaireME} from "../../model/beneficiaire-me";
import {FormDemandeComponent} from "../form-demande/form-demande.component";
import {TouchPointService} from "../../services/touch-point/touch-point.service";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-form-analyste-pme-gie',
  templateUrl: './form-analyste-pme-gie.component.html',
  styleUrls: ['./form-analyste-pme-gie.component.scss']
})
export class FormAnalystePmeGieComponent implements OnInit {
  @ViewChild(IdentifyEntrepreneurComponent) identifyEntrepreneurComponent! : IdentifyEntrepreneurComponent
  @ViewChild(IdentifyEntrepriseComponent) identifyEntrepriseComponent! : IdentifyEntrepriseComponent
  @Input() demandeEx !: Demande
  currentStepPosition : number = 0 ;

  identifyEntrepreneur : any;
  identifyEntreprise : any;
  constructor(private touchservice : TouchPointService,
              private modal : NzModalService) { }

  ngOnInit(): void {
    console.log(this.demandeEx)
    if(this.demandeEx) {
      let bene = this.demandeEx.beneficiaire;
      this.identifyEntrepreneur = {
        fullName: bene?.personnes?.[0].prenom + " " +bene?.personnes?.[0].nom,
        lieuNaissance: bene?.personnes?.[0].adresse,
        dateNaissance: bene?.personnes?.[0].dateNaissance,
        nIdentification: bene?.personnes?.[0].numeroCNI,
        nbPersonnesCharge: bene?.activiteBeneficiaires?.[0].nombrePersonneAChargeMoyenne,
        adresse: bene?.personnes?.[0].adresse,
        telPrincipal: bene?.personnes?.[0].numeroMobile,
      }
      console.log(this.identifyEntrepreneur)
    }
  }

  pre() {
    this.currentStepPosition -= 1;
  }

  next() {
    console.log("entrepreneur "+this.identifyEntrepreneur)
    console.log("entreprise "+this.identifyEntreprise)
    if(this.currentStepPosition === 1) {
      if(this.identifyEntrepreneur && this.identifyEntreprise) {
        // let benef = new Beneficiaire();
        // let demandeRecuperee: Demande = new Demande();
        // //a revoir
        // if(localStorage.getItem('demandeCourante')) {
        //   demandeRecuperee = JSON.parse(<string>localStorage.getItem('demandeCourante'));
        //   const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
        //   benef.id = currentUser.idParent;
        //   if (!(this.description || demandeRecuperee.beneficiaire?.id == benef.id)) {
        //     this.stepname = "la description du projet";
        //     this.showModel = true;
        //     return;
        //   } else {
        //     this.showModel = false;
        //   }
        // }else if(this.authService.getRole() === "AGENT_INITIATEUR" && this.beneficiairetp){
        //   if(this.beneficiairetp.demandes?.[0]) {
        //     demandeRecuperee = this.beneficiairetp.demandes[0];
        //     benef.id = this.beneficiairetp.id
        //   }
        // }else{
        //   if(!(this.description || demandeRecuperee.beneficiaire?.id == benef.id)){
        //     this.stepname = "la description du projet";
        //     this.showModel = true;
        //     return
        //   }
        // }
        this.sendTemplateInfo();
      }
      return;
    }
    this.currentStepPosition += 1;
  }

  onIndexChange(index: number): void {
    console.log(index);
    this.currentStepPosition = index;
  }

  private sendTemplateInfo() {
    let template = new TemplateAF();
    template.demande = this.demandeEx
    template.situationMatrimoniale = this.identifyEntrepreneur.situationMatrimoniale
    template.statut_domicile = this.identifyEntrepreneur.statut_domicile
    template.prenom_nom_conjointe = this.identifyEntrepreneur.nomConjoint
    template.capacite_manageriale = this.identifyEntrepreneur.capaciteManag
    template.patrimoine_commun = this.identifyEntrepreneur.patrimoine_commun
    template.patrimoine_personnel = this.identifyEntrepreneur.patrimoine_personnel
    template.moyens_utilises = this.identifyEntreprise.moyens_utilises
    template.organisation = this.identifyEntreprise.organisation
    template.commentaire = this.identifyEntreprise.commentaires
    template.identification_activite = this.identifyEntreprise.identification_activite
    template.detailProjet =  this.identifyEntreprise.detailProjet
    template.etat_financier =  this.identifyEntreprise.etat_financier
    this.Save(template)
  }

  Save(template : TemplateAF){
    this.touchservice.postTemplate(template).subscribe(
      response => {

        console.log(response);
        this.modal.closeAll()
        // this.benefApiResponse = response ;
        // if(!this.idPmo){
        //   this.showOtp = true;
        // }
        // else{
        //   this.showSuccessPmo = true;
        // }
        //
        // this.renvoiCode = false;
        // this.nombreSecond = 60;
        // this.getTimer();
        // this.isSpinning = false;
        //
        // if(this.auth.getRole() == "AGENT_INITIATEUR" && !microEntrepreneur.demandes){
        //   this.modalService.closeAll()
        //   this.modalService.create({
        //     nzTitle: 'Demande de Financement',
        //     nzContent: FormDemandeComponent,
        //     nzComponentParams:{
        //       beneficiairetp: this.beneficiairetp
        //     },
        //     nzWidth: 1000,
        //     nzCancelText: null,
        //     nzOkText : null
        //   });
        //
        // }

      },
      (error) => {
        //this.isSpinning = false;
        console.log(error);
      })
  }
}
