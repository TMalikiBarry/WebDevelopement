import { Component, OnInit } from '@angular/core';
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {TouchPointService} from "../../../services/touch-point/touch-point.service";
import {Beneficiaire} from "../../../model/beneficiaire";
import {DescriptionBeneficiaireComponent} from "../../pmo/description-beneficiaire/description-beneficiaire.component";
import {PmoService} from "../../../services/pmo/pmo.service";
import {Demande} from "../../../model/demande";
import {BeneTP} from "../../../model/beneTP";
import {AuthService} from "../../../services/security/auth/auth.service";
import {NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table";

import {DataService} from "../../../services/data_service/data_service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {OffresComponent} from "../../pmo/offres/offres.component";
import {OffresBeneficiaireComponent} from "../../pmo/offers-beneficiaire/offers-beneficiaire.component";
import {finalize} from "rxjs/operators";
import {FormDemandeComponent} from "../../../formulaire/form-demande/form-demande.component";
import {FormAnalystePmeGieComponent} from "../../../formulaire/form-analyste-pme-gie/form-analyste-pme-gie.component";
import {FormAnalysteMeComponent} from "../../../formulaire/form-analyste-me/form-analyste-me.component";
import {TemplateAF} from "../../../model/templateAF";
import {DescriptionDemandeComponent} from "../../pmo/description-demande/description-demande.component";

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Demande> | null;
  sortDirections: NzTableSortOrder[];
}
interface ColumnItemBis {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Demande> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<Demande> | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
}

@Component({
  selector: 'app-demande',
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.scss']
})
export class DemandeComponent implements OnInit {
  isSpinning = false;
  map = new Map();
  listDemandes: Demande[] = []
  listTemplate: TemplateAF[] = []
  modal: NzModalRef | undefined;
  data!: Beneficiaire;
  idPmo: any;
  run : boolean = false;

  listOfColumns: ColumnItem[] = [
    {
      name: 'Date',
      sortOrder: null,
      sortFn: (a: Demande, b: Demande) => a.dateCreation?.localeCompare(b.dateCreation || '') || 1,
      // sortFn: null,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Beneficiaire',
      sortOrder: null,
      sortFn: (a: Demande, b: Demande) => a.beneficiaire?.personnes?.[0].nom?.localeCompare(b.beneficiaire?.personnes?.[0].nom || '') || 1 ,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Montant demandé',
      sortOrder: null,
      sortFn: (a: Demande, b: Demande) => (a.montant || 1) - (b.montant || 1),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Type',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: Demande, b: Demande) => a.typeDemande?.localeCompare(b.typeDemande || '') || 1,
    }
  ];

  listOfColumnsBis: ColumnItemBis[]= [
    {
      name: 'Statut demande',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: Demande, b: Demande) => a.statutDossier?.localeCompare(b.statutDossier || '') || 1,
      // sortFn: null,
      filterMultiple: false,
      listOfFilter: [
        { text: 'Reçu par l\'analyste financier', value: 'RECU_AF' },
        { text: 'Matching effectuer', value: 'MATCHE'},
      //   { text: 'Invalidé', value: 'INVALIDATED'},
      //   // { text: 'APPROUVE', value: this.getStatusTitle('APPROUVE'), byDefault: true },
      //   { text: 'Rejeté', value: 'REJETE' },
      //   { text: 'Décaissement en cours', value: 'DECAISSE_START' },
      //   { text: 'Décaissé', value: 'DECAISSE_DONE' },
      //   { text: 'Remboursement en cours', value: 'REMBOURSEMENT_START' },
      //   { text: 'Remboursé', value: 'REMBOURSEMENT_DONE' }
       ],
      // filterFn: (list: string[], item: Demande) => this.listeDemande?.some((name:string) => item.statutDossier?.indexOf(name|| '') !== -1)
      filterFn: (statut: string, item: Demande) => item.statutDossier?.indexOf(statut) !== -1
      // filterFn: null
    }
  ]

  constructor(private touchPointService: TouchPointService,
              private modalService: NzModalService,
              private notificationService: NzNotificationService,
              public authService : AuthService) { }

  ngOnInit(): void {
    this.getAllDemandes()
    this.setStatusMap()
  }

  getAllDemandes(){
    this.touchPointService.getAllDemandes().subscribe(data=>{
      this.listDemandes = data as Demande[]
      this.run = false
      console.log(this.listDemandes)
    })
    this.touchPointService.getAllTemplate().subscribe(data => {
      this.listTemplate = data as TemplateAF[]
    })
  }

  runMatching(id ?: number){
    if(id) {
      this.touchPointService.runMatching(id).subscribe(data => {
        this.touchPointService.getMatching(id).subscribe(data1 => {
          if(data1?.offres?.[0]){
            this.getAllDemandes()
          }
          this.getAllDemandes()
        })
        this.notificationService.success('Succés', 'Run Matching effectuer avec succes ');
        this.run = true
      })
      this.getAllDemandes()
    }
  }

  getMatching(id ?: number){
    if(id){
      this.touchPointService.getMatching(id).subscribe(data1 => {
        console.log("get matching "+" "+id +JSON.stringify(data1.offres))
        if(data1?.offres?.[0]){
          this.notificationService.success('Succés', 'Des offres ont matcher');
          this.modalService.create({
            nzCancelText: null,
            nzTitle: 'Offres',
            nzComponentParams:{
              offreDemandeEx: data1
            },
            nzContent: OffresBeneficiaireComponent,
            nzWidth: 1300
          });
          this.modalService
            .afterAllClose
            .pipe(finalize(() => this.getAllDemandes()))
            .subscribe(data => {
              this.getAllDemandes()
            })
        }else{
          this.notificationService.error('Attention', 'Aucune offre n\'a matcher avec cette demande');
        }
      })
    }
  }

  setStatusMap(){
    this.map.set('INITIE', 'Initié');
    this.map.set('RECU_TG', 'Reçu par Teranga');
    this.map.set('INVALIDATED_TG', 'Invalidé par Teranga');
    this.map.set('TEMPORAIRE_TG', 'Initié TG');
    this.map.set('RECU', 'Reçu par le PMO');
    this.map.set('INVALIDATED', 'Invalidé');
    this.map.set('RECU_AF', 'En cours d\'examination par l\'analyste financier');
    this.map.set('MATCHE', 'Matching effectué');
    this.map.set('RECU_AF_MATCHE', 'En cours d\'examination par l\'analyste financier apres matching');
    this.map.set('APPROUVE', 'Approuvé par le PMO');
    this.map.set('REJETE', 'Rejeté par le PMO');
    this.map.set('DECAISSE_START', 'Décaissement en cours');
    this.map.set('DECAISSE_DONE', 'Décaissé');
    this.map.set('REMBOURSEMENT_START', 'Remboursement en cours');
    this.map.set('REMBOURSEMENT_DONE', 'Remboursé');
  }

  getStatusLibelle(codeStatus:any){
    return this.map.get(codeStatus);
  }

  expandSet = new Set<string>();
  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  showModalDescriptionDemande(data1:Demande): void {
    this.modalService.create({
      nzCancelText: null,
      nzTitle: 'Description demande',
      nzComponentParams:{
        demandeEx: data1
      },
      nzContent: DescriptionDemandeComponent,
      nzWidth: 1200
    });
  }

  addTemplate(data : Demande) : void{
    if(data.beneficiaire?.typeBeneficiaire != 'ME'){
      this.modalService.create({
        nzCancelText: null,
        nzTitle: 'Template PME & GIE',
        nzComponentParams:{
          demandeEx: data
        },
        nzContent: FormAnalystePmeGieComponent,
        nzWidth: 1300
      });
    }else {
      this.modalService.create({
        nzCancelText: null,
        nzTitle: 'Template Micro Entrepreneur',
        nzComponentParams:{
          demandeEx: data
        },
        nzContent: FormAnalysteMeComponent,
        nzWidth: 1300
      });
      this.modalService
        .afterAllClose
        .pipe(finalize(() => this.getAllDemandes()))
        .subscribe(data => {
          this.getAllDemandes()
        })
    }
  }

  editDemande(demande : Demande){
    this.modalService.create({
      nzTitle: 'Demande de Financement',
      nzContent: FormDemandeComponent,
      nzComponentParams:{
        DemandeEx: demande
      },
      nzWidth: 1200,
      nzCancelText: null,
      nzOkText : null
    });
    this.modalService
      .afterAllClose
      .pipe(finalize(() => this.getAllDemandes()))
      .subscribe(data => {
        this.getAllDemandes()
      })
  }

  getTemplate(data: Demande) {
    for (const tem of this.listTemplate) {
        if(data?.id === tem.demande?.id) {
          return true;
        }
    }
    return false;
  }
}
