import { Component, OnInit } from '@angular/core';
import {NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table";
import {Demande} from "../../../model/demande";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {Beneficiaire} from "../../../model/beneficiaire";
import {TouchPointService} from "../../../services/touch-point/touch-point.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {AuthService} from "../../../services/security/auth/auth.service";
import {TemplateAF} from "../../../model/templateAF";
import {DescriptionTemplateComponent} from "../../../formulaire/description-template/description-template.component";

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
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  isSpinning = false;
  map = new Map();
  listTemplate: TemplateAF[] = []
  modal: NzModalRef | undefined;
  data!: Beneficiaire;
  idPmo: any;

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
      name: 'Type Financement',
      sortOrder: null,
      sortFn: (a: Demande, b: Demande) => a.typeDemande?.localeCompare(b.typeDemande || '') || 1 ,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Montant demandé',
      sortOrder: null,
      sortFn: (a: Demande, b: Demande) => (a.montant || 1) - (b.montant || 1),
      sortDirections: ['ascend', 'descend', null],
    }
  ];

  // listOfColumnsBis: ColumnItemBis[]= [
  //   {
  //     name: 'Statut demande',
  //     sortOrder: null,
  //     sortDirections: ['ascend', 'descend', null],
  //     sortFn: (a: Demande, b: Demande) => a.statutDossier?.localeCompare(b.statutDossier || '') || 1,
  //     // sortFn: null,
  //     filterMultiple: false,
  //     listOfFilter: [
  //       { text: 'Reçu par l\'analyste financier', value: 'RECU_AF' },
  //       { text: 'Matching effectuer', value: 'MATCHE'},
  //       //   { text: 'Invalidé', value: 'INVALIDATED'},
  //       //   // { text: 'APPROUVE', value: this.getStatusTitle('APPROUVE'), byDefault: true },
  //       //   { text: 'Rejeté', value: 'REJETE' },
  //       //   { text: 'Décaissement en cours', value: 'DECAISSE_START' },
  //       //   { text: 'Décaissé', value: 'DECAISSE_DONE' },
  //       //   { text: 'Remboursement en cours', value: 'REMBOURSEMENT_START' },
  //       //   { text: 'Remboursé', value: 'REMBOURSEMENT_DONE' }
  //     ],
  //     // filterFn: (list: string[], item: Demande) => this.listeDemande?.some((name:string) => item.statutDossier?.indexOf(name|| '') !== -1)
  //     filterFn: (statut: string, item: Demande) => item.statutDossier?.indexOf(statut) !== -1
  //     // filterFn: null
  //   }
  // ]

  constructor(private touchPointService: TouchPointService,
              private modalService: NzModalService,
              private notificationService: NzNotificationService,
              public authService : AuthService) { }

  ngOnInit(): void {
    this.getAllTemplates()
  }

  private getAllTemplates() {
    this.touchPointService.getAllTemplate().subscribe(data=>{
      this.listTemplate = data as TemplateAF[]
      console.log(this.listTemplate)
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

  getDetailTemplate(data: TemplateAF) {
    this.modalService.create({
      nzCancelText: null,
      nzTitle: 'Description Template',
      nzComponentParams:{
        templateEx: data
      },
      nzContent: DescriptionTemplateComponent,
      nzWidth: 1000
    });
  }
}
