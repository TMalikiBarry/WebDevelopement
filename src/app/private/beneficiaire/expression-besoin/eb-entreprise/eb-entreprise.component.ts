import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DemandeFinancementComponent} from "./demande-financement/demande-financement.component";
import {
  DescriptionProjetEntrepriseComponent
} from "./description-projet-entreprise/description-projet-entreprise.component";
import {DemandeService} from "../../../../services/demande/demande.service";
import {Demande} from "../../../../model/demande";
import {Projet} from "../../../../model/projet";
import {MessageService} from "../../../../services/message/message-service.service";
import {AuthService} from "../../../../services/security/auth/auth.service";
import {Beneficiaire} from "../../../../model/beneficiaire";
import {FinancementObtenu} from "../../../../model/FinancementObtenu";
import {NzModalService} from "ng-zorro-antd/modal";
import {Router} from "@angular/router";
import {Subscription} from 'rxjs';
import {DataService} from 'src/app/services/data_service/data_service';
import {NzNotificationService} from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-eb-entreprise',
  templateUrl: './eb-entreprise.component.html',
  styleUrls: ['./eb-entreprise.component.scss']
})


export class EbEntrepriseComponent implements OnInit, OnDestroy {

  @ViewChild(DemandeFinancementComponent) demandeFinancement! : DemandeFinancementComponent;
  @ViewChild(DescriptionProjetEntrepriseComponent) descriptionProjet! : DescriptionProjetEntrepriseComponent;
  // step demande
  demande : any ;

  demandeBis : Demande = new Demande() ;

  // step descrition
  description : any ;

  // step emploi

  demandeForm: boolean = false;
  subscriptionBis: Subscription = new Subscription;
  subscription: Subscription = new Subscription;
  currentStepPosition : number = 0 ;
  showSuccess : boolean = false;
  showStep = false;
  demandecache : boolean = true;
  stepname: string =  '';
  showModel:boolean  = false;
  nouveaux?: Projet[];
  isSpinning: boolean = false;

  constructor(private  demandeService: DemandeService,
              private messageService: MessageService,
              private authService: AuthService,
              private data: DataService,
              private notificationService: NzNotificationService,
              private changeDetector : ChangeDetectorRef,
              private modal: NzModalService,
              private router: Router) { }

  ngOnInit(): void {
    this.subscription=this.data.currentMessageBis.subscribe((data: Demande) => {
      // console.log('Babs 2 ',data);
      this.demandeBis = data || new Demande();
      this.changeDetector.detectChanges();
    });

    this.subscriptionBis=this.data.messageForm.subscribe((data: string) => {
      // console.log('Babs message form',data);
      let stringValue = data;
      this.demandeForm = (stringValue =="true");
      // console.log(this.demandeForm);
    });
  }

  pre(){
    this.currentStepPosition-= 1 ;
  }

  next(){
    if(this.currentStepPosition == 1){
      console.log('test1');
      let benef = new Beneficiaire();
      let demandeRecuperee: Demande;
      if(localStorage.getItem('demandeCourante')) {
        console.log('test2');
        // demandeRecuperee = JSON.parse(<string>localStorage.getItem('demandeCourante'));
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
        benef.id = currentUser.idParent;
        // if (!(this.description || demandeRecuperee.beneficiaire?.id == benef.id)) {
        if (!(this.description) || !this.demandeForm) {
          console.log('test3');
          this.stepname = "la description du projet";
          this.data.changeMessageString(this.stepname);
          this.showModel = true;
          return;
        }
        else {
          this.showModel = false;
        }
      }
      else{
        console.log('test4');
        if(!this.description || !this.demandeForm){
          console.log('test5');
          this.stepname = "la description du projet";
          this.data.changeMessageString(this.stepname);
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
    console.log(this.demandeBis);

    console.log(this.demande);

    console.log(this.description);

    // let demande = new Demande();
    this.demandeBis.typeDemande = this.demande.typefinancement;
    this.demandeBis.montant = parseInt(this.demande.montantdemande?.replace(/\s/g, "")) ;
    //this.demandeBis.cout = parseInt(this.demande.cout?.replace(/\s/g, "")) ;
    //this.demandeBis.apport = this.demande.apport ;
   // this.demandeBis.garantie = this.demande.garantie? JSON.parse(this.demande.garantie):null;
    //this.demandeBis.valeurGarantie = parseInt(this.demande.valeurGarantie?.replace(/\s/g, "")) ;
    this.demandeBis.tauxInteretAnnuelleSouhaite = this.demande.tauxInteret ;
    // demande.tauxInteretAnnuelleApplicable = this.demande.typeFinancement ;
    this.demandeBis.duree = this.demande.duree ;
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
      console.log(fin.dateMepFinancement);
      finTemp.institutionFinanciere = fin.institutionFinanciere ;
      finTemp.autreInstitutionFinanciere = fin.autreInstitution;
      finTemp.typeCredit = fin.typeCredit ;
      finTemp.dateFinancement = new Date(fin.dateMepFinancement) ;
      finTemp.tableauAmortissement = fin.tableauFinancementNom ;
      finTemp.dateRemboursement = new Date(fin.dateRemboursement );
      finTemp.statusFinancement = fin.statutFinancement ;
      finTemp.montant = parseInt((fin.montant+'')?.replace(/\s/g, "")) ;

      //finTemp.dateMiseADisposition =new Date(this.demande.dateMepFinancement)  ;
      // demande.dateSignatureAccord = this.demande.typeFinancement ;
      //demande.categorie = this.demande.typeFinancement ;
     // demande.montantOctroye = this.demande.montant ;
      //demande.garantieDemandes = this.demande.typeFinancement ;
      // demande.dureeCredit = this.demande.typeFinancement ;
      finTemp.tauxInteretAnnuelHT = fin.tauxInteretHt;
      financements.push(finTemp)
    }


    this.demandeBis.financementObtenus = financements;


    let projet = new Projet();
    if(!this.description) {
      let benef = new Beneficiaire();
      let demandeRecuperee: Demande;

      demandeRecuperee = JSON.parse(<string>localStorage.getItem('demandeCourante'));
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
      benef.id = currentUser.idParent;
      console.log(demandeRecuperee);
      console.log(benef.id);
      console.log(demandeRecuperee.beneficiaire?.id);
      console.log(demandeRecuperee.beneficiaire?.id == benef.id);
      if (demandeRecuperee.beneficiaire?.id == benef.id) {
        this.nouveaux = demandeRecuperee.projets;
        // @ts-ignore
        console.log(demandeRecuperee.projets[0]);
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
      projet.nombreEmploisAdditionnelPermanent = this.description.nombreEmploiAdditionnelPermanent;
      projet.nombreFemmePrevuePermanent = this.description.nombreFemmesPrevuPermanent;
      projet.pourcentageFemmePermanent = this.description.pourcentageFemmePermanent?.replace('%','');
      // projet.pourcentageFemmePermanent = this.description.pourcentageFemmePermanent;
      projet.nombreJeunePermanent = this.description.nombreJeunesPermanent;
      projet.pourcentageJeunePermanent = this.description.pourcentageJeunesPermanent?.replace('%','');
      // projet.pourcentageJeunePermanent = this.description.pourcentageJeunesPermanent;
      projet.nombreEmploisNonPermanent = this.description.employesNonPermanents ? JSON.parse(this.description.employesNonPermanents) : null;
      projet.nombreEmploisAdditionnelNonPermanent = this.description.NombreEmploisAdditionnelsNonPermanent;
      projet.nombreFemmePrevueNonPermanent = this.description.NombreFemmesPrevuNonPermanent;
      projet.pourcentageFemmeNonPermanent = this.description.PourentageFemmesNonPermanent?.replace('%','');
      // projet.pourcentageFemmeNonPermanent = this.description.PourentageFemmesNonPermanent;
      projet.nombreJeuneNonPermanent = this.description.NombreJeunesNonPermanent;
      projet.pourcentageJeuneNonPermanent = this.description.PourcentageJeunesNonPermanent?.replace('%','');
      projet.cout = this.demande.coutProjet?.replace(/\s/g, "");
      // projet.pourcentageJeuneNonPermanent = this.description.PourcentageJeunesNonPermanent;
    }
  //   console.log(projet);
  // console.log(this.demandeBis.projets)
    this.demandeBis.projets = [];
    this.demandeBis.projets?.push(projet);
    console.log(this.demandeBis.projets?.length);

    //insertion beneficiaire
    let beneficiaire = new Beneficiaire();
    if(localStorage.getItem('currentUser') != null) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
      beneficiaire.id = currentUser.idParent;
      this.demandeBis.beneficiaire = beneficiaire;
    }
    this.isSpinning = true;
    console.log(this.demandeBis);
    this.demandeService.update(this.demandeBis).subscribe(
      response =>{
        console.log(response)
        this.showStep = false;
        this.showSuccess = true;
        this.demandecache = false;
        this.isSpinning = false;
        localStorage.removeItem('demandeCourante');

      },error =>{
        this.isSpinning = false;
        if(error?.error?.errorMessage){
          this.notificationService.error('Erreur', error?.error?.errorMessage);
        }
        else{
          this.notificationService.error('Erreur','Une erreur est survenue, veuillez reessayer plus tard svp');
        }
        (console.log(error));
      });
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

  ngOnDestroy(): void {
    localStorage.removeItem('demandeCourante');
    this.subscription.unsubscribe();
    this.subscriptionBis.unsubscribe();
  }

}
