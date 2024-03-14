import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DemandeService} from "../../services/demande/demande.service";
import {MessageService} from "../../services/message/message-service.service";
import {Demande} from "../../model/demande";
import {Projet} from "../../model/projet";
import {ExpressionBesoinComponent} from "./expression-besoin/expression-besoin.component";
import {DescriptionProjetComponent} from "./description-projet/description-projet.component";
import {Beneficiaire} from "../../model/beneficiaire";
import {AuthService} from "../../services/security/auth/auth.service";
import {FinancementObtenu} from "../../model/FinancementObtenu";
import {NzModalService} from "ng-zorro-antd/modal";

import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-eb-micro-entreprise',
  templateUrl: './eb-micro-entreprise.component.html',
  styleUrls: ['./eb-micro-entreprise.component.scss']
})
export class EbMicroEntrepriseComponent implements OnInit {
  @ViewChild(ExpressionBesoinComponent) demandeFinancement! : ExpressionBesoinComponent
  @ViewChild(DescriptionProjetComponent) descriptionProjet! : DescriptionProjetComponent
@Input() beneficiairetp !: Beneficiaire

  constructor(private  demandeService: DemandeService,
              private messageService: MessageService,
              private authService: AuthService,
              private modal: NzModalService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }
  currentStepPosition : number = 0 ;

  // step demande
  demande : any ;

  // step descrition
  description : any ;

  // step emploi
  idPmo: any;
  idBeneficiaire: any;
  emploiPermanent : any;
  emploiNonPermanent : any;
  showSuccess : boolean = false;
  demandecache : boolean = true;
  stepname: string =  '';
  showModel:boolean  = false;
  nouveaux?: Projet[];
  isSpinning: boolean = false;

  ngOnInit(): void {
    console.log(this.beneficiairetp)
    if (this.beneficiairetp){
      this.idBeneficiaire = this.beneficiairetp.id
    }else{
      this.idPmo = this.activatedRoute.snapshot.params.pmo;
      this.idBeneficiaire = this.activatedRoute.snapshot.params.idBenef;
    }
    // console.log('idpmo recu', this.idPmo);
    // console.log('idbenef recu', this.idBeneficiaire);
  }

  pre(){
    this.currentStepPosition-= 1 ;
  }

  next(){
    if(this.currentStepPosition === 1) {
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

      this.sendMicroEntrePreneursInfo();
      return;
    }
    this.currentStepPosition+= 1
  }


  done(){}

  sendMicroEntrePreneursInfo(){

    let demande = new Demande();

    demande.typeDemande = this.demande.typefinancement;
    demande.montant = parseInt(this.demande.montantdemande?.replace(/\s/g, "")) ;
    //demande.apport = this.demande.apport ;
    //demande.garantie = this.demande.garanties? JSON.parse(this.demande.garanties):null;
    //demande.valeurGarantie = parseInt(this.demande.valeurGaranties?.replace(/\s/g, ""));
    demande.tauxInteretAnnuelleSouhaite = this.demande.tauxInteret ;
    // demande.tauxInteretAnnuelleApplicable = this.demande.typeFinancement ;
    demande.duree = this.demande.duree ;
    //demande.financementObtenue = this.demande.typeFinancement ;

    // demande.dateSignatureAccord = this.demande.typeFinancement ;
    //demande.categorie = this.demande.typeFinancement ;
   // demande.montantOctroye = this.demande.montant ;
    //demande.garantieDemandes = this.demande.typeFinancement ;
    // demande.dureeCredit = this.demande.typeFinancement ;
   // demande.tauxInteretAnnuelHT = this.demande.tauxInteretHT ;
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
      finTemp.typeCredit = fin.typeCredit ;
      finTemp.dateFinancement = new Date(fin.datemepFinancement) ;
      finTemp.tableauAmortissement = fin.tableauFinancementNom ;
      finTemp.dateRemboursement = new Date(fin.dateRemboursement);
      finTemp.statusFinancement =fin.statutFinancement ;
      finTemp.montant =  parseInt(fin.montant?.replace(/\s/g, "")) ;
      finTemp.autreInstitutionFinanciere = fin.autreInstitution;
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
    }else{
      projet.description = this.description.descriptionProjet;
     // projet.cout = this.description.coutProjet;
      projet.businessPlan = this.description.bussinessPlanNom;

      for(let complementInfo of this.description.complementInfoNom){
        projet.complementInformations?.push(complementInfo);
      }
      //projet.complementInformations?.push(this.description.complementInfoNom);

      projet.nombreEmploisPermanentMe = this.description.employesPermanents;
      projet.nombreEmploisAdditionnelPermanent = this.description.nombreEmploiAdditionnelsPermanent;
      projet.nombreFemmePrevuePermanent = this.description.nombreFemmesPrevuPermanent;
      projet.pourcentageFemmePermanent = this.description.pourcentageFemmePermanent?.replace('%','');
      projet.nombreJeunePermanent = this.description.nombreJeunesPermanent;
      projet.pourcentageJeunePermanent = this.description.pourcentageJeunesPermanent?.replace('%','');

      projet.nombreEmploisNonPermanentMe = this.description.employesNonPermanents;
      projet.nombreEmploisAdditionnelNonPermanent = this.description.NombreEmploisAdditionnelsNonPermanent;
      projet.nombreFemmePrevueNonPermanent = this.description.NombreFemmesPrevusNonPermanent;
      projet.pourcentageFemmeNonPermanent = this.description.PourentageFemmessNonPermanent?.replace('%','');
      projet.nombreJeuneNonPermanent = this.description.NombreJeunessNonPermanent;
      projet.pourcentageJeuneNonPermanent = this.description.PourcentageJeunessNonPermanent?.replace('%','');
      projet.cout = this.demande.coutProjet?.replace(/\s/g, "");
    }


    demande.projets?.push(projet);
    console.log(projet,demande)
    //console.log(demande.projets?.length);

    //insertion beneficiaire
    let beneficiaire = new Beneficiaire();
    if(this.idBeneficiaire){ // Creation issue du PMO
      beneficiaire.id = this.idBeneficiaire;
      demande.beneficiaire = beneficiaire;
    } else{
      if(localStorage.getItem('currentUser') != null) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
        beneficiaire.id = currentUser.idParent;
        demande.beneficiaire = beneficiaire;
      }
    }
      //console.log(demande);
    this.isSpinning = true;
    this.demandeService.save(demande).subscribe(

      response =>{
        this.isSpinning = false;
        //console.log(response);
        this.showSuccess = true;
        this.demandecache = false;
        localStorage.removeItem('demandeCourante');

      },(error) => {
        //console.log(error)
        this.isSpinning = false;
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








