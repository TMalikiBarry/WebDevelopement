import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IdentificationComponent} from "./identification/identification.component";
import {ActiviteComponent} from "./activite/activite.component";
import {CapaciteRemboursementComponent} from "./capacite-remboursement/capacite-remboursement.component";
import {TemplateAF} from "../../model/templateAF";
import {Prevision} from "../../model/prevision";
import {Credit} from "../../model/credit";
import {Demande} from "../../model/demande";
import {TouchPointService} from "../../services/touch-point/touch-point.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-form-analyste-me',
  templateUrl: './form-analyste-me.component.html',
  styleUrls: ['./form-analyste-me.component.scss']
})
export class FormAnalysteMeComponent implements OnInit {
  @ViewChild(IdentificationComponent) identificationtComponent! : IdentificationComponent;
  @ViewChild(ActiviteComponent) activiteComponent! : ActiviteComponent;
  @ViewChild(CapaciteRemboursementComponent) capaciteComponent! : CapaciteRemboursementComponent;
  @Input() demandeEx !: Demande
  identification: any;
  activite: any;
  capacite: any;
  stepname: string =  '';
  showModel:boolean  = false;
  isSpinning: boolean = false;
  constructor(private templateService: TouchPointService,
              private notificationService: NzNotificationService,
  private modalService: NzModalService) { }

  ngOnInit(): void {
    console.log(this.demandeEx)
    if (this.demandeEx){
      let bene =  this.demandeEx.beneficiaire
      let pers = this.demandeEx.beneficiaire?.personnes?.[0];

      this.identification = {
        nom: pers?.nom,
        datelieu: pers?.dateNaissance,
        numeroMobile: pers?.numeroMobile,
        numeroCNI: pers?.numeroCNI,
        adressePhysique: pers?.adresse,
        departement: bene?.zoneGeographique?.libelle,
        montantcredit: this.demandeEx.montant,
        typecredit: this.demandeEx.typeCredit,
      }
    }
    console.log(" "+this.identification)
  }
  currentStepPosition : number = 0 ;
  onIndexChange(index: number): void {
    console.log(index);
    this.currentStepPosition = index;
    if(index==5){
      this.currentStepPosition = index+1;
    }
    else{
      this.currentStepPosition = index;
    }

  }

  next(){


    if(this.currentStepPosition == 2){
      if(!this.identification){
        this.stepname = "l'identification";
        this.showModel = true;

        return;
      }else{
        this.showModel = false;
      }

        if(!this.activite){
          this.stepname = "l'activité";
          this.showModel = true;

          return;
        }else{
          this.showModel = false;
        }

      if(!this.capacite){
        this.stepname = "la capacité";
        this.showModel = true;
        return;
      }else{
        this.showModel = false;
      }
      console.log("identification", this.identification);
      console.log("activite ", this.activite);
      console.log("capacite ", this.capacite);

      this.sendTemplateAnalyste()

      return;
    }


      this.currentStepPosition+= 1 ;

  }

  pre() {
    this.currentStepPosition-= 1 ;
  }

  private sendTemplateAnalyste() {
     let template = new TemplateAF();


     let credit = new Credit();
     credit.date = this.identification.datecredit;
     credit.montant = this.identification.montantcredit;
     credit.typeFinancement = this.identification.typecredit;
     credit.remboursement = this.identification.remboursement;
     credit.remboursement_avec_retard = this.identification.remboursementavecretard;
     credit.institution_credit = this.identification.institution;
     template.credit?.push(credit);

     let prevision = new Prevision();
     prevision.revenus_annuel = this.activite.revenus;
     prevision.benefice_annuel_net = this.activite.benefice;
     prevision.periodicite_activite = this.activite.periodicite;
     prevision.revenus_annuel_previsionnel = this.activite.revenusprevisionnels;
     prevision.benefice_annuel_net_previsionnel = this.activite.beneficePrevisionnel;
     prevision.periodicite_activite_previsionnel = this.activite.periodiciteprojet;
     template.prevision = prevision;

    // let demande = new Demande();
    //
    // let beneficiaire = new Beneficiaire();
    // beneficiaire.nom = this.identification.nom;
    // beneficiaire.telephone = this.identification.numeroMobile;
    //
    // let personne = new Personne();
    // personne.dateNaissance = this.identification.datelieu;
    // personne.numeroCNI = this.identification.numeroCNI;
    // personne.adresse = this.identification.adressePhysique;
    // beneficiaire.personnes?.push(personne);
    // let activite = new ActiviteBeneficiaire();
    // let nombreannee = new TrancheNombreAnneeActivite();
    // nombreannee = JSON.parse(this.activite.nombreannee);
    // activite.nombreAnneeActivite = nombreannee;
    // beneficiaire.activiteBeneficiaires?.push(activite);
    // demande.beneficiaire = beneficiaire;
    //
    // demande.montant = this.activite.montantdemande;
    // demande.duree = this.activite.duree;
    // demande.typeCredit = JSON.parse(this.activite.typecredit);
    // demande.dateCreation = this.capacite.datecredit;
    // demande.garantie = JSON.parse(this.capacite.typegaranties);
    template.demande = this.demandeEx;

    template.situationMatrimoniale = this.identification.situation;

    template.reperes = this.identification.reperes;
    template.statut_domicile = this.identification.statutdomicile;
    template.references_familiales = this.identification.referencecontact;
    template.prenom_nom_conjointe = this.identification.nomconjoint;
    template.numero_telephone_conjointe = this.identification.numeroconjoint;
   // template.identification_activite = this.identification.lieuactivite;
    template.identification_activite = this.identification.localisation;
    template.fonds_propre = this.activite.fond;
    template.solvabilite = this.activite.solvabilite;
    template.apport_personnel = this.activite.apport;
    template.depenses_previsionnelles = this.activite.depenses;
    template.investissement = this.activite.investissement;

    template.revenus_personnels = this.capacite.revenusperso;
    template.depensense_personnelles = this.capacite.depensesperso;
    template.benefices_previsionnelles = this.capacite.beneficeprevisionnel;
    template.remboursement_mensuel = this.capacite.remboursementmensuel;
    template.marge = Number.parseFloat(this.capacite.marge);
    template.besoin_reel= this.activite.besoin_reel;
    template.competences = this.capacite.competence;
    template.formation_financiere = this.capacite.formation;
    template.marche_concurrence = this.capacite.concurrence;
    template.marche_reglementation = this.capacite.reglementation;
    template.estimation = this.capacite.estimationatoutrisque;
    template.hypotheses = this.capacite.hypotheses;
    template.risques = this.capacite.risquesinherents;
    template.preconisation = this.capacite.besoinformation;
    template.recommandations = this.capacite.avis;

    //console.log("template final"+JSON.stringify(template))
    this.templateService.postTemplate(template).subscribe(
      response =>{
      this.isSpinning = false;
      console.log(response);
      this.modalService.closeAll();
      this.notificationService.success('Succés', 'Template creer avec succes');

    },(error) => {
      console.log(error)
      this.isSpinning = false;
    });


      }

  done() {

  }
}
