import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {Demande} from 'src/app/model/demande';
import {DataService} from 'src/app/services/data_service/data_service';
import {environment} from 'src/environments/environment';
import {Beneficiaire} from "../../../model/beneficiaire";

@Component({
  selector: 'description-demande',
  templateUrl: './description-demande.component.html',
  styleUrls: ['./description-demande.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DescriptionDemandeComponent implements OnInit {
  subscription: Subscription = new Subscription;
  key1 = true;
  key2 = false;
  key3 = false;
  key4 = false;
  show: boolean = false;
  idBeneficiaire: number = 0;
  infoDemande: any;
  typeBeneficiaire: string = '';
  demande: any;
  beneficiaire: any;

  constructor(private data: DataService,
              // private pmoService:PmoService
  ) {
  }

  baseUrlFile = environment.baseUrlFile;

  @Input() demandeEx !: Demande

  @Output() connexionInfoChange = new EventEmitter<any>();

  ngOnInit(): void {
    if(this.demandeEx){
      this.demande = this.demandeEx
    }

    if (!this.demandeEx && localStorage.getItem('currentUser') != null) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
      console.log(this.infoDemande)
      this.typeBeneficiaire = currentUser.personne.beneficiaire.typeBeneficiaire;
      // //console.log(this.typeBeneficiaire);

      this.subscription=this.data.currentMessageBis.subscribe((data: Demande[]) => {
        //console.log(data);
        this.infoDemande = data ;
        this.demande = data || new Demande();
        // this.beneficiaire = data.demande?.beneficiaire || new Beneficiaire();
        // this.typeBeneficiaire = this.beneficiaire.typeBeneficiaire;

        // this.onGetBeneficiaireInfo(this.typeBeneficiaire.toLocaleLowerCase());
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

  /* onGetBeneficiaireInfo(typeBeneficiaire:string){
     this.pmoService.getBeneficiaireById(this.idBeneficiaire, typeBeneficiaire).subscribe((response) => {
       //console.log(response);
       // this.offers = response?.offres;
     })
   }*/

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
