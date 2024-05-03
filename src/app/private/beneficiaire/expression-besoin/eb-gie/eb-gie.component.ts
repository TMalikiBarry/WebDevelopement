import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DemandeFinancementGieComponent} from "./demande-financement-gie/demande-financement-gie.component";
import {DescriptionProjetGieComponent} from "./description-projet-gie/description-projet-gie.component";
import {Demande} from "../../../../model/demande";
import {Beneficiaire} from "../../../../model/beneficiaire";
import {Projet} from "../../../../model/projet";
import {DemandeService} from "../../../../services/demande/demande.service";
import {MessageService} from "../../../../services/message/message-service.service";
import {FinancementObtenu} from "../../../../model/FinancementObtenu";
import {AuthService} from "../../../../services/security/auth/auth.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {Router} from "@angular/router";
import {Subscription} from 'rxjs';
import {DataService} from 'src/app/services/data_service/data_service';


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

  demandeBis : Demande = new Demande() ;

  // step emploi

  emploiPermanent : any;

  emploiNonPermanent : any;
  showSuccess : boolean = false;
  showStep : boolean = true;
  demandecache : boolean = true;
  currentStepPosition : number = 0 ;
  stepname: string =  '';
  showModel:boolean  = false;
  nouveaux?: Projet[];
  isSpinning: boolean = false;
  demandeForm: boolean = false;
  subscriptionBis: Subscription = new Subscription;
  subscription: Subscription = new Subscription;

  constructor(private  demandeService: DemandeService,
              private messageService: MessageService,
              private authService: AuthService,
              private modal: NzModalService,
              private data: DataService,
              private changeDetector : ChangeDetectorRef,
              private router: Router ){ }

  ngOnInit(): void {
    this.subscription=this.data.currentMessageBis.subscribe((data: Demande) => {
      console.log('Babs 2 ',data);
      this.demandeBis = data || new Demande();
      this.changeDetector.detectChanges();
    });

    this.subscriptionBis=this.data.messageForm.subscribe((data: string) => {
      console.log('Babs message form',data);
      let stringValue = data;
      this.demandeForm = (stringValue =="true");
      // console.log(this.demandeForm);
    });
  }

  pre(){
    this.currentStepPosition-= 1 ;
  }

  next(){
  console.log(this.currentStepPosition)
    if(this.currentStepPosition == 1){

      let benef = new Beneficiaire();
      let demandeRecuperee: Demande;
      if (this.authService.storage.getItem('demandeCourante')) {
        demandeRecuperee = JSON.parse(<string>this.authService.storage.getItem('demandeCourante'));
        const currentUser = JSON.parse(this.authService.storage.getItem('currentUser') || '');
        benef.id = currentUser.idParent;
        // if (!(this.description || demandeRecuperee.beneficiaire?.id == benef.id)) {
        if (!(this.description) || !this.demandeForm) {
          this.stepname = "la description du projet";
          this.data.changeMessageString(this.stepname);
          this.showModel = true;
          return;
        } else {
          this.showModel = false;
        }
      }else{
        if(!this.description || !this.demandeForm){
          this.stepname = "la description du projet";
          this.data.changeMessageString(this.stepname);
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
    console.log(this.demandeBis);

    console.log(this.demande);

    console.log(this.description);

    // let demande = new Demande();
    this.demandeBis.typeDemande = this.demande.typefinancement;
    this.demandeBis.montant =  parseInt(this.demande.montantdemande?.replace(/\s/g, "")) ;
    //this.demandeBis.cout = parseInt(this.demande.cout?.replace(/\s/g, "")) ;
    //this.demandeBis.apport = this.demande.apport ;
    //this.demandeBis.garantie = this.demande.garantie? JSON.parse(this.demande.garantie):null;
    //this.demandeBis.valeurGarantie = parseInt(this.demande.valeurGaranties?.replace(/\s/g, "")) ;
    this.demandeBis.tauxInteretAnnuelleSouhaite = this.demande.tauxInteret ;
    this.demandeBis.nombreMembresConcernes = this.demande.nombreMembresConcernes ;
    this.demandeBis.montantDemandeParMembre = this.demande.montantDemandeParMembre;
    this.demandeBis.duree = this.demande.duree ;

    //demande.financementObtenue = this.demande.typeFinancement ;

    // setting list financements
    let financements: FinancementObtenu[] =[];
    for(let fin of this.demande.listeFinancement){
      let finTemp = new FinancementObtenu()
      finTemp.institutionFinanciere = fin.institutionFinanciere ;
      finTemp.autreInstitutionFinanciere= fin.autreInstitution ;
      finTemp.typeCredit = fin.typeCredit ;
      finTemp.dateFinancement = new Date(fin.datemepFinancement) ;
      finTemp.tableauAmortissement = fin.tableauFinancementNom ;
      console.log(fin.tableauFinancementNom);
      finTemp.dateRemboursement = new Date(fin.dateRemboursement);
      finTemp.statusFinancement = fin.statutFinancement ;
   //   finTemp.dateMiseADisposition =new Date(this.demande.datemepFinancement)  ;
      // demande.dateSignatureAccord = this.demande.typeFinancement ;
      //demande.categorie = this.demande.typeFinancement ;
      finTemp.montant = parseInt((fin.montant+'')?.replace(/\s/g, ""));
      //demande.garantieDemandes = this.demande.typeFinancement ;
      // demande.dureeCredit = this.demande.typeFinancement ;
     finTemp.tauxInteretAnnuelHT = fin.tauxInteretHT ;
      financements.push(finTemp)
    }
    this.demandeBis.financementObtenus = financements;


    let projet = new Projet();
    if(!this.description) {
      let benef = new Beneficiaire();
      let demandeRecuperee: Demande;

      demandeRecuperee = JSON.parse(<string>this.authService.storage.getItem('demandeCourante'));
      const currentUser = JSON.parse(this.authService.storage.getItem('currentUser') || '');
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
    this.demandeBis.projets = [];
    this.demandeBis.projets?.push(projet);


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
        this.showStep = false;
        this.showSuccess = true;
        this.demandecache = false;
        this.isSpinning = false;
        localStorage.removeItem('demandeCourante');

      },error =>{
        this.isSpinning = false;
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
