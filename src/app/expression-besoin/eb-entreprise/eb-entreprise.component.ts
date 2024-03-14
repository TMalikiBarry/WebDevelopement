import {Component, OnInit, ViewChild} from '@angular/core';
import {DemandeFinancementComponent} from "./demande-financement/demande-financement.component";
import {DescriptionProjetEntrepriseComponent} from "./description-projet-entreprise/description-projet-entreprise.component";
import {DemandeService} from "../../services/demande/demande.service";
import {Demande} from "../../model/demande";
import {Projet} from "../../model/projet";
import {MessageService} from "../../services/message/message-service.service";
import {AuthService} from "../../services/security/auth/auth.service";
import {Beneficiaire} from "../../model/beneficiaire";
import {FinancementObtenu} from "../../model/FinancementObtenu";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-eb-entreprise',
  templateUrl: './eb-entreprise.component.html',
  styleUrls: ['./eb-entreprise.component.scss']
})


export class EbEntrepriseComponent implements OnInit {

  @ViewChild(DemandeFinancementComponent) demandeFinancement! : DemandeFinancementComponent;
  @ViewChild(DescriptionProjetEntrepriseComponent) descriptionProjet! : DescriptionProjetEntrepriseComponent;
  // step demande
  demande : any ;

  // step descrition
  description : any ;

  // step emploi

  emploiPermanent : any;
  idPmo: any;
  idBeneficiaire: any;
  emploiNonPermanent : any;
  currentStepPosition : number = 0 ;
  showSuccess : boolean = false;
  demandecache : boolean = true;
  stepname: string =  '';
  showModel:boolean  = false;
  nouveaux?: Projet[];
  isSpinning: boolean = false;

  constructor(private  demandeService: DemandeService,
              private messageService: MessageService,
              private authService: AuthService,
              private modal: NzModalService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.idPmo = this.activatedRoute.snapshot.params.pmo;
    this.idBeneficiaire = this.activatedRoute.snapshot.params.idBenef;
    // console.log('idpmo recu', this.idPmo);
    // console.log('idbenef recu', this.idBeneficiaire);
  }

  pre(){
    this.currentStepPosition-= 1 ;
  }

  next(){
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

      this.sendEntrepriseInfo();
      return ;
    }

    this.currentStepPosition+= 1 ;
  }

  done(){}
  sendEntrepriseInfo() {
    let demande = new Demande();
    demande.typeDemande = this.demande.typefinancement;
    demande.montant = parseInt(this.demande.montantdemande?.replace(/\s/g, "")) ;
    //demande.cout = parseInt(this.demande.cout?.replace(/\s/g, "")) ;
    //demande.apport = this.demande.apport ;
   // demande.garantie = this.demande.garantie? JSON.parse(this.demande.garantie):null;
    //demande.valeurGarantie = parseInt(this.demande.valeurGarantie?.replace(/\s/g, "")) ;
    demande.tauxInteretAnnuelleSouhaite = this.demande.tauxInteret ;
    // demande.tauxInteretAnnuelleApplicable = this.demande.typeFinancement ;
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
      finTemp.autreInstitutionFinanciere = fin.autreInstitution;
      finTemp.typeCredit = fin.typeCredit ;
      finTemp.dateFinancement = new Date(fin.dateMepFinancement) ;
      finTemp.tableauAmortissement = fin.tableauFinancementNom ;
      finTemp.dateRemboursement = new Date(fin.dateRemboursement );
      finTemp.statusFinancement = fin.statutFinancement ;
      finTemp.montant = parseInt(fin.montant?.replace(/\s/g, "")) ;

      //finTemp.dateMiseADisposition =new Date(this.demande.dateMepFinancement)  ;
      // demande.dateSignatureAccord = this.demande.typeFinancement ;
      //demande.categorie = this.demande.typeFinancement ;
     // demande.montantOctroye = this.demande.montant ;
      //demande.garantieDemandes = this.demande.typeFinancement ;
      // demande.dureeCredit = this.demande.typeFinancement ;
      finTemp.tauxInteretAnnuelHT = fin.tauxInteretHt;
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
      for(let complementInfo of this.description.complementInfoNom){
        projet.complementInformations?.push(complementInfo);
      }
      // projet.complementInformations?.push(this.description.complementInfoNom);
      projet.nombreEmploisPermanent = this.description.employesPermanents ? JSON.parse(this.description.employesPermanents) : null;
      projet.nombreEmploisAdditionnelPermanent = this.description.nombreEmploiAdditionnelPermanent;
      projet.nombreFemmePrevuePermanent = this.description.nombreFemmesPrevuPermanent;
      projet.pourcentageFemmePermanent = this.description.pourcentageFemmePermanent?.replace('%','');
      projet.nombreJeunePermanent = this.description.nombreJeunesPermanent;
      projet.pourcentageJeunePermanent = this.description.pourcentageJeunesPermanent?.replace('%','');
      projet.nombreEmploisNonPermanent = this.description.employesNonPermanents ? JSON.parse(this.description.employesNonPermanents) : null;
      projet.nombreEmploisAdditionnelNonPermanent = this.description.NombreEmploisAdditionnelsNonPermanent;
      projet.nombreFemmePrevueNonPermanent = this.description.NombreFemmesPrevuNonPermanent;
      projet.pourcentageFemmeNonPermanent = this.description.PourentageFemmesNonPermanent?.replace('%','');
      projet.nombreJeuneNonPermanent = this.description.NombreJeunesNonPermanent;
      projet.pourcentageJeuneNonPermanent = this.description.PourcentageJeunesNonPermanent?.replace('%','');
      projet.cout = this.demande.coutProjet?.replace(/\s/g, "");
    }
    //console.log(projet);
  //console.log(demande.projets)
    demande.projets?.push(projet);
    //console.log(demande);

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
    console.log(demande);
    this.demandeService.save(demande).subscribe(
      response =>{
        console.log(response)
        this.showSuccess = true;
        this.demandecache = false;
        this.isSpinning = false;
        localStorage.removeItem('demandeCourante');

      },error =>{
        this.isSpinning = false;
        (console.log(error));
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
