import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DemandeService} from "../../../../services/demande/demande.service";
import {MessageService} from "../../../../services/message/message-service.service";
import {Demande} from "../../../../model/demande";
import {Projet} from "../../../../model/projet";
import {ExpressionBesoinComponent} from "./expression-besoin/expression-besoin.component";
import {DescriptionProjetComponent} from "./description-projet/description-projet.component";
import {Beneficiaire} from "../../../../model/beneficiaire";
import {AuthService} from "../../../../services/security/auth/auth.service";
import {FinancementObtenu} from "../../../../model/FinancementObtenu";
import {NzModalService} from "ng-zorro-antd/modal";
// import {TypeFinancement} from "../../../../model/type-financement";
import {Router} from "@angular/router";
import {DataService} from 'src/app/services/data_service/data_service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-eb-micro-entreprise',
  templateUrl: './eb-micro-entreprise.component.html',
  styleUrls: ['./eb-micro-entreprise.component.scss']
})
export class EbMicroEntrepriseComponent implements OnInit, OnDestroy {
  @ViewChild(ExpressionBesoinComponent) demandeFinancement! : ExpressionBesoinComponent
  @ViewChild(DescriptionProjetComponent) descriptionProjet! : DescriptionProjetComponent

  constructor(private  demandeService: DemandeService,
              private messageService: MessageService,
              private authService: AuthService,
              private changeDetector : ChangeDetectorRef,
              private data: DataService,
              private modal: NzModalService,
              private router: Router) { }

  currentStepPosition : number = 0 ;

  // step demande
  demande : any ;

  demandeBis : Demande = new Demande() ;

  // step descrition
  description : any ;

  // step emploi
  subscription: Subscription = new Subscription;
  demandeForm: boolean = false;
  showStep : boolean = true;
  subscriptionBis: Subscription = new Subscription;
  emploiPermanent : any;
  emploiNonPermanent : any;
  showSuccess : boolean = false;
  demandecache : boolean = true;
  stepname: string =  '';
  showModel:boolean  = false;
  nouveaux?: Projet[];
  isSpinning: boolean = false;

  ngOnInit(): void {
    this.subscription=this.data.currentMessageBis.subscribe((data: Demande) => {
      //console.log('Babs 2 ',data);
      this.demandeBis = data || new Demande();
      this.changeDetector.detectChanges();
    });

    this.subscriptionBis=this.data.messageFormMe.subscribe((data: string) => {
      console.log('Babs message form',data);
      let stringValue = data;
      this.demandeForm = (stringValue =="true");
      console.log(this.demandeForm);
    });
  }

  pre(){
    this.currentStepPosition-= 1 ;
  }

  next(){
    console.log('test1');
    if(this.currentStepPosition === 1) {
      console.log('test2');
      let benef = new Beneficiaire();
      let demandeRecuperee: Demande;
      if (this.authService.storage.getItem('demandeCourante')) {
        demandeRecuperee = JSON.parse(<string>this.authService.storage.getItem('demandeCourante'));
        const currentUser = JSON.parse(this.authService.storage.getItem('currentUser') || '');
        benef.id = currentUser.idParent;
        if (!(this.description || !this.demandeForm)) {
          console.log('test3');
          this.stepname = "la description du projet";
          this.data.changeMessageString(this.stepname);
          this.showModel = true;
          return;
        } else {
          this.showModel = false;
        }
      }else{
        console.log('test4');
        if(!this.description || !this.demandeForm){
          console.log('test5');
          this.stepname = "la description du projet";
          this.data.changeMessageString(this.stepname);
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

    // let demande = new Demande();
    //console.log(this.demandeBis);

    // console.log(this.demande);

    //console.log(this.description);

    this.demandeBis.typeDemande = this.demande.typefinancement;
    this.demandeBis.montant = parseInt(this.demande.montantdemande?.replace(/\s/g, "")) ;
   // this.demandeBis.cout = parseInt(this.demande.cout?.replace(/\s/g, "")) ;
    //this.demandeBis.apport = this.demande.apport ;
    //this.demandeBis.garantie = this.demande.garanties? JSON.parse(this.demande.garanties):null;
    //this.demandeBis.valeurGarantie = parseInt(this.demande.valeurGaranties?.replace(/\s/g, ""));
    this.demandeBis.tauxInteretAnnuelleSouhaite = this.demande.tauxInteret ;
    // demande.tauxInteretAnnuelleApplicable = this.demande.typeFinancement ;
    this.demandeBis.duree = this.demande.duree ;

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
      finTemp.montant =  parseInt((''+fin.montant)?.replace(/\s/g, "")) ;
      finTemp.autreInstitutionFinanciere = fin.autreInstitution;
      //demande.garantieDemandes = this.demande.typeFinancement ;
      // demande.dureeCredit = this.demande.typeFinancement ;
      finTemp.tauxInteretAnnuelHT = fin.tauxInteretHT ;
     financements.push(finTemp)
    }
    this.demandeBis.financementObtenus = financements;

    let projet = new Projet();
    if(!this.description) {
      //console.log('babs 2');
      let benef = new Beneficiaire();
      let demandeRecuperee: Demande;

      demandeRecuperee = JSON.parse(<string>this.authService.storage.getItem('demandeCourante'));
      const currentUser = JSON.parse(this.authService.storage.getItem('currentUser') || '');
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
      //console.log('babs 1');
      projet.description = this.description.descriptionProjet;
      projet.cout = this.description.coutProjet;
      projet.businessPlan = this.description.bussinessPlanNom;
      // projet.complementInformations?.push(this.description.complementInfoNom);
      for(let complementInfo of this.description.complementInfoNom){
        projet.complementInformations?.push(complementInfo);
      }

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

    this.demandeBis.projets = [];
    this.demandeBis.projets?.push(projet);
    //console.log(this.demandeBis.projets?.length);

    //insertion beneficiaire
    let beneficiaire = new Beneficiaire();
    if(localStorage.getItem('currentUser') != null) {
      const currentUser = JSON.parse(this.authService.storage.getItem('currentUser') || '');
      beneficiaire.id = currentUser.idParent;
      this.demandeBis.beneficiaire = beneficiaire;
    }
      console.log(this.demandeBis);
    this.isSpinning = true;
    this.demandeService.update(this.demandeBis).subscribe(

      response =>{
        this.isSpinning = false;
        //console.log(response);
        this.showStep = false;
        this.showSuccess = true;
        this.demandecache = false;
        localStorage.removeItem('demandeCourante');

      },(error) => {
        //console.log(error)
        this.isSpinning = false;
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








