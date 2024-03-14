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

@Component({
  selector: 'description-demande',
  templateUrl: './description-beneficiaire.component.html',
  styleUrls: ['./description-beneficiaire.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DescriptionBeneficiaireComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription;
  key1= true;
  key2= false;
  key3= false;
  key4= false;
  show: boolean = false;
  idBeneficiaire: number= 0;
  listDirigeants:any;
  listAssocies: any;
  region: ZoneGeographique = new ZoneGeographique();
  regionEntreprise: ZoneGeographique = new ZoneGeographique();

  constructor(private data: DataService, private pmoService:PmoService) { }

  //somme offre
  infoDemande : any;
  demande: any;
  beneficiaire: any;
  typeBeneficiaire: string='';
  contactAgent: any;
  personneContact: any;
  baseUrlFile = environment.baseUrlFile;

  @Input() beneficiaireEx !: Beneficiaire;

  @Output() connexionInfoChange = new EventEmitter<any>();

  ngOnInit(): void {
    if(this.beneficiaireEx){
      this.personneContact = this.beneficiaireEx?.personnes?.[0];
      this.beneficiaire = this.beneficiaireEx;
      if(this.beneficiaireEx.typeBeneficiaire)
      this.typeBeneficiaire = this.beneficiaireEx.typeBeneficiaire;
    }else{
      this.subscription=this.data.currentMessage.subscribe((data: InfoSelection) => {
        console.log(data);
        if(!this.beneficiaireEx)
          this.beneficiaire = data;
        console.log(this.baseUrlFile+this.beneficiaire?.scanCNIVerso)
        // if(this.beneficiaire.personnes.length>1){ // A revoir le moyen de recuperer le type contact
        //   this.contactAgent = this.beneficiaire.personnes[1];
        // }
        // else{
        //   this.contactAgent = this.beneficiaire.personnes[0];
        // }
        // if(this.demande?.financementObtenus?.length>0){
        //   this.show = true;
        // }
        // else{
        //   this.show = false;
        // }

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
        if(this.typeBeneficiaire=='PME' && this.beneficiaire?.activiteBeneficiaires[0]?.zoneGeographique){
          //console.log('here')
          this.onGetRegionActiviteInfo(this.beneficiaire?.activiteBeneficiaires[0]?.zoneGeographique.idParent);
        }
      });
    }
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
      //console.log(response);
      this.region = response;
      // this.offers = response?.offres;
    },
    (error)=>{
      console.log(error);
    })
  }

  onGetRegionActiviteInfo(idParent:number){
    this.pmoService.getRegionById(idParent).subscribe((response:any) => {
      //console.log(response);
      this.regionEntreprise = response;
      // this.offers = response?.offres;
    })
  }

  destroyModal(): void {
    // this.modal.destroy();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
