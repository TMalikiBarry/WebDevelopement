import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {ChartComponent} from "ng-apexcharts";
import {DataService} from "../../../services/data_service/data_service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {AuthService} from "../../../services/security/auth/auth.service";
import {UntypedFormBuilder} from "@angular/forms";
import {FileService} from "../../../services/file/file.service";
import {PmoService} from "../../../services/pmo/pmo.service";
import {TouchPointService} from "../../../services/touch-point/touch-point.service";
import {environment} from "../../../../environments/environment";
import {BeneTP} from "../../../model/beneTP";
import {
  FormMicroEntrepreneursComponent
} from "../../../formulaire/form-micro-entrepreneurs/form-micro-entrepreneurs.component";
import {FormEntrepriseComponent} from "../../../formulaire/form-entreprise/form-entreprise.component";
import {FormGieComponent} from "../../../formulaire/form-gie/form-gie.component";
import {EbMicroEntrepriseComponent} from "../../../expression-besoin/eb-micro-entreprise/eb-micro-entreprise.component";
import {Beneficiaire} from "../../../model/beneficiaire";
import {FormDemandeComponent} from "../../../formulaire/form-demande/form-demande.component";
import {Demande} from "../../../model/demande";
import {NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table";
import {finalize} from "rxjs/operators";

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<BeneTP> | null;
  sortDirections: NzTableSortOrder[];
}
interface ColumnItemBis {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<BeneTP> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<BeneTP> | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
}

@Component({
  selector: 'app-personne',
  templateUrl: './personne.component.html',
  styleUrls: ['./personne.component.scss']
})
export class PersonneComponent implements OnInit {

  @Output() beneTP = new EventEmitter<any>();

  subscription: Subscription = new Subscription;
  searchValue = '';
  modal: NzModalRef | undefined;
  visible = false;
  isSpinning = false;
  idPmo: number=0;
  isVisible = false;
  map = new Map();
  listBene: BeneTP[] = [];
  baseUrlFile: any;
  role: string = '';
  personneType !: BeneTP
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  dataSet = [];

  listOfColumns: ColumnItem[] = [
    {
      name: 'Date',
      sortOrder: null,
      sortFn: (a: BeneTP, b: BeneTP) => a.beneficiaire.dateModification?.localeCompare(b.beneficiaire.dateModification || '') || 1,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Prenom',
      sortOrder: null,
      sortFn: (a: BeneTP, b: BeneTP) => a?.beneficiaire.personnes?.[0].prenom?.localeCompare(b?.beneficiaire.personnes?.[0].prenom || '') || 1 ,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Nom',
      sortOrder: null,
      sortFn: (a: BeneTP, b: BeneTP) => a?.beneficiaire.personnes?.[0].nom?.localeCompare(b?.beneficiaire.personnes?.[0].nom || '') || 1 ,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Telephone',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: BeneTP, b: BeneTP) => a?.beneficiaire.personnes?.[0].numeroMobile?.localeCompare(b?.beneficiaire.personnes?.[0].numeroMobile || '') || 1 ,
    },
    {
      name: 'Type',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: BeneTP, b: BeneTP) => a?.beneficiaire?.typeBeneficiaire?.localeCompare(b?.beneficiaire?.typeBeneficiaire || '') || 1,
    },
    {
      name: 'Agence',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: BeneTP, b: BeneTP) => a.code?.localeCompare(b.code || '') || 1,
    },
    {
      name: 'Statut',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: BeneTP, b: BeneTP) => a?.beneficiaire?.statut?.localeCompare(b?.beneficiaire?.statut || '') || 1,
    },
    {
      name: 'Actions',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: null,
    }
  ];
  // @ts-ignore
  @ViewChild("chart") chart: ChartComponent = new ChartComponent();
  constructor(private modalService : NzModalService, private data: DataService, private notification : NzNotificationService,
              public authService : AuthService, private fb: UntypedFormBuilder, private fileService : FileService, private changeDetectorRef : ChangeDetectorRef,
              private pmoService:PmoService,
              private touchPointService: TouchPointService,) {}


  ngOnInit(): void {
    this.baseUrlFile = environment.baseUrlFile
    if (localStorage.getItem('currentUser')) {
      let user = this.authService.currentUserValue;
      this.idPmo = user.idParent;
      if(user?.roles){
        this.role = user?.roles[0];
        console.log(this.role)
      }
    }

    this.getAllPersonnes()
    this.onGetInfoPmo()
    this.setStatusMap()

  }



  expandSet = new Set<string>();
  pmo?: any;

  askFordeconnexion(){
    this.modalService.confirm({
      nzTitle: 'Deconnexion',
      nzOkText: 'Oui',
      nzContent: 'Voulez-vous vraiment vous déconnecter ?',
      nzOnOk: () => {
        this.authService.logout();
      }
    });
  }

  onGetInfoPmo(){
    this.pmoService.getById(this.idPmo).subscribe(response => {
      this.pmo = response;
      console.log( this.pmo)
    })
  }



  getAllPersonnes(){
    this.touchPointService.getAllPersonnes().subscribe(data=>{
      this.listBene = data as BeneTP[]
      console.log(this.listBene)
    })
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

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    //console.log('call babs');
    this.visible = false;
    };

  actualiser() : void{
    this.modalService
      .afterAllClose
      .pipe(finalize(() => this.getAllPersonnes()))
      .subscribe(data => {
        this.getAllPersonnes()
      })
  }

  setStatusMap(){
    this.map.set('INITIER', 'Initier');
    this.map.set('EN_COURS', 'En cours');
    this.map.set('VALIDER', 'Valider');
  }

  getStatusLibelle(codeStatus:any){
    return this.map.get(codeStatus);
  }



}
