import {Component, OnInit, ViewChild} from '@angular/core';
import {DemandeFinancementGieComponent} from "./demande-financement-gie/demande-financement-gie.component";
import {DescriptionProjetGieComponent} from "./description-projet-gie/description-projet-gie.component";
import {BeneficiaireGie} from "../../model/beneficiaire-gie";
import {Demande} from "../../model/demande";
import {Beneficiaire} from "../../model/beneficiaire";
import {Offre} from "../../model/offre";
import {Session} from "../../model/session";
import {Projet} from "../../model/projet";
import {TrancheNombrePersonne} from "../../model/tranche-nombre-personne";
import {DemandeService} from "../../services/demande/demande.service";
import {MessageService} from "../../services/message/message-service.service";
import {FinancementObtenu} from "../../model/FinancementObtenu";
import {AuthService} from "../../services/security/auth/auth.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
import {Validators} from "@angular/forms";
import {pasteDateValidator} from "../../core/customValidators/past-date-validator";


@Component({
  selector: 'app-eb-gie',
  templateUrl: './eb-gie.component.html',
  styleUrls: ['./eb-gie.component.scss']
})
export class EbGieComponent implements OnInit {

  @ViewChild(DemandeFinancementGieComponent) demandeFinancement! : DemandeFinancementGieComponent;

  @ViewChild(DescriptionProjetGieComponent) descriptionProjet! : DescriptionProjetGieComponent;

  // step demande
  demande : any ;

  // step descrition
  description : any ;

  // step emploi

  emploiPermanent : any;
  idPmo: any;
  idBeneficiaire: any;
  emploiNonPermanent : any;
  showSuccess : boolean = false;
  demandecache : boolean = true;
  currentStepPosition : number = 0 ;
  stepname: string =  '';
  showModel:boolean  = false;
  nouveaux?: Projet[];
  isSpinning: boolean = false;

  constructor(private  demandeService: DemandeService,
              private messageService: MessageService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private modal: NzModalService,
              private router: Router ){ }

  ngOnInit(): void {
    this.idPmo = this.activatedRoute.snapshot.params.pmo;
    this.idBeneficiaire = this.activatedRoute.snapshot.params.idBenef;
    console.log('idpmo recu', this.idPmo);
    console.log('idbenef recu', this.idBeneficiaire);
  }

  pre(){
    this.currentStepPosition-= 1 ;
  }

  next(){
  ////console.log(this.currentStepPosition)
    if(this.currentStepPosition == 1){

      let benef = new Beneficiaire();
      let demandeRecuperee: Demande;
      if(localStorage.getItem('demandeCourante')) {
        demandeRecuperee = JSON.parse(<string>localStorage.getItem('demandeCourante'));
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
        benef.id = currentUser.idParent;
        if (!(this.description || demandeRecuperee.beneficiaire?.id == benef.id)) {
          this.stepname = "la description du projet";
          this.showModel = true;
          return;
        } else {
          this.showModel = false;
        }
      }else{
        if(!this.description){
          this.stepname = "la description du projet";
          this.showModel = true;
          return
        }
      }
      this.sendGieInfo();
      return ;
    }

    this.currentStepPosition+= 1 ;
  }

  done(){}

  sendGieInfo() {
    let demande = new Demande();
    demande.typeDemande = this.demande.typefinancement;
    demande.montant =  parseInt(this.demande.montantdemande?.replace(/\s/g, "")) ;
    //demande.cout =  parseInt(this.demande.cout?.replace(/\s/g, "")) ;
    //demande.apport = this.demande.apport ;
    //demande.garantie = this.demande.garantie? JSON.parse(this.demande.garantie):null;
    //demande.valeurGarantie = parseInt(this.demande.valeurGaranties?.replace(/\s/g, "")) ;
    demande.tauxInteretAnnuelleSouhaite = this.demande.tauxInteret ;
    demande.nombreMembresConcernes = this.demande.nombreMembresConcernes ;
    demande.montantDemandeParMembre = this.demande.montantDemandeParMembre;
    demande.duree = this.demande.duree ;
    //demande.financementObtenue = this.demande.typeFinancement ;

    // demande.tauxInteretAnnuelTTC = this.demande.typeFinancement ;
    // demande.tauxInteretAnnuelTEG = this.demande.typeFinancement ;
    //demande.statutDossier = this.demande.typeFinancement ;
    //demande.dateLastStatut = this.demande.typeFinancement ;
    //demande.supprime = this.demande.typeFinancement ;
    //demande.dateCreation = this.demande.typeFinancement ;
    //demande.dateModification = this.demande.typeFinancement ;
    //demande.session = this.demande.typeFinancement ;
    // demande.offres = this.demande.typeFinancement ;



    // setting list financements
    let financements: FinancementObtenu[] =[];
    for(let fin of this.demande.listeFinancement){
      let finTemp = new FinancementObtenu()
      finTemp.institutionFinanciere = fin.institutionFinanciere ;
      finTemp.autreInstitutionFinanciere= fin.autreInstitution ;
      finTemp.typeCredit = fin.typeCredit ;
      finTemp.dateFinancement = new Date(fin.datemepFinancement) ;
      finTemp.tableauAmortissement = fin.tableauFinancementNom ;
      ////console.log(fin.tableauFinancementNom);
      finTemp.dateRemboursement = new Date(fin.dateRemboursement);
      finTemp.statusFinancement = fin.statutFinancement ;
   //   finTemp.dateMiseADisposition =new Date(this.demande.datemepFinancement)  ;
      // demande.dateSignatureAccord = this.demande.typeFinancement ;
      //demande.categorie = this.demande.typeFinancement ;
      finTemp.montant = parseInt(fin.montant?.replace(/\s/g, ""));
      //demande.garantieDemandes = this.demande.typeFinancement ;
      // demande.dureeCredit = this.demande.typeFinancement ;
     finTemp.tauxInteretAnnuelHT = fin.tauxInteretHT ;
      financements.push(finTemp)
    }
    demande.financementObtenus = financements;


    let projet = new Projet();
    if(!this.description) {
      let benef = new Beneficiaire();
      let demandeRecuperee: Demande;

      demandeRecuperee = JSON.parse(<string>localStorage.getItem('demandeCourante'));
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
      benef.id = currentUser.idParent;
      //console.log(demandeRecuperee);
      //console.log(benef.id);
      //console.log(demandeRecuperee.beneficiaire?.id);
      //console.log(demandeRecuperee.beneficiaire?.id == benef.id);
      if (demandeRecuperee.beneficiaire?.id == benef.id) {


        this.nouveaux = demandeRecuperee.projets;
        // @ts-ignore
        //console.log(demandeRecuperee.projets[0]);
// @ts-ignore
        projet = demandeRecuperee.projets[0];
      }
    }else {
      projet.description = this.description.descriptionProjet;
      projet.cout = this.description.coutProjet;
      projet.businessPlan = this.description.bussinessPlanNom;

      // projet.complementInformations?.push(this.description.complementInfoNom);
      for(let complementInfo of this.description.complementInfoNom){
        projet.complementInformations?.push(complementInfo);
      }
      projet.nombreEmploisPermanent = this.description.employesPermanents ? JSON.parse(this.description.employesPermanents) : null;
      projet.nombreEmploisAdditionnelPermanent = this.description.nombreEmploiAdditionnel;
      projet.nombreFemmePrevuePermanent = this.description.nombreFemmesPrevu;
      projet.pourcentageFemmePermanent = this.description.pourcentageFemme?.replace('%','');
      projet.nombreJeunePermanent = this.description.nombreJeunes;
      projet.pourcentageJeunePermanent = this.description.pourcentageJeunes?.replace('%','');

      projet.nombreEmploisNonPermanent = this.description.employesNonPermanents ? JSON.parse(this.description.employesNonPermanents) : null;
      projet.nombreEmploisAdditionnelNonPermanent = this.description.NombreEmploisAdditionnelsNonPermanents;
      projet.nombreFemmePrevueNonPermanent = this.description.NombreFemmesPrevuNonPermanents;
      projet.pourcentageFemmeNonPermanent = this.description.PourentageFemmesNonPermanents?.replace('%','');
      projet.nombreJeuneNonPermanent = this.description.NombreJeunesNonPermanents;
      projet.pourcentageJeuneNonPermanent = this.description.PourcentageJeunesNonPermanents?.replace('%','');
      projet.cout = this.demande.coutProjet?.replace(/\s/g, "");
    }
    demande.projets?.push(projet);


    //insertion beneficiaire
    let beneficiaire = new Beneficiaire();
    if(this.idBeneficiaire){ // Creation issue du PMO
      beneficiaire.id = this.idBeneficiaire;
      demande.beneficiaire = beneficiaire;
    }
    else{
      if(localStorage.getItem('currentUser') != null) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
        beneficiaire.id = currentUser.idParent;
        demande.beneficiaire = beneficiaire;
      }
    }

    this.isSpinning = true;
    //console.log(demande);

    this.demandeService.save(demande).subscribe(
      response =>{
        this.showSuccess = true;
        this.demandecache = false;
        this.isSpinning = false;
        localStorage.removeItem('demandeCourante');

      },error =>{
        this.isSpinning = false;
        //(console.log(error));
      }
    ) ;
  }

showConfirm(): void {
  this.modal.confirm({
    nzTitle: 'Deconnexion',
    nzOkText: 'Oui',
    nzContent: 'Voulez-vous vraiment vous déconnecter ?',
    nzOnOk: () => {
      this.logout();
    }
  });
}
logout(){
  this.authService.logout();
}
home(){
  this.router.navigateByUrl("/beneficiaire");
}
  onIndexChange(event: number): void {
    this.currentStepPosition = event;
  }
}
