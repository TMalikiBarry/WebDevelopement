import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { Beneficiaire } from 'src/app/model/beneficiaire';
import { Demande } from 'src/app/model/demande';
import { InfoSelection } from 'src/app/model/info-selection';
import { Offre } from 'src/app/model/offre';
import { ZoneGeographique } from 'src/app/model/zone-geographique';
import { DataService } from 'src/app/services/data_service/data_service';
import { PmoService } from 'src/app/services/pmo/pmo.service';
import { environment } from 'src/environments/environment';
import {TemplateAF} from "../../../model/templateAF";
import {TouchPointService} from "../../../services/touch-point/touch-point.service";
import {AuthService} from "../../../services/security/auth/auth.service";

@Component({
  selector: 'description-demande',
  templateUrl: './description-demande.component.html',
  styleUrls: ['./description-demande.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DescriptionDemandeComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription;
  key1= true;
  key2= false;
  key3= false;
  key4= false;
  key5= false;
  key6= false;
  key7= false;
  key8= false;
  key9= false;
  key10= false;
  key11= false;
  key12= false;
  key13= false;
  isSpinningHistorique = true;
  show: boolean = false;
  idBeneficiaire: number= 0;
  listDirigeants:any;
  listTemplate:any;
  listOfDisplayDataOffers: any;
  listAssocies: any;
  notifications: any;
  commentaires: any;
  commentairePMO: any;
  commentaireRecu: any;
  commentaireAprouve: any;
  commentaireRejete: any;
  commentaireinitDec: any;
  commentaireClosDec: any;
  commentaireinitRem: any;
  commentaireClosRem: any;
  listeOffres : any;
  region: ZoneGeographique = new ZoneGeographique();
  regionEntreprise: ZoneGeographique = new ZoneGeographique();

  constructor(private data: DataService,
              private pmoService:PmoService,
              public auth :AuthService,
              private touchPointService: TouchPointService,) { }

  //somme offre
  infoDemande : any;
  demande: any;
  beneficiaire: any;
  template?: TemplateAF | null;
  typeBeneficiaire: string='';
  contactAgent: any;
  personneContact: any;
  baseUrlFile = environment.baseUrlFile;

  @Output() connexionInfoChange = new EventEmitter<any>();

  @Input() demandeEx !: Demande
  @Input() beneficiaireEx !: Beneficiaire

  ngOnInit(): void {
    if(this.demandeEx){
      this.touchPointService.getAllTemplate().subscribe(data => {
        this.listTemplate = data as TemplateAF[]
        this.getTemplate(this.demandeEx)
      })
    }
    this.subscription=this.data.currentMessage.subscribe((data: InfoSelection) => {
      console.log(data);
      if(this.beneficiaireEx){
        console.log(this.beneficiaireEx)
        this.demande = this.beneficiaireEx?.demandes
        this.infoDemande = this.demande ;
        this.beneficiaire = this.beneficiaireEx;
      }else if(this.demandeEx){
        this.demande = this.demandeEx
        this.infoDemande = this.demande ;
        this.beneficiaire = this.demande?.beneficiaire;
      }else{
        this.infoDemande = data ;
        this.demande = data.demande || new Demande();
        this.beneficiaire = data.demande?.beneficiaire || new Beneficiaire();
      }
      this.onGetNotificationInfo(this.demande.id);
      this.commentaires = this.demande.commentaires;
      if(this.commentaires !== undefined && this.commentaires.length != 0){

        this.commentairePMO = this.commentaires.filter((item: any) => item.comment.startsWith('pmo'));
        this.commentaireAprouve = this.commentaires.filter((item: any) => item.status.startsWith("RECU") && !item.comment.startsWith('pmo') );
        this.commentaireinitDec =  this.commentaires.filter((item: any) => item.status.startsWith("APPROUVE"));
        this.commentaireClosDec  =  this.commentaires.filter((item: any) => item.status.startsWith("DECAISSE_START"));
        this.commentaireinitRem  =  this.commentaires.filter((item: any) => item.status.startsWith("DECAISSE_DONE"));
        this.commentaireClosRem  =  this.commentaires.filter((item: any) => item.status.startsWith("REMBOURSEMENT_START"));

      }
     this.listOfDisplayDataOffers = data.offre;
      if (!data.offre && this.auth.currentUserValue.idParent === 11){
        this.pmoService.searchDemandeById(this.demande?.id?.toString()).subscribe(data1 =>{
          if(data1?.offres)
            this.listOfDisplayDataOffers = data1.offres
        })
      }

    /*  console.log(this.commentaires);
      console.log("this.commentaires !== undefined    " + (this.commentaires !== undefined));
      console.log("!this.commentaires.isEmpty     " + (this.commentaires.length == 0));
      console.log("ngif" + ((this.commentaires !== undefined) && !(this.commentaires.length == 0)))*/
      // if(this.beneficiaire.personnes.length>1){ // A revoir le moyen de recuperer le type contact
      //   this.contactAgent = this.beneficiaire.personnes[1];
      // }
      // else{
      //   this.contactAgent = this.beneficiaire.personnes[0];
      // }
      if(this.demande?.financementObtenus?.length>0){
        this.show = true;
      }
      else{
        this.show = false;
      }

      let listContact = this.beneficiaire.personnes?.filter((item:any) =>
      {return item.typePersonnes?.map(function(e:any) {
        // //console.log(e);
        return e.code; }).indexOf("CONTACT")!==-1

      });
      // //console.log(listContact);
      if (listContact && listContact.length>0) {
        this.personneContact = listContact[0];
      }
      // //console.log(this.personneContact);

      let listAgent = this.beneficiaire.personnes?.filter((item:any) =>
      {return item.typePersonnes?.map(function(e:any) {
        // //console.log(e);
        return e.code; }).indexOf("AGENT")!==-1

      });
      // //console.log(listAgent);
      if (listAgent && listAgent.length>0) {
        this.contactAgent = listAgent[0];
      }


      this.getDirigeants()

      this.listAssocies = this.beneficiaire.personnes?.filter((item:any) =>
      {return item.typePersonnes?.map(function(e:any) {
        // //console.log(e);
        return e.code; }).indexOf("ASSOCIE")!==-1

      });

      // //console.log(this.listDirigeants);
      // this.listAssocies = demandes.filter((item: any) => item.statutDossier == "APPROUVE")
      this.idBeneficiaire = this.beneficiaire.id;
      this.typeBeneficiaire = this.beneficiaire.typeBeneficiaire;
      // this.onGetBeneficiaireInfo(this.typeBeneficiaire.toLocaleLowerCase());
      if(this.beneficiaire?.zoneGeographique?.idParent){
        this.onGetRegionInfo(this.beneficiaire?.zoneGeographique?.idParent);
      }

      if(this.typeBeneficiaire=='PME' && this.beneficiaire?.activiteBeneficiaires[0]?.zoneGeographique?.idParent){
        this.onGetRegionActiviteInfo(this.beneficiaire?.activiteBeneficiaires[0]?.zoneGeographique.idParent);
      }

    });

  }

  expandSet = new Set<string>();
  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  getDirigeants(){
    this.listDirigeants = this.beneficiaire.personnes?.filter((item:any) =>
    {return item.typePersonnes?.map(function(e:any) {
      // //console.log(e);
      return e.code; }).indexOf("DIRIGEANT")!==-1

    });
    if(this.listDirigeants.length < 0){
      this.beneficiaire.personnes?.filter((item:any) =>
      {return item.typePersonnes?.map(function(e:any) {
        // //console.log(e);
        return e.code; }).indexOf("CONTACT")!==-1

      });
    }
  }

  onGetRegionInfo(idParent:number){
    this.pmoService.getRegionById(idParent).subscribe((response:any) => {
      // console.log(response);
      this.region = response;
      // this.offers = response?.offres;
    },
    (error)=>{
      console.log(error);
    })
  }

  onGetNotificationInfo(idDemande:string){

    console.log('notification call '+idDemande);
    this.pmoService.getNotificationPMO(idDemande).subscribe((response:any) => {
      //  this.isSpinningHistorique = false;
      console.log(response);
      this.notifications = response.content;
      // this.offers = response?.offres;

    },
    (error)=>{
      console.log(error);
    })
  }

  onGetRegionActiviteInfo(idParent:number){
    this.pmoService.getRegionById(idParent).subscribe((response:any) => {
      // console.log(response);
      this.regionEntreprise = response;
      // this.offers = response?.offres;
    },
    (error)=>{
      console.log(error);
    })
  }

  // onGetBeneficiaireInfo(typeBeneficiaire:string){
  //   this.pmoService.getBeneficiaireById(this.idBeneficiaire, typeBeneficiaire).subscribe((response) => {
  //     //console.log(response);
  //     // this.offers = response?.offres;
  //   })
  // }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  destroyModal(): void {
    // this.modal.destroy();
  }

  getTemplate(data: Demande) {
    for (const tem of this.listTemplate) {
      if(data?.id === tem.demande?.id) {
        console.log(tem)
        this.template = tem
        return true;
      }
    }
    return false;
  }
}
