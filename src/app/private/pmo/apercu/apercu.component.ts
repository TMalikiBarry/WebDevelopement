import {Component, OnInit} from '@angular/core';
import {Demande} from "../../../model/demande";
import {NzModalService} from "ng-zorro-antd/modal";
import {AuthService} from "../../../services/security/auth/auth.service";
import {PmoService} from "../../../services/pmo/pmo.service";
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableQueryParams,
  NzTableSortFn,
  NzTableSortOrder
} from 'ng-zorro-antd/table';
import {ChartOptions} from "../layout/layout.component";
import {InfoSelection} from 'src/app/model/info-selection';
import {UntypedFormBuilder, UntypedFormControl, Validators} from '@angular/forms';
import {Commentaire} from 'src/app/model/commentaire';
import {FileService} from 'src/app/services/file/file.service';
import {DescriptionDemandeComponent} from '../description-demande/description-demande.component';
import {DataService} from 'src/app/services/data_service/data_service';
import {ExportPMO} from 'src/app/model/exportPMO';
import {Router} from '@angular/router';
import {CheckFileSize} from 'src/app/core/utils/checker/checkFileSize';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {environment} from "../../../../environments/environment";
import {CurrencyPipe} from "@angular/common";
import {maxValidator, minValidator} from "../../../core/customValidators/past-date-validator";

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<InfoSelection> | null;
  sortDirections: NzTableSortOrder[];
  width: string;
}

interface ColumnItemActivite {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Demande> | null;
  sortDirections: NzTableSortOrder[];
  width: string;
}

interface ColumnItemBis {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<InfoSelection> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<InfoSelection> | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];

}

interface ColumnItemBisActivite {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Demande> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<Demande> | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];

}

@Component({
  selector: 'app-apercu',
  templateUrl: './apercu.component.html',
  styleUrls: ['./apercu.component.scss']
})
export class ApercuComponent implements OnInit {
  searchValue = '';
  modal: any;
  typeCalled: string = '';
  montantOctroye: any;
  isVisibleDetails = false;
  visible = false;
  visibleActivite = false;
  isSpinning = false;
  idPmo: number = 0;
  montantFormate: string = '';
  erreurMsg = '';
  role: string = '';
  checkFileInfo: boolean = false;
  checkFileSizeMB: boolean = true;
  evidencesList: any [] = [];
  complementInfoNom: any;
  demandeTitle: string = '';
  complementInfoNomList: any [] = [];
  isVisible = false;
  isActivite2 = false;
  isVisibleExport = false;
  isVisibleComment = false;
  isVisibleError = false;
  nomDocument: any = '';
  baseUrlFile = environment.baseUrlFile;
  show = false;
  currentInfo: InfoSelection = new InfoSelection;
  map = new Map();
  mapBis = new Map();

  mapSource = new Map();
  listeDemande: any;
  listeDemandeExport: any;
  listedemandesExportees: Array<any> =  [] || undefined;
  listeDemandeApprouvees: Array<any> = [] || undefined;
  listeDemandeRejetees: Array<any> = [] || undefined;

  //@ViewChild("chart") chart: ChartComponent = new ChartComponent();
  demandes: any[] = [];
  demandesExport: any[] = [];
  public chartOptions: ChartOptions;
  listBeneficiaire : any[] = [];
  listBeneficiaireApprouve : any[] = [];
  listBeneficiaireNonApprouve : any[] = [];
  listOfDisplayData:any;
  listOfDisplayDataActivite2:any;
  listeDemandeActivite2 : any;
  searchValueApprouve = '';
  searchValueRejete = '';
  visibleApprouve=  false;
  visibleRejete=  false;

  fileDoc: NzUploadFile[] = [];

  // isSpinning = false;
  isSpinningApprouve = false;
  isSpinningRejete = false;
  sortField = '';
  searchValueActivite = '';
  sortOrder = '';
  sortFieldRejete = '';
  sortOrderRejete = '';
  totalDemandes = 10;
  totalDemandesActivite2 = 10;
  totalRejete = 10;
  totalApprouve = 10;
  loading = false;
  pageSize = 10;
  pageSizeApprouve = 10;
  pageIndexApprouve = 1;
  pageIndex = 1;
  pageSizeActivite2 = 10;
  pageIndexActivite2 = 1;
  pageSizeRejete = 10;
  pageIndexRejete = 1;
  listOfStatuts: any;
  listOfSelectedStatuts: any;
  listOfSources: any;
  listOfSelectedSources: any;
  nombreCommentaire = 0;
  newDemande: any;

  demandeForm = this.fb.group({
    commentaire: ['', Validators.required],
    document: [''],
    montant: [''],
  });

  commentForm = this.fb.group({
    commentaire: ['', Validators.required],
    document: ['']

  });
  // @ts-ignore
  exportForm = this.fb.group({
    beginDate: ['', Validators.required],
    endDate: ['', Validators.required],
    sources: [[]],
    statuts: [[]]
  });

  beneficiaireColumn = {
    sortOrder: null,
    sortFn: (a: InfoSelection, b: InfoSelection) => (a.demande?.beneficiaire?.id || 1) - (b.demande?.beneficiaire?.id || 1),
    sortDirections: ['ascend', 'descend', null],

  }

  activite2Column = {
    sortOrder: null,
    sortFn: (a: any, b: any) => (a.demande.id || 1) - (b.demande.id || 1),
    sortDirections: ['ascend', 'descend', null],
  }

  listOfColumnsBis: ColumnItemBis[] = [
    {
      name: 'Statut demande',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: InfoSelection, b: InfoSelection) => a.demande?.statutDossier?.localeCompare(b.demande?.statutDossier || '') || 1,
      // sortFn: null,
      filterMultiple: false,
      listOfFilter: [
        {text: 'Reçu', value: 'RECU'},
        {text: 'Approuvé', value: 'APPROUVE'},
        // { text: 'APPROUVE', value: this.getStatusTitle('APPROUVE'), byDefault: true },
        {text: 'Rejeté', value: 'REJETE'},
        {text: 'Décaissement en cours', value: 'DECAISSE_START'},
        {text: 'Décaissé', value: 'DECAISSE_DONE'},
        {text: 'Remboursement en cours', value: 'REMBOURSEMENT_START'},
        {text: 'Remboursé', value: 'REMBOURSEMENT_DONE'}
      ],
      // filterFn: (list: string[], item: InfoSelection) => this.listeDemande?.some((name:string) => item.demande?.statutDossier?.indexOf(name|| '') !== -1)
      filterFn: (statut: string, item: InfoSelection) => item.demande?.statutDossier?.indexOf(statut) !== -1
      // filterFn: null
    }
  ]

  // @ts-ignore
  listOfColumns: ColumnItem[] = [
    {
      name: 'Date',
      sortOrder: null,
      sortFn: (a: InfoSelection, b: InfoSelection) => a.demande?.dateCreation?.localeCompare(b.demande?.dateCreation || '') || 1,
      // sortFn: null,
      sortDirections: ['ascend', 'descend', null],
      width: ''

    },
    {
      name: 'Montant demandé',
      sortOrder: null,
      sortFn: (a: InfoSelection, b: InfoSelection) => (a.demande?.montant || 1) - (b.demande?.montant || 1),
      sortDirections: ['ascend', 'descend', null],
      width: ''

    },
    {
     name: 'Intitulé Offre',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.offre.intituleAction?.localeCompare(b.offre.intituleAction || '') || 1,
      sortDirections: ['ascend', 'descend', null],
      width:'30%'
    },
/*    {
      name: 'Type',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: InfoSelection, b: InfoSelection) => a.demande?.typeDemande?.localeCompare(b.demande?.typeDemande || '') || 1,
    }*/
  ];

  listOfColumnsActivite2: ColumnItemActivite[] = [
    {
      name: 'Date',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.demande.dateCreation?.localeCompare(b.demande.dateCreation || '') || 1,
      // sortFn: null,
      sortDirections: ['ascend', 'descend', null],
      width:'',
    },
    {
      name: 'Montant demandé',
      sortOrder: null,
      sortFn: (a: any, b: any) => (a.demande.montant || 1) - (b.demande.montant || 1),
      sortDirections: ['ascend', 'descend', null],
      width:'',
    },
   {
      name: 'Intitulé Offre',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.offre.intituleAction?.localeCompare(b.offre.intituleAction || '') || 1,
      sortDirections: ['ascend', 'descend', null],
     width:'30%',
    },
    /*    {
         name: 'Type',
         sortOrder: null,
         sortDirections: ['ascend', 'descend', null],
         sortFn: (a: any, b: any) => a.demande.typeDemande?.localeCompare(b.demande.typeDemande || '') || 1,
       }*/
  ];

  listOfColumnsBisActivite2: ColumnItemBisActivite[] = [
    {
      name: 'Statut demande',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: any, b: any) => a.demande.statutDossier?.localeCompare(b.demande.statutDossier || '') || 1,
      // sortFn: null,
      filterMultiple: false,
      listOfFilter: [
        {text: 'Reçu', value: 'RECU'},
        {text: 'Approuvé', value: 'APPROUVE'},
        {text: 'Invalidé', value: 'INVALIDATED'},
        // { text: 'APPROUVE', value: this.getStatusTitle('APPROUVE'), byDefault: true },
        {text: 'Rejeté', value: 'REJETE'},
        {text: 'Décaissement en cours', value: 'DECAISSE_START'},
        {text: 'Décaissé', value: 'DECAISSE_DONE'},
        {text: 'Remboursement en cours', value: 'REMBOURSEMENT_START'},
        {text: 'Remboursé', value: 'REMBOURSEMENT_DONE'}
      ],
      // filterFn: (list: string[], item: Demande) => this.listeDemande?.some((name:string) => item.statutDossier?.indexOf(name|| '') !== -1)
      filterFn: (statut: string, item: any) => item.demande.statutDossier?.indexOf(statut) !== -1
      // filterFn: null
    }
  ]
  expandSet = new Set<string>();
  listOfData = [
    {
      id: '#1545300',
      name: 'Aminata Diallo',
      date: '16/7/21',
      montant: '8,500,000CFA',
      secteur: 'Agriculture',
      status: 'Bien',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      id: '#1545301',
      name: 'Aminata Diallo',
      date: '16/7/21',
      montant: '8,500,000CFA',
      secteur: 'Agriculture',
      status: 'Bien',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      id: '#1545302',
      name: 'Aminata Diallo',
      date: '16/7/21',
      montant: '8,500,000CFA',
      secteur: 'Agriculture',
      status: 'Bien',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      id: '#1545303',
      name: 'Aminata Diallo',
      date: '16/7/21',
      montant: '8,500,000CFA',
      secteur: 'Agriculture',
      status: 'Bien',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      id: '#1545304',
      name: 'Aminata Diallo',
      date: '16/7/21',
      montant: '8,500,000CFA',
      secteur: 'Agriculture',
      status: 'Bien',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },

  ];

  constructor(private modalService: NzModalService, private data: DataService, private router: Router,
              private authService: AuthService, private fb: UntypedFormBuilder, private fileService: FileService,
              private pmoService: PmoService,
              private checkFileSize: CheckFileSize, private currencyPipe: CurrencyPipe) {
    this.chartOptions = {
      series: [
        {
          name: "My-series",
          data: [101, 412, 352, 512, 492, 622, 672]
        }
      ],
      chart: {
        height: 240,
        type: "area"
      },
      title: {
        text: "Evolution Annuelle"
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
      }
    };
  }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      let user = this.authService.currentUserValue;
      this.idPmo = user.idParent;
      this.setStatusMap();
      this.setStatusMapTitle();
      this.setSourceMapTitle();
      this.checkIfCanRegisterBenef();
      this.onGetAllDemande();
      // this.onGetRejetesDemande();
      this.role = this.authService.storage.getItem('ROLE')!;
      // console.log('role ', this.role);
      this.getListeStatuts();
      this.getListeSources();


    }
  }

  onQueryParamsChangeAllDemande(params: NzTableQueryParams): void {
    // console.log(params);
    // console.log(type);
    const {pageSize, pageIndex, sort, filter} = params;
    const currentSort = sort.find(item => item.value !== null);
    let sortField = (currentSort && currentSort.key) || null;
    let sortOrder = (currentSort && currentSort.value) || null;

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.sortField = sortField || '';
    this.sortOrder = sortOrder || '';
    // console.log(sortField);
    // console.log(sortOrder);
    // console.log(filter);
    // if(sortField=='nom'){
    //   sortField = 'denominationSociale';
    // }

    // console.log(sortField);

    this.onGetAllDemande();

  }

  onQueryParamsChangeAllDemandeApprouvee(params: NzTableQueryParams): void {
    // console.log(params);
    // console.log(type);
    const {pageSize, pageIndex, sort, filter} = params;
    const currentSort = sort.find(item => item.value !== null);
    let sortField = (currentSort && currentSort.key) || null;
    let sortOrder = (currentSort && currentSort.value) || null;

    this.pageIndexApprouve = pageIndex;
    this.pageSizeApprouve = pageSize;
    this.sortField = sortField || '';
    this.sortOrder = sortOrder || '';
    // console.log(sortField);
    // console.log(sortOrder);
    // console.log(filter);
    // if(sortField=='nom'){
    //   sortField = 'denominationSociale';
    // }

    // console.log(sortField);

    this.onGetAllDemandeApprouvees();

  }

  onQueryParamsChangeAllDemandeActivite2(params: NzTableQueryParams): void {
    // console.log(params);
    // console.log(type);
    const {pageSize, pageIndex, sort, filter} = params;
    const currentSort = sort.find(item => item.value !== null);
    let sortField = (currentSort && currentSort.key) || null;
    let sortOrder = (currentSort && currentSort.value) || null;

    this.pageIndexActivite2 = pageIndex;
    this.pageSizeActivite2 = pageSize;
    this.sortField = sortField || '';
    this.sortOrder = sortOrder || '';
    // console.log(sortField);
    // console.log(sortOrder);
    // console.log(filter);
    // if(sortField=='nom'){
    //   sortField = 'denominationSociale';
    // }

    // console.log(sortField);

    this.onGetAllDemandeActivite2();

  }

  checkIfCanRegisterBenef() {
    // this.isSpinning = true;
    this.pmoService.checkIfCanRegisterBenef(this.idPmo).subscribe((response) => {
        // this.isSpinning = false;
        console.log(response);
        this.isActivite2 = response.reponse;

      },
      (error) => {
        this.isSpinning = false;
        //console.log(error);
        // this.handleCancelError();
      })
  }

  onQueryParamsChangeDemandeRejete(params: NzTableQueryParams): void {
    // console.log(params);
    // console.log(type);
    const {pageSize, pageIndex, sort, filter} = params;
    const currentSort = sort.find(item => item.value !== null);
    let sortField = (currentSort && currentSort.key) || null;
    let sortOrder = (currentSort && currentSort.value) || null;

    this.pageIndexRejete = pageIndex;
    this.pageSizeRejete = pageSize;
    // this.sortField = sortField || '';
    // this.sortOrder = sortOrder || '';
    // console.log(sortField);
    // console.log(sortOrder);
    // console.log(filter);
    // if(sortField=='nom'){
    //   sortField = 'denominationSociale';
    // }

    // console.log(sortField);

    this.onGetRejetesDemande();

  }

  reset(): void {
    this.visible= false;
    this.searchValue = '';
    this.onGetAllDemande();
  }
  resetApprouve(): void {
    this.visibleApprouve = false;
    this.searchValueApprouve = '';
    this.onGetAllDemandeApprouvees();
  }
  resetRejete(): void {
    this.visibleRejete = false;
    this.searchValueRejete = '';
    this.onGetRejetesDemande();
  }



  // search(): void {
  //   //console.log('call babs');
  //   this.visible = false;
  //   this.listOfDisplayData = this.listeDemande.filter((item: InfoSelection) => {
  //     let value = item.demande?.id+'';
  //     // //console.log('value', value);
  //     // //console.log('result', value.indexOf(this.searchValue));
  //     return value.indexOf(this.searchValue) !== -1
  //   });
  // }


  resetActivite2(): void {
    this.searchValueActivite = '';
    this.onGetAllDemandeActivite2();
  }

  searchDemande() {

    this.isSpinning = true;
    //console.log('new demande', demande);
    this.pmoService.searchDemandeByIdBis(this.searchValue, this.idPmo).subscribe((response) => {
        this.isSpinning = false;
        console.log(response);
        this.visible =false;
        this.listOfDisplayData = [];
        this.listOfDisplayData = response;
      },
      (error) => {
        this.isSpinning = false;
        this.listOfDisplayData = [];
        //console.log(error);
      })
  }

  searchDemandeApprouve(){

    this.isSpinning = true;
    //console.log('new demande', demande);
    this.pmoService.searchDemandeByIdBis(this.searchValueApprouve, this.idPmo).subscribe((response) => {
        this.isSpinning = false;
        console.log(response);
        this.visibleApprouve = false;

        this.listeDemandeApprouvees = [];
        this.listeDemandeApprouvees = response;
      },
      (error)=>{
        this.isSpinning = false;
        this.listeDemandeApprouvees = [];
        //console.log(error);
      })
  }
  searchDemandeRejete(){

    this.isSpinning = true;
    //console.log('new demande', demande);
    this.pmoService.searchDemandeByIdBis(this.searchValueRejete, this.idPmo).subscribe((response) => {
        this.isSpinning = false;
        console.log(response);
      this.visibleRejete = false;
        this.listeDemandeRejetees = [];
        this.listeDemandeRejetees = response;
      },
      (error)=>{
        this.isSpinning = false;
        this.listeDemandeRejetees = [];
        //console.log(error);
      })
  }
  searchActivite2(){
    this.isSpinning = true;
    //console.log('new demande', demande);
    this.pmoService.searchDemandeByIdBis(this.searchValueActivite, this.idPmo).subscribe((response) => {
        this.isSpinning = false;
        console.log(response);
        this.listOfDisplayDataActivite2 = [];
        this.listOfDisplayDataActivite2.push(response);
      },
      (error) => {
        this.isSpinning = false;
        this.listOfDisplayDataActivite2 = [];
        //console.log(error);
      })
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  showModalDescriptionDemande(data: InfoSelection): void {

    this.isSpinning = true;

    let demande = this.pmoService.getDemandeById(data?.demande?.id?.toString()).subscribe((response) => {
      data.demande = response;
      console.log(response);
      console.log(data.demande);
      this.isSpinning = false;
      this.data.changeMessage(data);
      this.modalService.create({
        nzCancelText: null,
        nzTitle: 'Description demande',
        nzContent: DescriptionDemandeComponent,
        nzWidth: 1000
      });

    }, error => console.log(error));
    // @ts-ignore


  }

  setStatusMap() {
    this.map.set('INITIE', 'Initié');
    this.map.set('RECU', 'Reçu');
    this.map.set('RECU_TG', 'Reçu TG');
    this.map.set('INVALIDATED', 'Invalidé');
    this.map.set('APPROUVE', 'Approuvé');
    this.map.set('REJETE', 'Rejeté');
    this.map.set('DECAISSE_START', 'Décaissement en cours');
    this.map.set('DECAISSE_DONE', 'Décaissé');
    this.map.set('REMBOURSEMENT_START', 'Remboursement en cours');
    this.map.set('REMBOURSEMENT_DONE', 'Remboursé');
  }

  setStatusMapTitle() {
    // this.map.set('RECU', 'Reçu');
    this.mapBis.set('APPROUVE', 'Initier décaissement');
    // this.map.set('REJETE', 'Rejeté');
    this.mapBis.set('DECAISSE_START', 'Clôture décaissement');
    this.mapBis.set('DECAISSE_DONE', 'Initier remboursement');
    this.mapBis.set('REMBOURSEMENT_START', 'Clôture remboursement');
    // this.map.set('REMBOURSEMENT_DONE', 'Remboursé');
  }

  setSourceMapTitle() {
    this.mapSource.set('SELF_WEB', 'Auto Inscription');
    this.mapSource.set('PMO_WEB', 'Pmo en cours');
    this.mapSource.set('MOBILE_AI', 'Agent Itinérant');
    this.mapSource.set('MOBILE_TP', 'TouchPoint');
    this.mapSource.set('MIGRATION_BO', 'Migration BD');
    this.mapSource.set('FROMAPIUIMCEC', 'From Api UIMCEC');
    this.mapSource.set('WEB_TP', 'TouchPoint WEB');
    }

  getStatusLibelle(codeStatus: string) {
    return this.map.get(codeStatus);
  }
  getSSourceLibelle(codeStatus: string) {
    return this.mapSource.get(codeStatus);
  }

  getStatusTitle(codeStatus: string) {
    return this.mapBis.get(codeStatus);
  }

  getListeStatuts() {
    this.listOfStatuts = [
      {text: 'Reçu', value: 'RECU'},
      {text: 'Approuvé', value: 'APPROUVE'},
      {text: 'Invalidé', value: 'INVALIDATED'},
      // { text: 'APPROUVE', value: this.getStatusTitle('APPROUVE'), byDefault: true },
      {text: 'Rejeté', value: 'REJETE'},
      {text: 'Décaissement en cours', value: 'DECAISSE_START'},
      {text: 'Décaissé', value: 'DECAISSE_DONE'},
      {text: 'Remboursement en cours', value: 'REMBOURSEMENT_START'},
      {text: 'Remboursé', value: 'REMBOURSEMENT_DONE'}
    ];

  }

  // onGetAllDemande(pageIndex:number, pageSize:number, sortField:string, sortOrder:string){
  //   // console.log('page index', pageIndex);
  //   this.isSpinningPME = true;
  //   this.pmoService.getAllBeneficiairePME(this.idPmo, 'pmes', pageIndex, pageSize, sortField, sortOrder).subscribe((response) => {
  //     this.isSpinningPME = false;
  //     // console.log(response);
  //     this.listBeneficiairePME = response.content;
  //     this.listOfDisplayDataPME = response.content;
  //     this.totalDemandes = response.totalElements;
  //   },
  //   (error)=>{
  //     this.isSpinningPME = false;
  //     //console.log(error);
  //   })
  // }

  getListeSources() {

    this.listOfSources = [
      {text: 'Auto Inscription', value: 'SELF_WEB'},
      {text: 'Pmo en cours', value: 'PMO_WEB'},
      {text: 'Agent Itinérant', value: 'MOBILE_AI'},
      {text: 'TouchPoint', value: 'MOBILE_TP'},
      {text: 'Migration BD', value: 'MIGRATION_BO'},
      {text: 'From Api UIMCEC', value: 'FROMAPIUIMCEC'},
      {text: 'TouchPoint WEB', value: 'WEB_TP'}
    ];
    console.log(this.listOfSources)
  }

  showModalDescriptionDemandeActivite2(data: any): void {
    // console.log(data);

    let demande = this.pmoService.getDemandeById(data?.demande?.id?.toString()).subscribe((response) => {
      data.demande = response;
      console.log(response);
      console.log(data.demande);
      this.isSpinning = false;
      this.data.changeMessage(data);
      this.modalService.create({
        nzCancelText: null,
        nzTitle: 'Description demande',
        nzContent: DescriptionDemandeComponent,
        nzWidth: 1000
      });

    }, error => console.log(error));
  }

  goExpressionBesoin(data: Demande) {
    this.data.changeMessageBeneficiaire(data);
    let typeBeneficiaire: string = data?.beneficiaire?.typeBeneficiaire || '';
    if (typeBeneficiaire.trim().toLowerCase() == 'pme') {
      this.router.navigateByUrl('/beneficiaire/expression-besoin/entreprise');
    } else if (typeBeneficiaire.trim().toLowerCase() == 'gie') {
      this.router.navigateByUrl('/beneficiaire/expression-besoin/gie');
    } else if (typeBeneficiaire.trim().toLowerCase() == 'me') {
      this.router.navigateByUrl('/beneficiaire/expression-besoin/microentreprise');
    }
  }

  goOffreBeneficiaire(data: Demande) {
    console.log(data);
    const idBeneficiaire = data?.beneficiaire?.id;
    console.log(idBeneficiaire);
    this.router.navigate(['/pmo/offres-beneficiaire/' + idBeneficiaire]);
  }

  onGetAllDemande() {
    this.isVisible = false;
    console.log('les Demandes ', this.pageIndex, this.pageSize, this.sortField, this.sortOrder);
    this.isSpinning = true;
    this.pmoService.getAll(this.idPmo, this.pageIndex, this.pageSize, this.sortField, this.sortOrder).subscribe((response) => {
        this.isSpinning = false;
        console.log(response);
        this.listeDemande = response.content;
        this.listOfDisplayData = response.content;
        this.totalDemandes = response.totalElements;

        this.listeDemande.forEach((item: { demande: any; }) => {
          this.demandes.push(item.demande);
        })
        // //console.log('DEMQNDES', demandes);

        /*   this.listeDemandeApprouvees = [];
           this.listeDemandeApprouvees = this.demandes.filter((item: any) => item.statutDossier == "APPROUVE");
           this.totalApprouve = this.listeDemandeApprouvees.length;*/
        // this.listeDemandeRejetees = demandes.filter((item: any) => item.statutDossier == "REJETE")
        // console.log("liste approuvée", this.listeDemandeApprouvees);
        // //console.log("liste rejetter", this.listeDemandeRejetees)
      },
      (error) => {
        this.isSpinning = false;
        //console.log(error);
      })
  }

  onGetAllDemandeApprouvees() {
    this.visibleApprouve=false;
    console.log('les Demandes ', this.pageIndex, this.pageSize, this.sortField, this.sortOrder);
    this.isSpinningApprouve = true;
    this.pmoService.getAllDemandeApprouve(this.idPmo, this.pageIndex, this.pageSize, this.sortField, this.sortOrder).subscribe((response) => {
        this.isSpinningApprouve = false;
        console.log('Reponse des demandes' + response);
        this.listeDemandeApprouvees = response.content;
     //   this.listOfDisplayData = response.content;
        this.totalApprouve = response.totalElements;

        /*       this.listeDemande.forEach( (item: { demande: any; }) => {
                 this.demandes.push(item.demande);
               })*/
        // //console.log('DEMQNDES', demandes);

        /*      this.listeDemandeApprouvees = [];
              this.listeDemandeApprouvees = this.demandes.filter((item: any) => item.statutDossier == "APPROUVE");
              this.totalApprouve = this.listeDemandeApprouvees.length;*/
        // this.listeDemandeRejetees = demandes.filter((item: any) => item.statutDossier == "REJETE")
        // console.log("liste approuvée", this.listeDemandeApprouvees);
        // //console.log("liste rejetter", this.listeDemandeRejetees)
      },
      (error) => {
        this.isSpinningApprouve = false;
        //console.log(error);
      })
  }

  // onGetAllDemandeActivite2(){
  //   this.isSpinning = true;
  //   this.pmoService.getAllDemandeActivite2(this.idPmo).subscribe((response) => {
  //     this.isSpinning = false;
  //     console.log(response);
  //     // this.beneficiaire = response ;
  //     this.listeDemandeActivite2 = response;
  //     this.listOfDisplayDataActivite2 = response;
  //     console.log(this.listeDemandeActivite2);
  //   },
  //   (error)=>{
  //     this.isSpinning = false;
  //     //console.log(error);
  //   })
  // }

  onGetAllDemandeActivite2() {
    console.log('Demande Activites2');
    this.isSpinning = true;
    this.pmoService.getAllDemandeActivite2(this.idPmo, this.pageIndexActivite2, this.pageSizeActivite2, this.sortField, this.sortOrder).subscribe((response) => {
        this.isSpinning = false;
        console.log('Demande Activites2' + response);
        this.listeDemandeActivite2 = response.content;
        this.listOfDisplayDataActivite2 = response.content;
        this.totalDemandesActivite2 = response.totalElements;

        // this.listeDemande.forEach( (item: { demande: any; }) => {
        //   this.demandes.push(item.demande);
        // })
        // //console.log('DEMQNDES', demandes);

      },
      (error) => {
        this.isSpinning = false;
        //console.log(error);
      })
  }

  onGetRejetesDemande() {

    console.log('Rejete ', this.pageIndexRejete, this.pageSizeRejete, this.sortFieldRejete, this.sortOrderRejete)
    this.isSpinningRejete = true;
    this.pmoService.getAllDemandeRejete(this.idPmo, this.pageIndexRejete, this.pageSizeRejete, this.sortFieldRejete, this.sortOrderRejete).subscribe((response) => {
        this.isSpinningRejete = false;
        console.log('Réponse demandes rekjetes' + response);
        this.listeDemandeRejetees = response.content;
        this.totalRejete = response.totalElements;
      },
      (error) => {
        this.isSpinningRejete = false;
        //console.log(error);
      })
  }

  updateDemandeStatus(demande: Demande, newStatus: string, oldStatus: string) {


    console.log('ancienne demande', demande);
    this.newDemande = demande;
    this.newDemande.statutDossier = newStatus || '';
    if (newStatus == 'APPROUVE') {
      this.newDemande.montantOctroye = demande.montantOctroye;
    }
    this.isSpinning = true;
    console.log('ancienne demande', demande);
    console.log('new demande', this.newDemande);
    this.pmoService.updateDemande(this.newDemande).subscribe((response) => {
        this.isSpinning = false;
        //  demande.statutDossier = newStatus;
        console.log("demande update");
        this.onGetAllDemande();

      },
      (error) => {
        this.isSpinning = false;
        demande.statutDossier = oldStatus;
        console.log('Update demande error ', error);
        this.handleCancelError();
      })


  }

  updateRejectDemandeStatus(demandeRejected: InfoSelection) {
    //console.log('new demande', demandeRejected);
    this.pmoService.updaterejectDemande(demandeRejected).subscribe((response) => {
        //console.log(response);
        this.onGetAllDemande();
        this.onGetRejetesDemande();
      },
      (error) => {
        //console.log(error);
        this.handleCancelError();
      })
  }

  approuve(info: InfoSelection) {
    // console.log(info);
    let demande = info.demande || {};
    let offre = info.offre || {};
    this.modalService.confirm({
      nzTitle: 'Confirmation demande',
      nzOkText: 'Approuver',
      nzContent: 'Voulez-vous approuver cette demande ?',
      nzOnOk: () => {
        // demande.montantOctroye =
        demande.offre = offre;
        demande.montantOctroye = this.montantOctroye;
        this.updateDemandeStatus(demande, 'APPROUVE', 'RECU');
        this.onGetAllDemande();
      }
    });

  }

  // showModal2(): void {
  //   this.modalService.create({
  //     nzTitle: 'Modal Title',
  //     nzContent: NzModalCustomFooterComponent
  //   });
  // }

  decline(info: InfoSelection) {
    this.modalService.confirm({
      nzTitle: 'Rejet demande',
      nzOkText: 'Rejeter',
      nzContent: 'Voulez-vous rejeter cette demande ?',
      nzOnOk: () => {
        this.updateRejectDemandeStatus(info);
      }
    });

  }

  traitement() {
    let comment: Commentaire = new Commentaire;
    comment.comment = this.demandeForm.controls.commentaire.value;
    comment.media = this.nomDocument;
    comment.status = this.currentInfo.demande?.statutDossier;

    if(this.currentInfo.demande){

      this.currentInfo.demande.commentaires?.push(comment);
      this.nombreCommentaire = this.getCountCommentairePMO(this.currentInfo.demande?.commentaires);

    }

    //console.log(this.currentInfo);
    //console.log(this.typeCalled);
    if (this.typeCalled?.length != 0) { // Sil a choisit approuve ou decline
      if (this.typeCalled.trim() == 'approuve') {
        this.montantOctroye = parseInt(this.demandeForm.controls.montant.value?.replace(/\s/g, ""));
        this.approuve(this.currentInfo);
      } else if (this.typeCalled.trim() == 'decline') {
        this.decline(this.currentInfo);
      }
    }
    else{
  /*    if(this.currentInfo.demande?.statutDossier=='RECU'){
        this.initierDecaissement(this.currentInfo);
      }*/
      if(this.currentInfo.demande?.statutDossier=='APPROUVE'){
        this.initierDecaissement(this.currentInfo);
      } else if (this.currentInfo.demande?.statutDossier == 'DECAISSE_START') {
        this.finirDecaissement(this.currentInfo);
      } else if (this.currentInfo.demande?.statutDossier == 'DECAISSE_DONE') {
        this.initierRemboursement(this.currentInfo);
      } else if (this.currentInfo.demande?.statutDossier == 'REMBOURSEMENT_START') {
        this.finirRemboursement(this.currentInfo);
      }
    }

    this.demandeForm.reset();
  }

  showModalExport() {
    console.log('here');
    this.isVisibleExport = true;
  }

  handleOkExport(): void {
    // //console.log('Button ok clicked!');
    this.isVisibleExport = false;

    this.exportAsExcelFileForDemande();
  }

  handleOk(): void {
    // //console.log('Button ok clicked!');
    this.isVisible = false;
    this.montantOctroye =  Number(this.demandeForm?.controls?.montant?.value);
    this.evidencesList = [];
    this.checkFileSizeMB = true;
    this.traitement();
  }

  handleCancel(): void {
    // //console.log('Button cancel clicked!');
    this.isVisible = false;
    this.isVisibleExport = false;
    this.demandeForm.removeControl('montant');
    this.evidencesList = [];
    this.checkFileSizeMB = true;
    this.demandeForm.reset();
    this.exportForm.reset();
  }

  handleOkError(): void {
    // //console.log('Button ok clicked!');
    this.isVisibleError = false;
    this.isVisibleExport = false;
  }

  handleCancelError(): void {
    // //console.log('Button cancel clicked!');
    this.isVisibleError = false;
    this.isVisibleExport = false;
  }

  showModal(info: InfoSelection, type: string) {
    //console.log(type);
    this.typeCalled = type;

    this.currentInfo = info || new InfoSelection;
    if (info) {
      // @ts-ignore
      this.pmoService.getDemandeById(info?.demande?.id?.toString()).subscribe((response) => {
        // @ts-ignore
        if (info?.demande?.id) {
          this.currentInfo.demande = response;
        }

        console.info(this.currentInfo?.offre);
        console.info('Bienvenue')
        console.info(this.currentInfo?.demande)
        // @ts-ignore
        if (this.currentInfo.demande?.statutDossier == 'RECU' && this.typeCalled == 'approuve') {
          this.demandeTitle = 'Approuver';
          this.isVisible = true;

          this.montantFormate = this.currencyPipe.transform((String(this.currentInfo?.demande?.montant))?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr') as string;
          console.log(this.montantFormate);
          this.demandeForm.addControl('montant', new UntypedFormControl(null, Validators.required));
          this.demandeForm.controls.montant.addValidators([Validators.pattern('^[0-9\\s]*$'), minValidator('50 000'), maxValidator(this.montantFormate)]);
          this.demandeForm.controls.montant.updateValueAndValidity();
          this.demandeForm.controls.montant.setValue(this.montantFormate);
        } else if (this.currentInfo.demande?.statutDossier == 'RECU' && this.typeCalled == 'recu') {
          this.demandeTitle = 'Ajouter un commentaire';
          this.isVisibleComment = true;
          this.isVisible = false;
        } else {
          if (this.typeCalled == 'decline'){
            this.demandeTitle ='Rejeter';
          } else if (this.currentInfo.demande?.statutDossier == 'APPROUVE') {
            this.demandeTitle = 'Initier décaissement';

          }else if (this.currentInfo.demande?.statutDossier == 'DECAISSE_START') {

            this.demandeTitle = 'Clôturer décaissement';
          }else if (this.currentInfo.demande?.statutDossier == 'DECAISSE_DONE') {
            this.demandeTitle = 'Initier remboursement';
          }else if (this.currentInfo.demande?.statutDossier == 'REMBOURSEMENT_START') {
            this.demandeTitle = 'Clôturer remboursement';
          }
          this.isVisible = true;
          this.demandeForm.removeControl('montant');
        }

      }, error => console.log(error));
    }

  }

  showModalError() {
    this.isVisibleError = true;
  }

  chooseFile() {
    // var fileSelect = document.getElementById("fileSelect"),
    let fileElem = document.getElementById("fileElem");
    // console.log('babs');
    fileElem?.click();
  }

  checkTypeFile(tableau: string[], extension: string) {
    return tableau?.indexOf(extension) !== -1;
  }

  evidencesLoad(event: any) {

    // let tableau: string[] = ['pdf','doc','docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    let tableau: string[] = ['pdf', 'jpg', 'jpeg', 'png'];
    this.checkFileInfo = false;
    // console.log(event.target.files);
    for (let index = 0; index < event.target.files.length; index++) {
      const element = event.target.files[index];
      if (this.checkTypeFile(tableau, element.name.split('.').pop())) {
        // check if file exist
        if (event.target.files && event.target.files.length) {
          console.log(element.size);
          this.checkFileSizeMB = this.checkFileSize.checkSize(element.size, 'notSelfie');
          if (this.checkFileSizeMB) {
            let formData = new FormData();

            formData.append('file', element);
            // console.log(element);


            // set the name form the database
            this.fileService.save(formData, 'cni').subscribe(
              response => {

                this.nomDocument = response.reponse;
                console.log(response);
                this.evidencesList.push(response.reponse || '');
              }
              , error => {
                console.log(error);
              }
            )
          } else {
            console.log("Fichier trop lourd !!!!!");
            this.demandeForm.controls?.document.setValue('');
          }

          // const [file] = event.target.files;


        }
        this.checkFileInfo = false;
      } else {
        this.checkFileInfo = true;
        this.demandeForm.controls?.document.setValue('');
        break;
      }
    }
  }

  deleteEvidence(value: string) {
    console.log(value);
    // let index = this.complementInfoNomList.findIndex((e)=> {e === value}); //find index in your array
    console.log(this.evidencesList.length);

    for (let index = 0; index < this.evidencesList.length; index++) {
      const element = this.evidencesList[index];
      console.log(element);
      if (element == value) {
        this.modalService.confirm({
          nzTitle: 'Confirmer le retrait',
          nzOkText: 'Retirer',
          nzContent: `Etes vous sûr de vouloir retirer le document ${element.slice(element.lastIndexOf('_') + 1)}`,
          nzOnOk: () => {
            this.evidencesList.splice(index, 1);//remove element from array
            this.demandeForm.controls.document.setValue('');
          }
        });
        break;
      }

      console.log(this.evidencesList.length);
    }
  }

  formatMontant() {
    let amount = this.currencyPipe.transform((this.demandeForm?.controls?.montant?.value as string)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr');
    this.demandeForm?.controls?.montant?.setValue(amount);
  }

  documentCniLoad(event: any) {


    //limit taille fichier 2Mo


    // check if file exist
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      //   this.agentContactForm.patchValue({
      //     documentCNI: file
      //  });


      //   // need to run CD since file load runs outside of zone
      //   this.changeDetector.markForCheck();

      let formData = new FormData();
      formData.append('file', file);
      console.log(formData);
      this.fileService.save(formData, 'cni ').subscribe(
        response => {
          console.log(response);
          this.nomDocument = response.reponse;
        }
        ,
        error => {
          //console.log(error);
        }
      )

    }
  }

  initierDecaissement(info: InfoSelection) {
    // console.log(info);
    let demande = info.demande || {};
    let offre = info.offre || {};
    this.modalService.confirm({
      nzTitle: 'Confirmation demande',
      nzOkText: 'Initier',
      nzContent: 'Voulez-vous confirmer l\'initiation du décaissement ?',
      nzOnOk: () => {
        // demande.offres?.push(offre);
        // demande.statutDossier = 'DECAISSE_START' || '';
        // console.log(demande);
        this.updateDemandeStatus(demande, 'DECAISSE_START' || '', 'APPROUVE');
      }
    });

  }

  finirDecaissement(info: InfoSelection) {
    let demande = info.demande || {};
    let offre = info.offre || {};
    this.modalService.confirm({
      nzTitle: 'Confirmation demande',
      nzOkText: 'Finir',
      nzContent: 'Voulez-vous confirmer la clôture du décaissement ?',
      nzOnOk: () => {
        // demande.offres?.push(offre);
        // demande.statutDossier = 'DECAISSE_DONE' || '';
        // console.log(demande);
        this.updateDemandeStatus(demande, 'DECAISSE_DONE' || '', 'DECAISSE_START');
      }
    });

  }

  initierRemboursement(info: InfoSelection) {
    // console.log(info);
    let demande = info.demande || {};
    let offre = info.offre || {};
    this.modalService.confirm({
      nzTitle: 'Confirmation demande',
      nzOkText: 'Initier',
      nzContent: 'Voulez-vous confirmer l\'initiation du remboursement ?',
      nzOnOk: () => {
        // demande.offres?.push(offre);
        // demande.statutDossier = 'REMBOURSEMENT_START' || '';
        // console.log(demande);
        this.updateDemandeStatus(demande, 'REMBOURSEMENT_START' || '', 'DECAISSE_DONE');
      }
    });

  }

  finirRemboursement(info: InfoSelection) {
    console.log(info);
    let demande = info.demande || {};
    let offre = info.offre || {};
    this.modalService.confirm({
      nzTitle: 'Confirmation demande',
      nzOkText: 'Finir',
      nzContent: 'Voulez-vous confirmer la clôture du remboursement ?',
      nzOnOk: () => {
        // demande.offres?.push(offre);
        // demande.statutDossier = 'REMBOURSEMENT_DONE' || '';
        // console.log(demande);
        this.updateDemandeStatus(demande, 'REMBOURSEMENT_DONE' || '', 'REMBOURSEMENT_START');
      }
    });

  }

  onGetAllDemandeExport(dateDebut: string, dateFin: string, sources: string[], statuts: string[]) {
    // console.log('Demande ', this.pageIndex, this.pageSize, this.sortField, this.sortOrder);
    const exportPMO = new ExportPMO();
    exportPMO.id = this.idPmo;
    exportPMO.dateDebut = dateDebut;
    exportPMO.dateFin = dateFin;
    exportPMO.sources = sources.length !== 0 ? sources : undefined;
    exportPMO.statutDossiers = statuts.length !== 0 ? statuts : undefined;
    // this.isSpinning = true;
    console.log(exportPMO);
    return this.pmoService.getAllDemandeExport(exportPMO).toPromise();
  }

  getPersonneContactInfo(beneficiaire: any) {
    let listContact = beneficiaire?.personnes?.filter((item: any) => {
      return item.typePersonnes?.map(function (e: any) {
        // //console.log(e);
        return e.code;
      }).indexOf("CONTACT") !== -1

    });
    // //console.log(listContact);
    if (listContact && listContact.length > 0) {
      // this.personneContact = listContact[0];
      // this.changeDetector.detectChanges();
      return listContact[0];
    }
    // console.log(this.personneContact.prenom);

    // this.changeDetector.detectChanges();
  }

  getPersonneDirigeantInfo(beneficiaire: any) {
    let listContact = beneficiaire?.personnes?.filter((item: any) => {
      return item.typePersonnes?.map(function (e: any) {
        // //console.log(e);
        return e.code;
      }).indexOf("DIRIGEANT") !== -1

    });
    // //console.log(listContact);
    // if (listContact && listContact.length>0) {
    //   this.personneContact = listContact[0];
    //   // this.changeDetector.detectChanges();
    // }
    // console.log(this.personneContact.prenom);
    return listContact;
    // this.changeDetector.detectChanges();
  }

  // onGetAllDemandeExport(dateDebut:string, dateFin:string){
  //   // console.log('Demande ', this.pageIndex, this.pageSize, this.sortField, this.sortOrder);
  //   const exportPMO = new ExportPMO();
  //   exportPMO.id = this.idPmo;
  //   exportPMO.dateDebut = dateDebut;
  //   exportPMO.dateFin = dateFin;

  //   this.isSpinning = true;
  //   this.pmoService.getAllDemandeExport(exportPMO).subscribe((response) => {
  //     this.isSpinning = false;
  //    console.log(response);
  //     this.listeDemandeExport = response.content;
  //     // this.listOfDisplayData = response.content;
  //     // this.totalDemandes = response.totalElements;

  //     this.listeDemandeExport.forEach( (item: { demande: any; }) => {
  //       this.demandesExport.push(item.demande);
  //     })
  //     // //console.log('DEMQNDES', demandes);

  //     // this.listeDemandeApprouvees = [];
  //     // this.listeDemandeApprouvees = this.demandes.filter((item: any) => item.statutDossier == "APPROUVE");
  //     // this.totalApprouve = this.listeDemandeApprouvees.length;
  //     // this.listeDemandeRejetees = demandes.filter((item: any) => item.statutDossier == "REJETE")
  //     // console.log("liste approuvée", this.listeDemandeApprouvees);
  //     // //console.log("liste rejetter", this.listeDemandeRejetees)
  //   },
  //   (error)=>{
  //     this.isSpinning = false;
  //     console.log(error);
  //   })
  // }

  getPersonneAssocieInfo(beneficiaire: any) {
    let listContact = beneficiaire?.personnes?.filter((item: any) => {
      return item.typePersonnes?.map(function (e: any) {
        // //console.log(e);
        return e.code;
      }).indexOf("ASSOCIE") !== -1

    });
    // //console.log(listContact);
    // if (listContact && listContact.length>0) {
    //   this.personneContact = listContact[0];
    //   // this.changeDetector.detectChanges();
    // }
    // console.log(this.personneContact.prenom);
    return listContact;
    // this.changeDetector.detectChanges();
  }

  async exportAsExcelFileForDemande() {
    const beginDate = new Date(this.exportForm?.controls?.beginDate?.value);
    const endDate = new Date(this.exportForm?.controls?.endDate?.value);
    const strbeginDate = new Date(this.exportForm?.controls?.beginDate?.value).toJSON();
    const strendDate = new Date(this.exportForm?.controls?.endDate?.value).toJSON();

    console.log(strbeginDate);
    console.log(strendDate);
    if (beginDate > endDate) {
      this.isVisibleError = true;
      this.erreurMsg = 'Date de début supérieure à la date de fin';
      return;
    }


    this.isSpinning = true;

    this.listeDemandeExport = await this.onGetAllDemandeExport(strbeginDate, strendDate, this.exportForm.controls.sources.value, this.exportForm.controls.statuts.value);
    this.isSpinning = false;
    this.listedemandesExportees = this.listeDemandeExport.reponse;
    console.log("statut "+this.listeDemandeExport.status)
    console.log("Message "+this.listeDemandeExport.message)

    console.log("Le nombre  de demandes " + this.listedemandesExportees.length);

    console.log("La liste des demandes " + this.listedemandesExportees);
    // return;
    // console.log('length '+this.demandesExport.length);
    let rowDataPME: any = [];
    let rowDataME: any = [];
    let rowDataGIE: any = [];

    for (let i = 0; i < this.listedemandesExportees.length; i++) {
    console.log("traitement des données ")
      const element = Object.assign(new Demande(), JSON.parse(JSON.stringify(this.listedemandesExportees[i])));


      console.log("Demande concernee "+ element);
      let  sigle: string = "Non renseigné";
      let id: number = 30;
      if(element?.offre?.pmo?.sigle != null || element?.beneficiaire?.pmoRattachement?.sigle != null ){
        if(element?.offre?.pmo?.sigle != null){
          sigle = element?.offre?.pmo?.sigle;
          id = element?.offre?.pmo?.id;
        }else if(element?.beneficiaire?.pmoRattachement?.sigle != null){
         sigle =  element?.beneficiaire?.pmoRattachement?.sigle;
         id = element?.beneficiaire?.pmoRattachement?.id;
        }
      }
      if(element?.beneficiaire?.source == 'FROMAPIUIMCEC'){
        sigle = 'UIMCEC';
        id =4;
      }
      console.log("Le sigle  "+sigle)

      if(id == this.idPmo) {
        if (element.beneficiaire.typeBeneficiaire == 'PME') {
          console.log("traitement des données si PME")
          let row = {
            'ID Bénéficiaire': element?.beneficiaire?.id,
            'Date de création': element?.dateCreation,
            'PMO': sigle,
            'Dénomination Sociale': element?.beneficiaire?.denominationSociale,
            'Statut juridique de l\'entreprise': element?.beneficiaire?.statusJuridique,
            'Numéro RCCM': element?.beneficiaire?.numeroRCCM,
            'NINEA': element?.beneficiaire?.ninea,
            'Date de création de l\'entreprise': element?.beneficiaire?.dateCreation,
            'Adresse/Siège social': element?.beneficiaire?.adresse,
            'Département': element?.beneficiaire?.zoneGeographique?.libelle,
            'Région': element?.beneficiaire?.zoneGeographique?.libelle,
            'Centre urbain ?': element?.beneficiaire?.centreUrbain,
            'Dirigeant 1': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.nom + ' ' + this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.prenom,
            'Dir 1 Prénom': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.prenom,
            'Dir 1 Nom': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.nom,
            'Dir 1 Genre': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.genre,
            'Dir 1 Age': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.age?.libelle,
            'Dir 1 Niveau ': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.niveauInstruction?.libelle,
            'Dir 1 Numero CNI ou passeport': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.numeroCNI,
            'Dir 1 Fonction dans l\'entreprise': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.titre?.libelle,
            'Dir 1 Niveau d\'instruction': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.niveauInstruction?.libelle,
            'Dir 1 Nombre de personnes à charge au total (famille directe + dépendants hors famille directe)': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.nombrePersonneACharge,

            'Dirigeant 2': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.nom + ' ' + this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.prenom,
            'Dir 2 Prénom': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.prenom,
            'Dir 2 nom': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.nom,
            'Dir 2 Genre': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.genre?.libelle,
            'Dir 2 Age': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.age?.libelle,
            'Dir 2 Niveau ': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.niveauInstruction?.libelle,
            'Dir 2 Numero CNI ou passeport': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.numeroCNI,
            'Dir 2 Fonction dans l\'entreprise': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.titre.libelle,
            'Dir 2 Niveau d\'instruction': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.niveauInstruction?.libelle,
            'Dir 2 Nombre de personnes à charge au total (famille directe + dépendants hors famille directe)': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.nombrePersonneACharge,

            'Dirigeant 3': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.nom + ' ' + this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.prenom,
            'Dir 3 Prénom': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.prenom,
            'Dir 3 Nom': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.nom,
            'Dir 3 Genre': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.genre?.libelle,
            'Dir 3 Age': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.age?.libelle,
            'Dir 3 Niveau ': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.niveauInstruction?.libelle,
            'Dir 3 Numero CNI ou passeport': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.numeroCNI,
            'Dir 3 Fonction dans l\'entreprise': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.titre.libelle,
            'Dir 3 Niveau d\'instruction': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.niveauInstruction?.libelle,
            'Dir 3 Nombre de personnes à charge au total (famille directe + dépendants hors famille directe)': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.nombrePersonneACharge,

            'Dirigeant 4': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.nom + ' ' + this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.prenom,
            'Dir 4 Prénom': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.prenom,
            'Dir 4 Nom': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.nom,
            'Dir 4 Genre': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.genre?.libelle,
            'Dir 4 Age': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.age?.libelle,
            'Dir 4 Niveau ': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.niveauInstruction?.libelle,
            'Dir 4 Numero CNI ou passeport': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.numeroCNI,
            'Dir 4 Fonction dans l\'entreprise': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.titre.libelle,
            'Dir 4 Niveau d\'instruction': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.niveauInstruction?.libelle,
            'Dir 4 Nombre de personnes à charge au total (famille directe + dépendants hors famille directe)': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.nombrePersonneACharge,

            'Associé 1': this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.nom + ' ' + this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.prenom,
            'Ass 1 Prénom': this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.prenom,
            'Ass 1 Nom': this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.nom,
            'Ass 1 Genre': this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.genre?.libelle,
            'Ass 1 Age': this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.age?.libelle,
            'Ass 1 Numero CNI ou passeport': this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.numeroCNI,
            'Ass 1 Pourcentage de détention du capital': this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.pourcentageDetenueCapital,

            'Associé 2': this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.nom + ' ' + this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.prenom,
            'Ass 2 Prénom': this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.prenom,
            'Ass 2 Nom': this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.nom,
            'Ass 2 Genre': this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.genre?.libelle,
            'Ass 2 Age': this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.age?.libelle,
            'Ass 2 Numero CNI ou passeport': this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.numeroCNI,
            'Ass 2 Pourcentage de détention du capital': this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.pourcentageDetenueCapital,

            'Associé 3': this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.nom + ' ' + this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.prenom,
            'Ass 3 Prénom': this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.prenom,
            'Ass 3 Nom': this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.nom,
            'Ass 3 Genre': this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.genre?.libelle,
            'Ass 3 Age': this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.age?.libelle,
            'Ass 3 Numero CNI ou passeport': this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.numeroCNI,
            'Ass 3 Pourcentage de détention du capital': this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.pourcentageDetenueCapital,

            'Associé 4': this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.nom + ' ' + this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.prenom,
            'Ass 4 Prénom': this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.prenom,
            'Ass 4 Nom': this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.nom,
            'Ass 4 Genre': this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.genre?.libelle,
            'Ass 4 Age': this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.age?.libelle,
            'Ass 4 Numero CNI ou passeport': this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.numeroCNI,
            'Ass 4 Pourcentage de détention du capital': this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.pourcentageDetenueCapital,
            'Source du beneficiaire': this.getSSourceLibelle(element?.beneficiaire?.source),
            'Secteur d\'activité': element?.beneficiaire?.activiteBeneficiaires[0]?.secteurActivites[0]?.libelle,
            'Nombre d\'années d\'activité': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreAnneeActivite?.libelle,
            'Chiffre affaire N-1': element?.beneficiaire?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois1 ? element?.beneficiaire?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois1 : element?.beneficiaire?.activiteBeneficiaires[0]?.revenueTotalAnMoins1,
            'Employés permanents de l\'entreprise ': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmployePermanent?.libelle,
            'Nombre exact à date': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmployePermanentExactAdate,
            'Nombre de femmes': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreFemmeEmployePermanent,
            'Pourcentage de femmes   ': element?.beneficiaire?.activiteBeneficiaires[0]?.pourcentageFemmeEmployePermanent,
            'Nombre de jeunes (< 35 ans)': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreJeuneEmployePermanent,
            'Pourcentage de jeunes (< 35 ans)  ': element?.beneficiaire?.activiteBeneficiaires[0]?.pourcentageJeuneEmployePermanent,
            'Salaire net / mois le plus bas dans l\'entreprise en Francs CFA  ': element?.beneficiaire?.activiteBeneficiaires[0]?.revenuplusBasParMois,
            'Salaire net moyen / mois dans l\'entreprise en Francs CFA': element?.beneficiaire?.activiteBeneficiaires[0]?.revenuMoyenneParMois,
            'ID Demande': element.id,
            'Description du projet ou de l\'activité à financer': element.projets[0]?.description,
            'Complémnts d\'information': element.projets[0]?.complementInformations,
            'Emplois à créer: employés permanents': element.projets[0]?.nombreEmploisPermanent?.libelle,
            'Nombre d\'emplois additionnels créés avec ce financement ou projet': element.projets[0]?.nombreEmploisAdditionnelPermanent,
            'Nombre de femmes prévu': element.projets[0]?.nombreFemmePrevuePermanent,
            'Pourcentage de femmes': element.projets[0]?.pourcentageFemmePermanent,
            'Nombre de jeunes (< 35 ans) prévu': element.projets[0]?.nombreJeunePermanent,
            'Pourcentage de jeunes (< 35 ans)': element.projets[0]?.pourcentageJeunePermanent,
            'Emplois à créer: employés non permanents, prestataires, saisonniers, etc.': element.projets[0]?.nombreEmploisNonPermanent?.libelle,
            'Nombre d\'emplois additionnels créés avec ce financement ou projet ': element.projets[0]?.nombreEmploisAdditionnelNonPermanent,
            'Nombre de femmes prévu ': element.projets[0]?.nombreFemmePrevueNonPermanent,
            'Pourcentage de femmes ': element.projets[0]?.pourcentageFemmeNonPermanent,
            'Nombre de jeunes (< 35 ans) prévu ': element.projets[0]?.nombreJeuneNonPermanent,
            'Pourcentage de jeunes (< 35 ans) ': element.projets[0]?.pourcentageJeuneNonPermanent,
            'Type de demande de financement': element.typeDemande,
            'Durée souhaitée en nombre de mois': element.duree,
            'Montant demandé en Francs CFA': element.montant,
            'Montant finalement octroyé en Francs CFA': element.montantOctroye,
            'Statut du dossier': this.getStatusLibelle(element.statutDossier),
            'Date du dernier statut': element.dateLastStatut
          };
          rowDataPME.push(row);
        } else if (element.beneficiaire.typeBeneficiaire == 'ME') {
          console.log("traitement des données si ME")

          let row = {
            'ID Bénéficiaire': element?.beneficiaire?.id,
            'Date de création': element?.dateCreation,
            'PMO': sigle,
            'Prénom': element?.beneficiaire?.prenom,
            'Nom': element?.beneficiaire?.nom,
            'Genre': this.getPersonneContactInfo(element?.beneficiaire)?.genre?.libelle,
            'Numéro de téléphone ': element?.beneficiaire?.telephone,
            'Adresse physique': element?.beneficiaire?.adresse,
            'Age': this.getPersonneContactInfo(element?.beneficiaire)?.age?.libelle,
            'Type de Pièce': (this.getPersonneContactInfo(element?.beneficiaire)?.numeroCNI > 8) ? 'Carte d\'identité Nationale' : 'Passport',
            'Numero de pièce': element?.beneficiaire?.numeroCNI,
            'Département': element?.beneficiaire?.zoneGeographique?.libelle,
            'Région': element?.beneficiaire?.zoneGeographique?.libelle,
            'Centre urbain ?': element?.beneficiaire?.centreUrbain,
            'Niveau instruction': element?.beneficiaire?.niveauInstruction?.libelle,
            'Nombre de personnes à charge au total (famille directe + dépendants hors famille directe)': element?.beneficiaire?.nombrePersonneACharge,
            'Nombre d\'emplois existants': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmplois,
            'Secteur d\'activité': element?.beneficiaire?.activiteBeneficiaires[0]?.secteurActivites[0]?.libelle,
            'Source du bénéficiaire': this.getSSourceLibelle(element?.beneficiaire?.source),
            'ID Demande': element.id,
            'Description du projet ou de l\'activité à financer': element.projets[0]?.description,
            'Coût du projet en Francs CFA': element.projets[0]?.cout,
            'Emplois à créer: employés permanents': element.projets[0]?.nombreEmploisPermanentMe,
            'Nombre d\'emplois additionnels créés avec ce financement ou projet': element.projets[0]?.nombreEmploisAdditionnelPermanent,
            'Nombre de femmes prévu': element.projets[0]?.nombreFemmePrevuePermanent,
            'Pourcentage de femmes': element.projets[0]?.pourcentageFemmePermanent,
            'Nombre de jeunes (< 35 ans) prévu': element.projets[0]?.nombreJeunePermanent,
            'Pourcentage de jeunes (< 35 ans)': element.projets[0]?.pourcentageJeunePermanent,
            'Emplois à créer: employés non permanents, prestataires, saisonniers, etc.': element.projets[0]?.nombreEmploisNonPermanentMe,
            'Nombre d\'emplois additionnels créés avec ce financement ou projet ': element.projets[0]?.nombreEmploisAdditionnelNonPermanent,
            'Nombre de femmes prévu ': element.projets[0]?.nombreFemmePrevueNonPermanent,
            'Pourcentage de femmes ': element.projets[0]?.pourcentageFemmeNonPermanent,
            'Nombre de jeunes (< 35 ans) prévu ': element.projets[0]?.nombreJeuneNonPermanent,
            'Pourcentage de jeunes (< 35 ans) ': element.projets[0]?.pourcentageJeuneNonPermanent,
            'Avez-vous déjà obtenu un financement dans le passé?': (element?.financementObtenus.length > 0) ? 'OUI' : 'NON',
            'Type de demande de financement': element.typeDemande,
            'Durée souhaitée en nombre de mois': element.duree,
            'Montant demandé en Francs CFA': element.montant,
            'Montant finalement octroyé en Francs CFA': element.montantOctroye,
            'Statut du dossier': this.getStatusLibelle(element.statutDossier),
            'Date du dernier statut': element.dateLastStatut


          };

          rowDataME.push(row);
        } else if (element.beneficiaire.typeBeneficiaire == 'GIE') {
          console.log("traitement des données si GIE")
          const row = {
            'ID Bénéficiaire': element?.beneficiaire?.id,
            'Date de création': element?.dateCreation,
            'PMO': sigle,
            'Prénom': this.getPersonneContactInfo(element.beneficiaire)?.prenom,
            'Nom': this.getPersonneContactInfo(element.beneficiaire)?.nom,
            'Numéro de téléphone': this.getPersonneContactInfo(element.beneficiaire)?.numeroMobile,
            'Adresse': this.getPersonneContactInfo(element.beneficiaire)?.adressePhysique,
            'Age': this.getPersonneContactInfo(element.beneficiaire)?.age?.libelle,
            'Type de Pièce': (this.getPersonneContactInfo(element?.beneficiaire)?.numeroCNI > 8) ? 'Carte d\'identité Nationale' : 'Passport',
            'Numero de pièce': this.getPersonneContactInfo(element?.beneficiaire)?.numeroCNI,
            'Niveau instruction': this.getPersonneContactInfo(element?.beneficiaire)?.niveauInstruction?.libelle,
            'Nom du groupement ': element.beneficiaire.nom,
            'Status juridique du groupement': element?.beneficiaire?.statusJuridique,
            'Adresse/Siège social ': element.beneficiaire?.adresse,
            'Date de création du groupement': element?.beneficiaire?.dateCreation,
            'Département': element?.beneficiaire?.zoneGeographique?.libelle,
            'Région': element?.beneficiaire?.zoneGeographique?.libelle,
            'Centre urbain ?': element?.beneficiaire?.centreUrbain,
            'Secteur d\'activité': element?.beneficiaire?.activiteBeneficiaires[0]?.secteurActivites[0]?.libelle,
            'Nombre d\'années d\'activité': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreAnneeActivite?.libelle,
            'Revenu total du Groupement N-1': element?.beneficiaire?.activiteBeneficiaires[0]?.revenueTotalAnMoins1,
            'Employés permanents de l\'entreprise ': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmployePermanent?.libelle,
            'Nombre exact à date': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmployePermanentExactAdate,
            'Nombre de femmes': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreFemmeEmployePermanent,
            'Pourcentage de femmes  ': element?.beneficiaire?.activiteBeneficiaires[0]?.pourcentageFemmeEmployePermanent,
            'Nombre de jeunes (< 35 ans)': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreJeuneEmployePermanent,
            'Pourcentage de jeunes (< 35 ans)  ': element?.beneficiaire?.activiteBeneficiaires[0]?.pourcentageJeuneEmployePermanent,
            'Membres non permanents, prestataires, saisonniers, etc.': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmployeNonPermanent?.libelle,
            '_Nombre exact à date': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmployeNonPermanentExactAdate,
            '_Nombre de femmes': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreFemmeEmployeNonPermanent,
            '_Pourcentage de femmes': element?.beneficiaire?.activiteBeneficiaires[0]?.pourcentageFemmeNonPermanent,
            '_Nombre de jeunes (< 35 ans)': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreJeuneEmployeNonPermanent,
            '_Pourcentage de jeunes (< 35 ans)': element?.beneficiaire?.activiteBeneficiaires[0]?.pourcentageJeuneNonPermanent,
            'Revenu / mois par membre le plus bas du groupement en Francs CFA': element?.beneficiaire?.activiteBeneficiaires[0]?.revenuplusBasParMois,
            'Revenu moyen par membre Francs CFA / mois ': element?.beneficiaire?.activiteBeneficiaires[0]?.revenuMoyenneParMois,
            'Nombre de personnes à charge en moyenne pour chaque membre du groupement': element?.beneficiaire?.activiteBeneficiaires[0]?.nombrePersonneAChargeMoyenne,
            'Source du bénéficiaire ': this.getSSourceLibelle(element?.beneficiaire?.source),
            'ID Demande': element.id,
            'Description du projet ou de l\'activité à financer': element.projets[0]?.description,
            'Coût du projet en Francs CFA': element.projets[0]?.cout,
            'Emplois à créer: employés permanents': element.projets[0]?.nombreEmploisPermanent?.libelle,
            'Nombre d\'emplois additionnels créés avec ce financement ou projet': element.projets[0]?.nombreEmploisAdditionnelPermanent,
            'Nombre de femmes prévu': element.projets[0]?.nombreFemmePrevuePermanent,
            'Pourcentage de femmes': element.projets[0]?.pourcentageFemmePermanent,
            'Nombre de jeunes (< 35 ans) prévu': element.projets[0]?.nombreJeunePermanent,
            'Pourcentage de jeunes (< 35 ans)': element.projets[0]?.pourcentageJeunePermanent,
            'Emplois à créer: employés non permanents, prestataires, saisonniers, etc.': element.projets[0]?.nombreEmploisNonPermanent?.libelle,
            'Nombre d\'emplois additionnels créés avec ce financement ou projet ': element.projets[0]?.nombreEmploisAdditionnelNonPermanent,
            'Nombre de femmes prévu ': element.projets[0]?.nombreFemmePrevueNonPermanent,
            'Pourcentage de femmes ': element.projets[0]?.pourcentageFemmeNonPermanent,
            'Nombre de jeunes (< 35 ans) prévu ': element.projets[0]?.nombreJeuneNonPermanent,
            'Pourcentage de jeunes (< 35 ans) ': element.projets[0]?.pourcentageJeuneNonPermanent,
            'Nombre de membres concernés': element?.beneficiaire?.nombreMembresConcernes,
            'Type de demande de financement': element.typeDemande,
            'Durée souhaitée en nombre de mois': element.duree,
            'Montant demandé en Francs CFA': element.montant,
            'Montant finalement octroyé en Francs CFA': element.montantOctroye,
            'Statut du dossier': this.getStatusLibelle(element.statutDossier),
            'Date du dernier statut': element.dateLastStatut

          };
          rowDataGIE.push(row);
        }
     }
    }
    this.pmoService.saveAsExcelFile(rowDataPME, rowDataME, rowDataGIE, 'list_demandes');
  }


  /*
    async exportAsExcelFileForDemande() {
      const beginDate = new Date(this.exportForm?.controls?.beginDate?.value);
      const endDate = new Date(this.exportForm?.controls?.endDate?.value);
      const strbeginDate = new Date(this.exportForm?.controls?.beginDate?.value).toJSON();
      const strendDate = new Date(this.exportForm?.controls?.endDate?.value).toJSON();

      console.log(strbeginDate);
      console.log(strendDate);
      if (beginDate > endDate) {
        this.isVisibleError = true;
        this.erreurMsg = 'Date de début supérieure à date fin';
        return;
      }
      const diffTime = Math.abs(endDate.getTime() - beginDate.getTime());
      // console.log()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
      // console.log(diffTime + " milliseconds");
      console.log(diffDays + " days");
      // if(diffDays>30){
      //   this.isVisibleError = true;
      //   this.erreurMsg = 'L\'intervalle ne peut dépasser 30 jours';
      //   return;
      // }
      // return;
      this.isSpinning = true;
      this.listeDemandeExport = await this.onGetAllDemandeExport(strbeginDate, strendDate, this.exportForm.controls.sources.value, this.exportForm.controls.statuts.value);
      this.isSpinning = false;
      console.log(this.listeDemandeExport);
      // return;
      // console.log('length '+this.demandesExport.length);
      let rowDataPME: any = [];
      let rowDataME: any = [];
      let rowDataGIE: any = [];

      for (let i = 0; i < this.listeDemandeExport[0].demandes.length; i++) {
        const element = this.listeDemandeExport[0].demandes[i];
        let categorisation = "";
        var dateActuelle = new Date();
        var dateAfter = new Date(element?.dateCreation).setMonth(new Date(element?.dateCreation).getMonth() + 3);

        // @ts-ignore
        if (dateActuelle > dateAfter) {
          categorisation = "Ancien Beneficiaire";
        } else {
          categorisation = "Nouveau bénéficiaire";
        }
        if (element.beneficiaire.typeBeneficiaire == 'PME') {
          // var row = {IDBeneficiaire:element.beneficiaire?.id, type:'Entreprise', dateRemboursement:element.dateRemboursement, typeDemande:element.typeDemande, valeurGarantie:element.valeurGarantie,dateMiseADisposition:element.dateMiseADisposition,
          //   montant:element.montant, dateCreation:element.dateCreation, statusFinancement:element.statusFinancement, tauxInteretAnnuelleSouhaite:element.tauxInteretAnnuelleSouhaite,
          //   nom:element?.beneficiaire?.denominationSociale, statutDossier:this.getStatusLibelle(element.statutDossier), denominationSociale:element.denominationSociale, duree:element.duree,
          //   montantOctroye:element.montantOctroye};

          let row = {
            'ID Bénéficiaire': element?.beneficiaire?.id,
            'ID Demande': element.id,
            'Numéro de téléphone personne contact du de l\'entrprise': element?.beneficiaire?.telephone,
            'PMO': this.listeDemandeExport[0]?.pmo?.sigle,

            'Adresse mail personne contact de l\'entreprise': this.getPersonneContactInfo(element?.beneficiaire)?.email,
            'Dénomination Sociale': element?.beneficiaire?.denominationSociale,
            'Numéro RCCM': element?.beneficiaire?.numeroRCCM,
            'Document RCCM': element?.beneficiaire?.documentRCCM,
            'NINEA': element?.beneficiaire?.ninea,
            'Document NINEA': element?.beneficiaire?.documentNinea,
            'Statut juridique de l\'entreprise': element?.beneficiaire?.statusJuridique,
            'Document de constitution (statuts sociétés, PV GIE, etc.)?': element?.beneficiaire?.documentConstitution,
            'Date de création': element?.dateCreation,
            'Adresse/Siège social': element?.beneficiaire?.adresse,
            'Zone': element?.beneficiaire?.zoneGeographique?.libelle,
            'Centre urbain ?': element?.beneficiaire?.centreUrbain,
            'Dirigeant 1': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.nom + ' ' + this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.prenom,
            'Dir 1 Prénom': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.prenom,
            'Dir 1 Nom': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.nom,
            'Dir 1 Genre': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.genre,
            'Dir 1 Age': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.age?.libelle,
            'Dir 1 Niveau ': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.niveauInstruction?.libelle,
            'Dir 1 Numero CNI ou passeport': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.numeroCNI,
            'Dir 1 Fonction dans l\'entreprise': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.titre?.libelle,
            'Dir 1 Niveau d\'instruction': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.niveauInstruction?.libelle,
            'Dir 1 Nombre de personnes à charge au total (famille directe + dépendants hors famille directe)': this.getPersonneDirigeantInfo(element?.beneficiaire)[0]?.nombrePersonneACharge,

            'Dirigeant 2': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.nom + ' ' + this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.prenom,
            'Dir 2 Prénom': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.prenom,
            'Dir 2 nom': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.nom,
            'Dir 2 Genre': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.genre?.libelle,
            'Dir 2 Age': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.age?.libelle,
            'Dir 2 Niveau ': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.niveauInstruction?.libelle,
            'Dir 2 Numero CNI ou passeport': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.numeroCNI,
            'Dir 2 Fonction dans l\'entreprise': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.titre.libelle,
            'Dir 2 Niveau d\'instruction': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.niveauInstruction?.libelle,
            'Dir 2 Nombre de personnes à charge au total (famille directe + dépendants hors famille directe)': this.getPersonneDirigeantInfo(element?.beneficiaire)[1]?.nombrePersonneACharge,

            'Dirigeant 3': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.nom + ' ' + this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.prenom,
            'Dir 3 Prénom': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.prenom,
            'Dir 3 Nom': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.nom,
            'Dir 3 Genre': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.genre?.libelle,
            'Dir 3 Age': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.age?.libelle,
            'Dir 3 Niveau ': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.niveauInstruction?.libelle,
            'Dir 3 Numero CNI ou passeport': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.numeroCNI,
            'Dir 3 Fonction dans l\'entreprise': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.titre.libelle,
            'Dir 3 Niveau d\'instruction': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.niveauInstruction?.libelle,
            'Dir 3 Nombre de personnes à charge au total (famille directe + dépendants hors famille directe)': this.getPersonneDirigeantInfo(element?.beneficiaire)[2]?.nombrePersonneACharge,

            'Dirigeant 4': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.nom + ' ' + this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.prenom,
            'Dir 4 Prénom': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.prenom,
            'Dir 4 Nom': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.nom,
            'Dir 4 Genre': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.genre?.libelle,
            'Dir 4 Age': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.age?.libelle,
            'Dir 4 Niveau ': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.niveauInstruction?.libelle,
            'Dir 4 Numero CNI ou passeport': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.numeroCNI,
            'Dir 4 Fonction dans l\'entreprise': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.titre.libelle,
            'Dir 4 Niveau d\'instruction': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.niveauInstruction?.libelle,
            'Dir 4 Nombre de personnes à charge au total (famille directe + dépendants hors famille directe)': this.getPersonneDirigeantInfo(element?.beneficiaire)[3]?.nombrePersonneACharge,

            'Associé 1': this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.nom + ' ' + this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.prenom,
            'Ass 1 Prénom': this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.prenom,
            'Ass 1 Nom': this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.nom,
            'Ass 1 Genre': this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.genre?.libelle,
            'Ass 1 Age': this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.age?.libelle,
            'Ass 1 Numero CNI ou passeport': this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.numeroCNI,
            'Ass 1 Pourcentage de détention du capital': this.getPersonneAssocieInfo(element?.beneficiaire)[0]?.pourcentageDetenueCapital,

            'Associé 2': this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.nom + ' ' + this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.prenom,
            'Ass 2 Prénom': this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.prenom,
            'Ass 2 Nom': this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.nom,
            'Ass 2 Genre': this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.genre?.libelle,
            'Ass 2 Age': this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.age?.libelle,
            'Ass 2 Numero CNI ou passeport': this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.numeroCNI,
            'Ass 2 Pourcentage de détention du capital': this.getPersonneAssocieInfo(element?.beneficiaire)[1]?.pourcentageDetenueCapital,

            'Associé 3': this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.nom + ' ' + this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.prenom,
            'Ass 3 Prénom': this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.prenom,
            'Ass 3 Nom': this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.nom,
            'Ass 3 Genre': this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.genre?.libelle,
            'Ass 3 Age': this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.age?.libelle,
            'Ass 3 Numero CNI ou passeport': this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.numeroCNI,
            'Ass 3 Pourcentage de détention du capital': this.getPersonneAssocieInfo(element?.beneficiaire)[2]?.pourcentageDetenueCapital,

            'Associé 4': this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.nom + ' ' + this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.prenom,
            'Ass 4 Prénom': this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.prenom,
            'Ass 4 Nom': this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.nom,
            'Ass 4 Genre': this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.genre?.libelle,
            'Ass 4 Age': this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.age?.libelle,
            'Ass 4 Numero CNI ou passeport': this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.numeroCNI,
            'Ass 4 Pourcentage de détention du capital': this.getPersonneAssocieInfo(element?.beneficiaire)[3]?.pourcentageDetenueCapital,
            'Source du beneficiaire': element?.beneficiaire?.source,
            'Secteur d\'activité': element?.beneficiaire?.activiteBeneficiaires[0]?.secteurActivites[0]?.libelle,
            'Secteur d\'activité (si pas répertoriée dans la liste déroulante)': element?.beneficiaire?.activiteBeneficiaires[0]?.autreSecteurActivite,
            'Nombre d\'années d\'activité': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreAnneeActivite?.libelle,
            'Chiffre affaire 2021': element?.beneficiaire?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois2 ? element?.beneficiaire?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois2 : element?.beneficiaire?.activiteBeneficiaires[0]?.revenueTotalAnMoins2,
            'Chiffre affaire 2022': element?.beneficiaire?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois1 ? element?.beneficiaire?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois1 : element?.beneficiaire?.activiteBeneficiaires[0]?.revenueTotalAnMoins1,
            'Etats financiers 2021 (fournir états certifiés si applicable) ': element?.beneficiaire?.activiteBeneficiaires[0]?.etatFinancierAnMois2,
            'Etats financiers 2022 (fournir états certifiés si applicable) ': element?.beneficiaire?.activiteBeneficiaires[0]?.etatFinancierAnMois1,
            'Employés permanents de l\'entreprise ': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmployePermanent?.libelle,
            'Nombre exact à date': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmployePermanentExactAdate,
            'Nombre de femmes': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreFemmeEmployePermanent,
            'Pourcentage de femmes   ': element?.beneficiaire?.activiteBeneficiaires[0]?.pourcentageFemmeEmployePermanent,
            'Nombre de jeunes (< 35 ans)': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreJeuneEmployePermanent,
            'Pourcentage de jeunes (< 35 ans)  ': element?.beneficiaire?.activiteBeneficiaires[0]?.pourcentageJeuneEmployePermanent,
            'Employés non permanents, prestataires, saisonniers, etc.': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmployeNonPermanent?.libelle,
            '_Nombre exact à date': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmployeNonPermanentExactAdate,
            '_Nombre de femmes': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreFemmeEmployeNonPermanent,
            '_Pourcentage de femmes': element?.beneficiaire?.activiteBeneficiaires[0]?.pourcentageFemmeNonPermanent,
            '_Nombre de jeunes (< 35 ans)': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreJeuneEmployeNonPermanent,
            '_Pourcentage de jeunes (< 35 ans)': element?.beneficiaire?.activiteBeneficiaires[0]?.pourcentageJeuneNonPermanent,
            'Salaire net / mois le plus bas dans l\'entreprise en Francs CFA  ': element?.beneficiaire?.activiteBeneficiaires[0]?.revenuplusBasParMois,
            'Salaire net moyen / mois dans l\'entreprise en Francs CFA': element?.beneficiaire?.activiteBeneficiaires[0]?.revenuMoyenneParMois,
            'source': element?.beneficiaire.source,
            'Catégorisation du bénéficiaire': categorisation,

            'Description du projet ou de l\'activité à financer': element.projets[0]?.description,
            'Coût du projet en Francs CFA': element.projets[0]?.cout,
            'Business Plan': element.projets[0]?.businessPlan,
            'Complémnts d\'information': element.projets[0]?.complementInformations,
            'Emplois à créer: employés permanents': element.projets[0]?.nombreEmploisPermanent?.libelle,
            'Nombre d\'emplois additionnels créés avec ce financement ou projet': element.projets[0]?.nombreEmploisAdditionnelPermanent,
            'Nombre de femmes prévu': element.projets[0]?.nombreFemmePrevuePermanent,
            'Pourcentage de femmes': element.projets[0]?.pourcentageFemmePermanent,
            'Nombre de jeunes (< 35 ans) prévu': element.projets[0]?.nombreJeunePermanent,
            'Pourcentage de jeunes (< 35 ans)': element.projets[0]?.pourcentageJeunePermanent,
            'Emplois à créer: employés non permanents, prestataires, saisonniers, etc.': element.projets[0]?.nombreEmploisNonPermanent?.libelle,
            'Nombre d\'emplois additionnels créés avec ce financement ou projet ': element.projets[0]?.nombreEmploisAdditionnelNonPermanent,
            'Nombre de femmes prévu ': element.projets[0]?.nombreFemmePrevueNonPermanent,
            'Pourcentage de femmes ': element.projets[0]?.pourcentageFemmeNonPermanent,
            'Nombre de jeunes (< 35 ans) prévu ': element.projets[0]?.nombreJeuneNonPermanent,
            'Pourcentage de jeunes (< 35 ans) ': element.projets[0]?.pourcentageJeuneNonPermanent,
            'Type de demande de financement': element.typeDemande,
            'Montant demandé en Francs CFA': element.montant,
            '% Apport': element.apport,
            'Garanties proposées ': element.garantie?.libelle,
            'Valeur des garanties en Francs CFA': element.valeurGarantie,
            'Taux d\'intérêt annuel hors taxe souhaité': element.tauxInteretAnnuelleSouhaite,
            'Durée souhaitée en nombre de mois': element.duree,

            'Financement déjà obtenu ou en cours - 1': '',
            'Institution financière': element.financementObtenus[0]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante)': element.financementObtenus[0]?.autreInstitutionFinanciere,
            'Type de crédit': element.financementObtenus[0]?.typeCredit,
            'Montant en Francs CFA': element.financementObtenus[0]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable': element.financementObtenus[0]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement': element.financementObtenus[0]?.dateFinancement,
            'Statut du financement': element.financementObtenus[0]?.statusFinancement,
            'Si financement en cours, fournir tableaux d\'amortissements': element.financementObtenus[0]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé': element.financementObtenus[0]?.dateRemboursement,

            'Financement déjà obtenu ou en cours - 2': '',
            'Institution financière ': element.financementObtenus[1]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante) ': element.financementObtenus[1]?.autreInstitutionFinanciere,
            'Type de crédit ': element.financementObtenus[1]?.typeCredit,
            'Montant en Francs CFA ': element.financementObtenus[1]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable ': element.financementObtenus[1]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement ': element.financementObtenus[1]?.dateFinancement,
            'Statut du financement ': element.financementObtenus[1]?.statusFinancement,
            'Si financement en cours, fournir tableaux d\'amortissements ': element.financementObtenus[1]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé ': element.financementObtenus[1]?.dateRemboursement,

            'Financement déjà obtenu ou en cours - 3': '',
            'Institution financière  ': element.financementObtenus[2]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante)  ': element.financementObtenus[2]?.autreInstitutionFinanciere,
            'Type de crédit  ': element.financementObtenus[2]?.typeCredit,
            'Montant en Francs CFA  ': element.financementObtenus[2]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable  ': element.financementObtenus[2]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement  ': element.financementObtenus[2]?.dateFinancement,
            'Statut du financement  ': element.financementObtenus[2]?.statusFinancement, 'Statut pour Analyse  ': '',
            'Si financement en cours, fournir tableaux d\'amortissements  ': element.financementObtenus[2]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé  ': element.financementObtenus[2]?.dateRemboursement,

            'Financement déjà obtenu ou en cours - 4': '',
            'Institution financière   ': element.financementObtenus[3]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante)   ': element.financementObtenus[3]?.autreInstitutionFinanciere,
            'Type de crédit   ': element.financementObtenus[3]?.typeCredit,
            'Montant en Francs CFA   ': element.financementObtenus[3]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable   ': element.financementObtenus[3]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement   ': element.financementObtenus[3]?.dateFinancement,
            'Statut du financement   ': element.financementObtenus[3]?.statusFinancement,
            'Si financement en cours, fournir tableaux d\'amortissements   ': element.financementObtenus[3]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé   ': element.financementObtenus[3]?.dateRemboursement,

            'Financement déjà obtenu ou en cours - 5': '',
            'Institution financière    ': element.financementObtenus[4]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante)    ': element.financementObtenus[4]?.autreInstitutionFinanciere,
            'Type de crédit    ': element.financementObtenus[4]?.typeCredit,
            'Montant en Francs CFA    ': element.financementObtenus[4]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable    ': element.financementObtenus[4]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement    ': element.financementObtenus[4]?.dateFinancement,
            'Statut du financement    ': element.financementObtenus[4]?.statusFinancement,

            'Si financement en cours, fournir tableaux d\'amortissements    ': element.financementObtenus[4]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé    ': element.financementObtenus[4]?.dateRemboursement,

            'Financement déjà obtenu ou en cours - 6': '',
            'Institution financière     ': element.financementObtenus[5]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante)     ': element.financementObtenus[5]?.autreInstitutionFinanciere,
            'Type de crédit     ': element.financementObtenus[5]?.typeCredit,
            'Montant en Francs CFA     ': element.financementObtenus[5]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable     ': element.financementObtenus[5]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement     ': element.financementObtenus[5]?.dateFinancement,
            'Statut du financement     ': element.financementObtenus[5]?.statusFinancement,
            'Si financement en cours, fournir tableaux d\'amortissements     ': element.financementObtenus[5]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé     ': element.financementObtenus[5]?.dateRemboursement,

            'Date de première mise à disposition d\'un financement à ce bénéficiaire par le partenaire': element.dateMiseADisposition,
            'Date de signature de l\'Accord de gestion': element.dateSignatureAccord,
            'Montant finalement octroyé en Francs CFA': element.montantOctroye,
            'Pourcentage par rapport à la demande initiale': '',
            'Garanties demandées': element.garantieDemandes,
            'Durée du crédit en nombre de mois': element.dureeCredit,
            'Taux d\'intérêt annuel HT': element.tauxInteretAnnuelHT,
            'Taux d\'intérêt annuel TTC': element.tauxInteretAnnuelTTC,
            'Taux d\'intérêt annuel TEG': element.tauxInteretAnnuelTEG,
            'Statut du dossier': this.getStatusLibelle(element.statutDossier),
            'Date du dernier statut': element.dateLastStatut, 'Si dossier incomplet': '',
            'Si dossier rejeté, renseigner les raisons': element.commentaires[element.commentaires?.length - 1]?.comment,
            'Si dossier rejeté, renseigner les raisons (si pas répertoriée dans la liste déroulante)': '',
            'Si dossier approuvé, fournir les scans du contrat de prêt et les tableaux d\'amortissement': '',
            'Montant recouvré à date': '',

          };

          rowDataPME.push(row);
        } else if (element.beneficiaire.typeBeneficiaire == 'ME') {
          // let row = {IDBeneficiaire:element.beneficiaire?.id, type:'Micro-entrepreneur', dateRemboursement:element.dateRemboursement, typeDemande:element.typeDemande, valeurGarantie:element.valeurGarantie,dateMiseADisposition:element.dateMiseADisposition,
          // montant:element.montant, dateCreation:element.dateCreation, statusFinancement:element.statusFinancement, tauxInteretAnnuelleSouhaite:element.tauxInteretAnnuelleSouhaite,
          // nom:element?.beneficiaire?.prenom + ' '+element?.beneficiaire?.nom, statutDossier:this.getStatusLibelle(element.statutDossier), denominationSociale:element.denominationSociale, duree:element.duree,
          // montantOctroye:element.montantOctroye};
          let chiffremoins1 = "";
          let chiffremoins2 = "";
          if (element?.beneficiaire?.source?.name == "MIGRATION_BO") {
            chiffremoins1 = element?.beneficiaire?.chiffreAffaireHorsTaxeAnMois1 != null ? element?.beneficiaire?.chiffreAffaireHorsTaxeAnMois1 : "";
            chiffremoins2 = element?.beneficiaire?.chiffreAffaireHorsTaxeAnMois2 != null ? element?.beneficiaire?.chiffreAffaireHorsTaxeAnMois2 : "";

          } else if (!(element?.beneficiaire?.source?.name == "MIGRATION_BO") && element?.beneficiaire?.activiteBeneficiaires[0] != null) {
            chiffremoins1 = element?.beneficiaire?.activiteBeneficiaires[0] != null && element?.beneficiaire?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois1 != null ? element?.beneficiaire?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois1 : element?.beneficiaire?.activiteBeneficiaires[0]?.revenueTotalAnMoins1;
            chiffremoins2 = element?.beneficiaire?.activiteBeneficiaires[0] != null && element?.beneficiaire?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois2 != null ? element?.beneficiaire?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois2 : element?.beneficiaire?.activiteBeneficiaires[0]?.revenueTotalAnMoins2;

          }

          let row = {
            'ID Bénéficiaire': element?.beneficiaire?.id,
            'ID Demande': element.id,
            'Numéro de téléphone ': element?.beneficiaire?.telephone,
            'PMO': this.listeDemandeExport[0].pmo?.sigle,
            'Prénom': element?.beneficiaire?.prenom,
            'Nom': element?.beneficiaire?.nom,
            'Genre': this.getPersonneContactInfo(element?.beneficiaire)?.genre?.libelle,
            'Email': this.getPersonneContactInfo(element?.beneficiaire)?.email,
            'Adresse physique': element?.beneficiaire?.adresse,
            'Zone': element?.beneficiaire?.zoneGeographique?.libelle,
            'Centre urbain ?': element?.beneficiaire?.centreUrbain,
            'Chiffre affaire 2021': chiffremoins2,
            'Chiffre affaire 2022': chiffremoins1,
            'Age': this.getPersonneContactInfo(element?.beneficiaire)?.age?.libelle,
            'Numero CNI ou Document Identification': element?.beneficiaire?.numeroCNI,
            'Scan CNI ou Document Identification': element?.beneficiaire?.scanNumeroCNI,
            'Niveau instruction': element?.beneficiaire?.niveauInstruction?.libelle,
            'Nombre de personnes à charge au total (famille directe + dépendants hors famille directe)': element?.beneficiaire?.nombrePersonneACharge,
            'Occupation': element?.beneficiaire?.activiteBeneficiaires[0]?.occupation,
            'Nombre d\'années d\'activité': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreAnneeActivite?.libelle,
            'Nombre d\'emplois existants': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmplois,
            'Secteur d\'activité': element?.beneficiaire?.activiteBeneficiaires[0]?.secteurActivites[0]?.libelle,
            'Secteur d\'activité (si pas répertoriée dans la liste déroulante)': element?.beneficiaire?.activiteBeneficiaires[0]?.autreSecteurActivite,
            'Source du bénéficiaire': element?.beneficiaire?.source,
            'Catégorisation du bénéficiaire': categorisation,
            'Description du projet ou de l\'activité à financer': element.projets[0]?.description,
            'Coût du projet en Francs CFA': element.projets[0]?.cout,
            'Emplois à créer: employés permanents': element.projets[0]?.nombreEmploisPermanentMe,
            'Nombre d\'emplois additionnels créés avec ce financement ou projet': element.projets[0]?.nombreEmploisAdditionnelPermanent,
            'Nombre de femmes prévu': element.projets[0]?.nombreFemmePrevuePermanent,
            'Pourcentage de femmes': element.projets[0]?.pourcentageFemmePermanent,
            'Nombre de jeunes (< 35 ans) prévu': element.projets[0]?.nombreJeunePermanent,
            'Pourcentage de jeunes (< 35 ans)': element.projets[0]?.pourcentageJeunePermanent,
            'Emplois à créer: employés non permanents, prestataires, saisonniers, etc.': element.projets[0]?.nombreEmploisNonPermanentMe,
            'Nombre d\'emplois additionnels créés avec ce financement ou projet ': element.projets[0]?.nombreEmploisAdditionnelNonPermanent,
            'Nombre de femmes prévu ': element.projets[0]?.nombreFemmePrevueNonPermanent,
            'Pourcentage de femmes ': element.projets[0]?.pourcentageFemmeNonPermanent,
            'Nombre de jeunes (< 35 ans) prévu ': element.projets[0]?.nombreJeuneNonPermanent,
            'Pourcentage de jeunes (< 35 ans) ': element.projets[0]?.pourcentageJeuneNonPermanent,
            'Salaire le plus bas de l\'entreprise en Francs CFA ': element.projets[0]?.salairePlusBas,
            'Salaire moyen de l\'entreprise en  Francs CFA  ': element.projets[0]?.salaireMoyen,
            'Type de demande de financement': element.typeDemande,
            'Montant demandé en Francs CFA': element.montant,
            '% Apport': element.apport,
            'Garanties proposées ': element.garantie?.libelle,
            'Valeur des garanties en Francs CFA': element.valeurGarantie,
            'Taux d\'intérêt annuel hors taxe souhaité': element.tauxInteretAnnuelleSouhaite,
            'Durée souhaitée en nombre de mois': element.duree,

            'Financement déjà obtenu ou en cours - 1': '',
            'Institution financière': element.financementObtenus[0]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante)': element.financementObtenus[0]?.autreInstitutionFinanciere,
            'Type de crédit': element.financementObtenus[0]?.typeCredit,
            'Montant en Francs CFA': element.financementObtenus[0]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable': element.financementObtenus[0]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement': element.financementObtenus[0]?.dateFinancement,
            'Statut du financement': element.financementObtenus[0]?.statusFinancement,
            'Si financement en cours, fournir tableaux d\'amortissements': element.financementObtenus[0]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé': element.financementObtenus[0]?.dateRemboursement,

            'Financement déjà obtenu ou en cours - 2': '',
            'Institution financière ': element.financementObtenus[1]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante) ': element.financementObtenus[1]?.autreInstitutionFinanciere,
            'Type de crédit ': element.financementObtenus[1]?.typeCredit,
            'Montant en Francs CFA ': element.financementObtenus[1]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable ': element.financementObtenus[1]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement ': element.financementObtenus[1]?.dateFinancement,
            'Statut du financement ': element.financementObtenus[1]?.statusFinancement,
            'Si financement en cours, fournir tableaux d\'amortissements ': element.financementObtenus[1]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé ': element.financementObtenus[1]?.dateRemboursement,

            'Financement déjà obtenu ou en cours - 3': '',
            'Institution financière  ': element.financementObtenus[2]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante)  ': element.financementObtenus[2]?.autreInstitutionFinanciere,
            'Type de crédit  ': element.financementObtenus[2]?.typeCredit,
            'Montant en Francs CFA  ': element.financementObtenus[2]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable  ': element.financementObtenus[2]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement  ': element.financementObtenus[2]?.dateFinancement,
            'Statut du financement  ': element.financementObtenus[2]?.statusFinancement,
            'Si financement en cours, fournir tableaux d\'amortissements  ': element.financementObtenus[2]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé  ': element.financementObtenus[2]?.dateRemboursement,

            'Financement déjà obtenu ou en cours - 4': '',
            'Institution financière   ': element.financementObtenus[3]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante)   ': element.financementObtenus[3]?.autreInstitutionFinanciere,
            'Type de crédit   ': element.financementObtenus[3]?.typeCredit,
            'Montant en Francs CFA   ': element.financementObtenus[3]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable   ': element.financementObtenus[3]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement   ': element.financementObtenus[3]?.dateFinancement,
            'Statut du financement   ': element.financementObtenus[3]?.statusFinancement,
            'Si financement en cours, fournir tableaux d\'amortissements   ': element.financementObtenus[3]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé   ': element.financementObtenus[3]?.dateRemboursement,

            'Financement déjà obtenu ou en cours - 5': '',
            'Institution financière    ': element.financementObtenus[4]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante)    ': element.financementObtenus[4]?.autreInstitutionFinanciere,
            'Type de crédit    ': element.financementObtenus[4]?.typeCredit,
            'Montant en Francs CFA    ': element.financementObtenus[4]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable    ': element.financementObtenus[4]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement    ': element.financementObtenus[4]?.dateFinancement,
            'Statut du financement    ': element.financementObtenus[4]?.statusFinancement,
            'Si financement en cours, fournir tableaux d\'amortissements    ': element.financementObtenus[4]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé    ': element.financementObtenus[4]?.dateRemboursement,

            'Financement déjà obtenu ou en cours - 6': '',
            'Institution financière     ': element.financementObtenus[5]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante)     ': element.financementObtenus[5]?.autreInstitutionFinanciere,
            'Type de crédit     ': element.financementObtenus[5]?.typeCredit,
            'Montant en Francs CFA     ': element.financementObtenus[5]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable     ': element.financementObtenus[5]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement     ': element.financementObtenus[5]?.dateFinancement,
            'Statut du financement     ': element.financementObtenus[5]?.statusFinancement,
            'Si financement en cours, fournir tableaux d\'amortissements     ': element.financementObtenus[5]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé     ': element.financementObtenus[5]?.dateRemboursement,

            'Date de première mise à disposition d\'un financement à ce bénéficiaire par le partenaire': element.dateMiseADisposition,
            'Date de signature de l\'Accord de gestion': element.dateSignatureAccord,
            'Montant finalement octroyé en Francs CFA': element.montantOctroye,
            'Pourcentage par rapport à la demande initiale': '',
            'Garanties demandées': element.garantieDemandes,
            'Durée du crédit en nombre de mois': element.dureeCredit,
            'Taux d\'intérêt annuel HT': element.tauxInteretAnnuelHT,
            'Taux d\'intérêt annuel TTC': element.tauxInteretAnnuelTTC,
            'Taux d\'intérêt annuel TEG': element.tauxInteretAnnuelTEG,
            'Statut du dossier': this.getStatusLibelle(element.statutDossier),
            'Date du dernier statut': element.dateLastStatut,
            'Si dossier incomplet': '',
            'Si dossier rejeté, renseigner les raisons': element.commentaires[element.commentaires?.length - 1]?.comment,
            'Si dossier rejeté, renseigner les raisons (si pas répertoriée dans la liste déroulante)': '',
            'Si dossier approuvé, fournir les scans du contrat de prêt et les tableaux d\'amortissement': '',
            'Montant recouvré à date': '',


          };

          rowDataME.push(row);
        } else if (element.beneficiaire.typeBeneficiaire == 'GIE') {
          const row = {
            'ID Bénéficiaire': element?.beneficiaire?.id,
            'ID Demande': element.id,
            'Numéro de téléphone personne contact du groupement  ': element.beneficiaire?.telephone,
            'PMO': this.listeDemandeExport[0].pmo?.sigle,

            'Adresse mail personne contact du groupement  ': this.getPersonneContactInfo(element.beneficiaire)?.email,
            'Nom du groupement ': element.beneficiaire.nom,
            'Adresse/Siège social ': element.beneficiaire?.adresse,
            'Zone': element?.beneficiaire?.zoneGeographique?.libelle,
            'Centre urbain ?': element?.beneficiaire?.centreUrbain,
            'Date de création': element?.dateCreation,
            'Status juridique du groupement': element?.beneficiaire?.statusJuridique,
            'Document de constitution (statuts sociétés, PV GIE, etc.)? ': '',
            'Secteur d\'activité': element?.beneficiaire?.activiteBeneficiaires[0]?.secteurActivites[0]?.libelle,
            'Secteur d\'activité (si pas répertoriée dans la liste déroulante)': element?.beneficiaire?.activiteBeneficiaires[0]?.autreSecteurActivite,
            'Nombre d\'années d\'activité': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreAnneeActivite?.libelle,
            'Revenu total du Groupement en 2021': element?.beneficiaire?.activiteBeneficiaires[0]?.revenueTotalAnMoins2,
            'Revenu total du Groupement en 2022': element?.beneficiaire?.activiteBeneficiaires[0]?.revenueTotalAnMoins1,
            'Employés permanents de l\'entreprise ': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmployePermanent?.libelle,
            'Nombre exact à date': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmployePermanentExactAdate,
            'Nombre de femmes': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreFemmeEmployePermanent,
            'Pourcentage de femmes  ': element?.beneficiaire?.activiteBeneficiaires[0]?.pourcentageFemmeEmployePermanent,
            'Nombre de jeunes (< 35 ans)': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreJeuneEmployePermanent,
            'Pourcentage de jeunes (< 35 ans)  ': element?.beneficiaire?.activiteBeneficiaires[0]?.pourcentageJeuneEmployePermanent,
            'Membres non permanents, prestataires, saisonniers, etc.': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmployeNonPermanent?.libelle,
            '_Nombre exact à date': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreEmployeNonPermanentExactAdate,
            '_Nombre de femmes': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreFemmeEmployeNonPermanent,
            '_Pourcentage de femmes': element?.beneficiaire?.activiteBeneficiaires[0]?.pourcentageFemmeNonPermanent,
            '_Nombre de jeunes (< 35 ans)': element?.beneficiaire?.activiteBeneficiaires[0]?.nombreJeuneEmployeNonPermanent,
            '_Pourcentage de jeunes (< 35 ans)': element?.beneficiaire?.activiteBeneficiaires[0]?.pourcentageJeuneNonPermanent,

            'Revenu / mois par membre le plus bas du groupement en Francs CFA': element?.beneficiaire?.activiteBeneficiaires[0]?.revenuplusBasParMois,
            'Revenu moyen par membre Francs CFA / mois ': element?.beneficiaire?.activiteBeneficiaires[0]?.revenuMoyenneParMois,
            'Nombre de personnes à charge en moyenne pour chaque membre du groupement': element?.beneficiaire?.activiteBeneficiaires[0]?.nombrePersonneAChargeMoyenne,
            'Source du bénéficiaire ': element?.beneficiaire?.source,
            'Catégorisation du bénéficiaire ': categorisation,
            /!*         'Age': this.getPersonneContactInfo(element.beneficiaire)?.age?.libelle,
                     'Numero CNI ou Document Identification': this.getPersonneContactInfo(element.beneficiaire)?.numeroCNI,
                     'Niveau d\'instruction ': this.getPersonneContactInfo(element.beneficiaire)?.niveauInstruction?.libelle,
                     'Nom du groupement': element.beneficiaire?.nom,
                     'Adresse mail du groupement': element?.beneficiaire?.email,
                     'Adresse': element?.beneficiaire?.adresse,*!/
            'Description du projet ou de l\'activité à financer': element.projets[0]?.description,
            'Coût du projet en Francs CFA': element.projets[0]?.cout,
            'Business Plan': element.projets[0]?.businessPlan,
            'Compléments d\'informations': element.projets[0]?.complementInformations,
            'Emplois à créer: employés permanents': element.projets[0]?.nombreEmploisPermanent?.libelle,
            'Nombre d\'emplois additionnels créés avec ce financement ou projet': element.projets[0]?.nombreEmploisAdditionnelPermanent,
            'Nombre de femmes prévu': element.projets[0]?.nombreFemmePrevuePermanent,
            'Pourcentage de femmes': element.projets[0]?.pourcentageFemmePermanent,
            'Nombre de jeunes (< 35 ans) prévu': element.projets[0]?.nombreJeunePermanent,
            'Pourcentage de jeunes (< 35 ans)': element.projets[0]?.pourcentageJeunePermanent,
            'Emplois à créer: employés non permanents, prestataires, saisonniers, etc.': element.projets[0]?.nombreEmploisNonPermanent?.libelle,
            'Nombre d\'emplois additionnels créés avec ce financement ou projet ': element.projets[0]?.nombreEmploisAdditionnelNonPermanent,
            'Nombre de femmes prévu ': element.projets[0]?.nombreFemmePrevueNonPermanent,
            'Pourcentage de femmes ': element.projets[0]?.pourcentageFemmeNonPermanent,
            'Nombre de jeunes (< 35 ans) prévu ': element.projets[0]?.nombreJeuneNonPermanent,
            'Pourcentage de jeunes (< 35 ans) ': element.projets[0]?.pourcentageJeuneNonPermanent,

            'Type de demande de financement': element.typeDemande,
            'Montant demandé en Francs CFA': element.montant,
            'Nombre de membres concernés': element.nombreMembresConcernes,
            'Montant demandé en Francs CFA / par membre': element.montantDemandeParMembre,
            '% Apport': element.apport,
            'Garanties proposées ': element.garantie?.libelle,
            'Valeur des garanties en Francs CFA': element.valeurGarantie,
            'Taux d\'intérêt annuel hors taxe souhaité': element.tauxInteretAnnuelleSouhaite,
            'Durée souhaitée en nombre de mois': element.duree,

            'Financement déjà obtenu ou en cours - 1': '',
            'Institution financière': element.financementObtenus[0]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante)': element.financementObtenus[0]?.autreInstitutionFinanciere,
            'Type de crédit': element.financementObtenus[0]?.typeCredit,
            'Montant en Francs CFA': element.financementObtenus[0]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable': element.financementObtenus[0]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement': element.financementObtenus[0]?.dateFinancement,
            'Statut du financement': element.financementObtenus[0]?.statusFinancement,
            'Si financement en cours, fournir tableaux d\'amortissements': element.financementObtenus[0]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé': element.financementObtenus[0]?.dateRemboursement,

            'Financement déjà obtenu ou en cours - 2': '',
            'Institution financière ': element.financementObtenus[1]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante) ': element.financementObtenus[1]?.autreInstitutionFinanciere,
            'Type de crédit ': element.financementObtenus[1]?.typeCredit,
            'Montant en Francs CFA ': element.financementObtenus[1]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable ': element.financementObtenus[1]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement ': element.financementObtenus[1]?.dateFinancement,
            'Statut du financement ': element.financementObtenus[1]?.statusFinancement,
            'Si financement en cours, fournir tableaux d\'amortissements ': element.financementObtenus[1]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé ': element.financementObtenus[1]?.dateRemboursement,

            'Financement déjà obtenu ou en cours - 3': '',
            'Institution financière  ': element.financementObtenus[2]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante)  ': element.financementObtenus[2]?.autreInstitutionFinanciere,
            'Type de crédit  ': element.financementObtenus[2]?.typeCredit,
            'Montant en Francs CFA  ': element.financementObtenus[2]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable  ': element.financementObtenus[2]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement  ': element.financementObtenus[2]?.dateFinancement,
            'Statut du financement  ': element.financementObtenus[2]?.statusFinancement,
            'Si financement en cours, fournir tableaux d\'amortissements  ': element.financementObtenus[2]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé  ': element.financementObtenus[2]?.dateRemboursement,

            'Financement déjà obtenu ou en cours - 4': '',
            'Institution financière   ': element.financementObtenus[3]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante)   ': element.financementObtenus[3]?.autreInstitutionFinanciere,
            'Type de crédit   ': element.financementObtenus[3]?.typeCredit,
            'Montant en Francs CFA   ': element.financementObtenus[3]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable   ': element.financementObtenus[3]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement   ': element.financementObtenus[3]?.dateFinancement,
            'Statut du financement   ': element.financementObtenus[3]?.statusFinancement,
            'Si financement en cours, fournir tableaux d\'amortissements   ': element.financementObtenus[3]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé   ': element.financementObtenus[3]?.dateRemboursement,

            'Financement déjà obtenu ou en cours - 5': '',
            'Institution financière    ': element.financementObtenus[4]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante)    ': element.financementObtenus[4]?.autreInstitutionFinanciere,
            'Type de crédit    ': element.financementObtenus[4]?.typeCredit,
            'Montant en Francs CFA    ': element.financementObtenus[4]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable    ': element.financementObtenus[4]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement    ': element.financementObtenus[4]?.dateFinancement,
            'Statut du financement    ': element.financementObtenus[4]?.statusFinancement,

            'Si financement en cours, fournir tableaux d\'amortissements    ': element.financementObtenus[4]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé    ': element.financementObtenus[4]?.dateRemboursement,

            'Financement déjà obtenu ou en cours - 6': '',
            'Institution financière     ': element.financementObtenus[5]?.institutionFinanciere,
            'Autre institution financière (si pas répertoriée dans la liste déroulante)     ': element.financementObtenus[5]?.autreInstitutionFinanciere,
            'Type de crédit     ': element.financementObtenus[5]?.typeCredit,
            'Montant en Francs CFA     ': element.financementObtenus[5]?.montant,
            'Taux d\'intérêt annuel hors taxe applicable     ': element.financementObtenus[5]?.tauxInteretAnnuelHT,
            'Date de mise en place du financement     ': element.financementObtenus[5]?.dateFinancement,
            'Statut du financement     ': element.financementObtenus[5]?.statusFinancement,
            'Si financement en cours, fournir tableaux d\'amortissements     ': element.financementObtenus[5]?.tableauAmortissement,
            'Date de remboursement intégral, si remboursement terminé     ': element.financementObtenus[5]?.dateRemboursement,

            'Date de première mise à disposition d\'un financement à ce bénéficiaire par le partenaire': element.dateMiseADisposition,
            'Date de signature de l\'Accord de gestion': element.dateSignatureAccord,
            'Montant finalement octroyé en Francs CFA': element.montantOctroye,
            'Pourcentage par rapport à la demande initiale': '',
            'Garanties demandées': element.garantieDemandes,
            'Durée du crédit en nombre de mois': element.dureeCredit,
            'Taux d\'intérêt annuel HT': element.tauxInteretAnnuelHT,
            'Taux d\'intérêt annuel TTC': element.tauxInteretAnnuelTTC,
            'Taux d\'intérêt annuel TEG': element.tauxInteretAnnuelTEG,
            'Statut du dossier': this.getStatusLibelle(element.statutDossier),
            'Date du dernier statut': element.dateLastStatut,
            'Si dossier incomplet': '',
            'Si dossier rejeté, renseigner les raisons': element.commentaires[element.commentaires?.length - 1]?.comment,
            'Si dossier rejeté, renseigner les raisons (si pas répertoriée dans la liste déroulante)': '',
            'Si dossier approuvé, fournir les scans du contrat de prêt et les tableaux d\'amortissement': '',
            'Montant recouvré à date': '',


          };
          rowDataGIE.push(row);
        }
      }
      this.pmoService.saveAsExcelFile(rowDataPME, rowDataME, rowDataGIE, 'list_demandes');
    }
  */

  handleOkComment() {

    let comment: Commentaire = new Commentaire;
    comment.comment = 'pmo-' + this.commentForm.controls.commentaire.value;
    comment.media = this.nomDocument;
    comment.status = this.currentInfo.demande?.statutDossier;
    console.log(comment);

    if (this.currentInfo.demande) {
      console.log('here');
      this.currentInfo.demande?.commentaires?.push(comment);

      this.isSpinning = true;
      console.log('new demande', this.currentInfo.demande);
      this.pmoService.updateDemande(this.currentInfo.demande).subscribe((response) => {
          this.isSpinning = false;

          console.log(response);
          this.onGetAllDemande();
          this.commentForm.reset();
          this.isVisibleComment = false;

        },
        (error) => {
          this.isSpinning = false;
          console.log('Update demande error ', error);
          this.handleCancelError();

        })
    }
    this.checkFileSizeMB = true;
    this.evidencesList.splice(0);
  }

  handleCancelComment() {
    this.commentForm.reset();
    this.evidencesList.splice(0);
    this.checkFileSizeMB = true;
    this.isVisibleComment = false;
  }


  getCountCommentairePMO(data: any) {
    this.nombreCommentaire = 0;

    // @ts-ignore
    data?.forEach((item: { commenta: any; }) => {

      if (item.commenta?.comment?.indexOf('pmo-') != -1) {
//console.log('startWith OK '+item.commenta?.comment)
        this.nombreCommentaire++;
      }
    })


    return this.nombreCommentaire;

  }

  getVisibleCommentairePMO(data: any) {
    return this.getCountCommentairePMO(data) != 0;
  }


}
