import {Component, NgModule, OnInit} from '@angular/core';
import {TouchPointService} from "../../../services/touch-point/touch-point.service";
import {Beneficiaire} from "../../../model/beneficiaire";
import {FormMicroEntrepreneursComponent }from "../../../formulaire/form-micro-entrepreneurs/form-micro-entrepreneurs.component";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {FormEntrepriseComponent} from "../../../formulaire/form-entreprise/form-entreprise.component";
import {FormGieComponent} from "../../../formulaire/form-gie/form-gie.component";
import {EbMicroEntrepriseComponent} from "../../../expression-besoin/eb-micro-entreprise/eb-micro-entreprise.component";
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableQueryParams,
  NzTableSortFn,
  NzTableSortOrder
} from "ng-zorro-antd/table";
import {CommonModule} from "@angular/common";
import {Demande} from "../../../model/demande";
import {DescriptionBeneficiaireComponent} from "../../pmo/description-beneficiaire/description-beneficiaire.component";
import {AuthService} from "../../../services/security/auth/auth.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {finalize} from "rxjs/operators";
import {FormDemandeComponent} from "../../../formulaire/form-demande/form-demande.component";
import {DescriptionDemandeComponent} from "../../pmo/description-demande/description-demande.component";

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Beneficiaire> | null;
  sortDirections: NzTableSortOrder[];
}

@Component({
  selector: 'app-beneficiare',
  templateUrl: './beneficiare.component.html',
  styleUrls: ['./beneficiare.component.scss']
})

export class BeneficiareComponent implements OnInit {
  isSpinning = false;
  listBeneficiaires: Beneficiaire[] = [];
  modal: NzModalRef | undefined;
  map = new Map();
  val : boolean = false;

  listOfColumns: ColumnItem[] = [
    {
      name: 'Date',
      sortOrder: null,
      sortFn: (a: Beneficiaire, b: Beneficiaire) => a.dateModification?.localeCompare(b.dateModification || '') || 1,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Nom',
      sortOrder: null,
      sortFn: (a: Beneficiaire, b: Beneficiaire) => a?.personnes?.[0].nom?.localeCompare(b?.personnes?.[0].nom || '') || 1 ,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Telephone',
      sortOrder: null,
      sortFn: (a: Beneficiaire, b: Beneficiaire) => a?.personnes?.[0].numeroMobile?.localeCompare(b?.personnes?.[0].numeroMobile || '') || 1 ,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Type',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: Beneficiaire, b: Beneficiaire) => a?.typeBeneficiaire?.localeCompare(b?.typeBeneficiaire || '') || 1,
    },
    {
      name: 'Statut',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: Beneficiaire, b: Beneficiaire) => a?.statut?.localeCompare(b?.statut || '') || 1,
    }
  ];

  constructor(private touchPointService: TouchPointService,
              private modalService: NzModalService,
              private notificationService: NzNotificationService,
              public authService: AuthService) {
  }

  ngOnInit(): void {
    this.getAllBeneficiaires();
    this.setStatusMap()
  }

  getStatusLibelle(codeStatus:any){
    return this.map.get(codeStatus);
  }

  getAllBeneficiaires() {
    this.touchPointService.getAllBeneficiaires().subscribe(data => {
      console.log(data)
      this.listBeneficiaires = data as Beneficiaire[]
      this.val = false;
    })
  }

  editBeneficiaire(beneficiairetp: Beneficiaire) {
    console.log(beneficiairetp.id)
    if (beneficiairetp.typeBeneficiaire === "ME") {
      this.modalService.create({
        nzCancelText: null,
        nzTitle: 'Modifier Enrolement',
        nzContent: FormMicroEntrepreneursComponent,
        nzComponentParams: {
          beneficiairetp: beneficiairetp
        },
        nzWidth: 1200,
      });
      this.actualiser()
    }
    if (beneficiairetp.typeBeneficiaire === "PME") {
      this.modalService.create({
        nzCancelText: null,
        nzTitle: 'Modifier Enrolement',
        nzContent: FormEntrepriseComponent,
        nzComponentParams: {
          beneficiairetp: beneficiairetp
        },
        nzWidth: 1200,
      });
      this.actualiser()
    }
    if (beneficiairetp.typeBeneficiaire === "GIE") {
      this.modalService.create({
        nzCancelText: null,
        nzTitle: 'Modifier Enrolement',
        nzContent: FormGieComponent,
        nzComponentParams: {
          beneficiairetp: beneficiairetp
        },
        nzWidth: 1200,
      });
    }
    this.actualiser()
  }

  terminerEnrolement(bene: Beneficiaire){
    switch (bene.typeBeneficiaire){
      case "ME" :
        this.modalService.create({
          nzTitle: 'Enrolement Micro Entrepreneur',
          nzContent: FormMicroEntrepreneursComponent,
          nzComponentParams:{
            beneficiairetp: bene
          },
          nzWidth: 1200,
          nzCancelText: null,
          nzOkText : null
        });
        this.actualiser()
        break;
      case "PME":
        this.modalService.create({
          nzTitle: 'Enrolement Entreprise',
          nzContent: FormEntrepriseComponent,
          nzComponentParams:{
            beneficiairetp: bene
          },
          nzWidth: 1200,
          nzCancelText: null,
          nzOkText : null
        });
        this.actualiser()
        break;
      case "GIE":
        this.modalService.create({
          nzTitle: 'Enrolement Groupement',
          nzContent: FormGieComponent,
          nzComponentParams:{
            beneficiairetp: bene
          },
          nzWidth: 1200,
          nzCancelText: null,
          nzOkText : null
        });
        this.actualiser()
        break;
    }
  }

  ajoutDemande(beneficiairetp: Beneficiaire) {
    console.log(beneficiairetp.id)
    this.modalService.create({
      nzTitle: 'Demande de Financement',
      nzContent: FormDemandeComponent,
      nzComponentParams:{
        beneficiairetp: beneficiairetp
      },
      nzWidth: 1200,
      nzCancelText: null,
      nzOkText : null
    });
    this.actualiser();
  }

  actualiser(): void{
    this.modalService
      .afterAllClose
      .pipe(finalize(() => this.getAllBeneficiaires()))
      .subscribe(data => {
        this.getAllBeneficiaires()
      })
  }
  expandSet = new Set<string>();
  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  validerBeneficiaire(bene: Beneficiaire){
    if(bene.id){
      this.val = true;
      console.log(bene.id)
      this.touchPointService.validerBeneficiaire(bene.id).subscribe(data => {
        console.log(data.message)
        this.getAllBeneficiaires()
      })
    }
  }

  showModalDescriptionBeneficiaire(bene : Beneficiaire) : void{
    this.modalService.create({
      nzCancelText : null,
      nzTitle :'Beneficiaire',
      nzComponentParams:{
        beneficiaireEx : bene
      },
      nzContent : DescriptionDemandeComponent,
      nzWidth : 1200,
    })
  }

  setStatusMap(){
    this.map.set('INITIE', 'Initié');
    this.map.set('PENDING_REGISTRED', 'En cours');
    this.map.set('ACTIVATED', 'Actif');
  }
}
