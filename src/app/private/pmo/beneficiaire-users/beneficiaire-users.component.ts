import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Demande} from "../../../model/demande";
import {ChartComponent} from "ng-apexcharts";
import {NzModalService} from "ng-zorro-antd/modal";
import {AuthService} from "../../../services/security/auth/auth.service";
import {PmoService} from "../../../services/pmo/pmo.service";
import { NzTableFilterFn, NzTableFilterList, NzTableQueryParams, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { InfoSelection } from 'src/app/model/info-selection';
import { UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { FileService } from 'src/app/services/file/file.service';
import { DataService } from 'src/app/services/data_service/data_service';
import { DescriptionBeneficiaireComponent } from '../description-beneficiaire/description-beneficiaire.component';
import { DatePipe } from '@angular/common';
import { DescriptionDemandeComponent } from '../description-demande/description-demande.component';
import { Router } from '@angular/router';
import { ExportPMO } from 'src/app/model/exportPMO';
import {Beneficiaire} from "../../../model/beneficiaire";
interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<InfoSelection> | null;
  sortDirections: NzTableSortOrder[];
  columnKey: string;
}
interface ColumnItemBis {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<InfoSelection> | null;
  listOfFilter: NzTableFilterList;
  filterFn: boolean | null;
  filterMultiple: boolean;
  columnKey: string;
  sortDirections: NzTableSortOrder[];
}
interface ColumnItemActivite {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Demande> | null;
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
  selector: 'app-beneficiaire-users',
  templateUrl: './beneficiaire-users.component.html',
  styleUrls: ['./beneficiaire-users.component.scss']
})
export class UsersBeneficiaireComponent implements OnInit {
  searchValue = '';
  searchValueActivite = '';
  typeCalled: string='';
  montantOctroye: any;
  dateSize= 'large';
  totalPME = 10;
  totalGIE = 10;
  totalME = 10;
  totalActivite2 = 10;
  loading = false;
  pageSize = 10;
  pageIndex = 1;
  // EXCEL_TYPE: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  // EXCEL_EXTENSION: string = '.xlsx';
  erreurMsg='';
  visible = false;
  visibleActivite = false;
  isActivite2 = false;
  isPMOSpecial = false;
  isSpinning = false;
  isSpinningPME = false;
  isSpinningME = false;
  isSpinningGIE = false;
  idPmo: number=0;
  isVisible = false;
  isVisibleError = false;
  nomDocument: any= '';
  currentInfo: InfoSelection= new InfoSelection;
  map = new Map();
  mapBis = new Map();
  listeDemande : any;
  listeDemandeActivite2 : any;
  listOfDisplayDataActivite2:any;
  //@ViewChild("chart") chart: ChartComponent = new ChartComponent();
  personneContact: any;
  listBeneficiaireME : any[] = [];
  listBeneficiairePME : Array<any> = [] || undefined;
  listBeneficiaireGIE : Array<any> = [] || undefined;
  listOfDisplayDataME:any;
  listOfDisplayDataPME:any;
  listOfDisplayDataGIE:any;
  beneficiaireColumn= {
    sortOrder: null,
    sortFn: (a: any, b: any) => (a.id || 1) - (b.id || 1),
    sortDirections: ['ascend', 'descend', null],
  }
  activite2Column= {
    sortOrder: null,
    sortFn: (a: any, b: any) => (a.demande.id || 1) - (b.demande.id || 1),
    sortDirections: ['ascend', 'descend', null],
  }
  listOfColumnsBis: ColumnItemBis[]= [
    {
      name: 'Statut',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: InfoSelection, b: InfoSelection) => a.demande?.statutDossier?.localeCompare(b.demande?.statutDossier || '') || 1,
      columnKey: 'statut',
      filterMultiple: false,
      listOfFilter: [
        { text: 'Activé', value: 'ACTIVATED' },
        { text: 'Enregistré', value: 'REGISTRED'},
        // { text: 'APPROUVE', value: this.getStatusTitle('APPROUVE'), byDefault: true },
        // { text: 'Rejeté', value: 'REJETE' },
        // { text: 'Décaissement en cours', value: 'DECAISSE_START' },
        // { text: 'Décaissé', value: 'DECAISSE_DONE' },
        // { text: 'Remboursement en cours', value: 'REMBOURSEMENT_START' },
        // { text: 'Remboursé', value: 'REMBOURSEMENT_DONE' }
      ],
      // filterFn: (list: string[], item: InfoSelection) => this.listeDemande?.some((name:string) => item.demande?.statutDossier?.indexOf(name|| '') !== -1)
      filterFn: true
      // filterFn: null
    }
  ]
  listOfColumns: ColumnItem[] = [
    {
      name: 'Nom',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.nom?.localeCompare(b.nom || '') || 1,
      columnKey: 'nom',
      sortDirections: ['ascend', 'descend', null],
    },
    // {
    //   name: 'Prénom',
    //   sortOrder: 'descend',
    //   columnKey: 'prenom',
    //   sortFn: (a: any, b: any) => a.prenom?.localeCompare(b.nom || '') || 1,
    //   sortDirections: ['ascend', 'descend', null],
    // },
    {
      name: 'Téléphone',
      sortOrder: null,
      columnKey: 'numeroMobile',
      sortFn: (a: any, b: any) => a.numeroMobile?.localeCompare(b.numeroMobile || '') || 1,
      sortDirections: ['ascend', 'descend', null],
    },
    // {
    //   name: 'Type',
    //   sortOrder: null,
    //   sortDirections: ['ascend', 'descend', null],
    //   sortFn: (a: any, b: any) => a.demande?.typeDemande?.localeCompare(b.demande?.typeDemande || '') || 1,
    // },
    {
      name: 'Date',
      sortOrder: null,
      columnKey: 'dateCreation',
      sortFn: (a: any, b: any) => a.dateCreation?.localeCompare(b.dateCreation || '') || 1,
      // sortFn: null,
      sortDirections: ['ascend', 'descend', null],
    },
  ];
  listOfColumnsBisActivite2: ColumnItemBisActivite[]= [
    {
      name: 'Statut demande',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: any, b: any) => a.demande.statutDossier?.localeCompare(b.demande.statutDossier || '') || 1,
      // sortFn: null,
      filterMultiple: false,
      listOfFilter: [
        { text: 'Reçu', value: 'RECU' },
        { text: 'Approuvé', value: 'APPROUVE'},
        { text: 'Invalidé', value: 'INVALIDATED'},
        // { text: 'APPROUVE', value: this.getStatusTitle('APPROUVE'), byDefault: true },
        { text: 'Rejeté', value: 'REJETE' },
        { text: 'Décaissement en cours', value: 'DECAISSE_START' },
        { text: 'Décaissé', value: 'DECAISSE_DONE' },
        { text: 'Remboursement en cours', value: 'REMBOURSEMENT_START' },
        { text: 'Remboursé', value: 'REMBOURSEMENT_DONE' }
      ],
      // filterFn: (list: string[], item: Demande) => this.listeDemande?.some((name:string) => item.statutDossier?.indexOf(name|| '') !== -1)
      filterFn: (statut: string, item: any) => item.demande.statutDossier?.indexOf(statut) !== -1
      // filterFn: null
    }
  ]
  listOfColumnsActivite2: ColumnItemActivite[] = [
    {
      name: 'Date',
      sortOrder: null,
      sortFn: (a: any, b: any) => a.demande.dateCreation?.localeCompare(b.demande.dateCreation || '') || 1,
      // sortFn: null,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Montant demandé',
      sortOrder: null,
      sortFn: (a: any, b: any) => (a.demande.montant || 1) - (b.demande.montant || 1),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Montant octroyé',
      sortOrder: null,
      sortFn: (a: any, b: any) => (a.demande.montantOctroye || 1) - (b.demande.montantOctroye || 1),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Type',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: any, b: any) => a.demande.typeDemande?.localeCompare(b.demande.typeDemande || '') || 1,
    }
  ];
  demandeForm = this.fb.group({
    beginDate : [''],
    endDate : ['']
  });
  constructor(private modalService : NzModalService, private data: DataService, private changeDetector : ChangeDetectorRef,
              private authService : AuthService, private fb: UntypedFormBuilder, private fileService : FileService, private router: Router,
              private pmoService:PmoService) {
  }
  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      let user = this.authService.currentUserValue;
      this.idPmo = user.idParent;
      this.setStatusMap();
      this.checkIfCanRegisterBenef();
      this.checkIfPMOSpecial();
      // this.onGetAllDemandeActivite2();
      // this.setStatusMapTitle();
      // this.onGetAllBeneficiairePME(this.pageIndex, this.pageSize, '', '');
      // this.onGetAllBeneficiaireME(this.pageIndex, this.pageSize, '', '');
      // this.onGetAllBeneficiaireGIE(this.pageIndex, this.pageSize, '', '');
    }
  }
  reset(): void {
    this.searchValue = '';
    this.search();
  }
  search(): void {
    //console.log('call babs');
    this.visible = false;
    this.listOfDisplayDataME = this.listBeneficiaireME.filter((item: InfoSelection) => {
      let value = item.demande?.beneficiaire?.id+'';
      // //console.log('value', value);
      // //console.log('result', value.indexOf(this.searchValue));
      return value.indexOf(this.searchValue) !== -1
    });
  }
  choixOffres(idBeneficiaire:string){
    this.router.navigate(['/pmo/offres-beneficiaire/'+idBeneficiaire]);
  }
  resetActivite2(): void {
    this.searchValueActivite = '';
    this.onGetAllDemandeActivite2(this.pageIndex, this.pageSize, '', '');
  }
  showModal(){
    console.log('here');
    this.isVisible = true;
  }
  handleOk(): void {
    // //console.log('Button ok clicked!');
    this.isVisible = false;
    this.exportAsExcelFileForUsers();
  }
  handleCancel(): void {
    // //console.log('Button cancel clicked!');
    this.isVisible = false;
    this.demandeForm.reset();
  }
  handleOkError(): void {
    // //console.log('Button ok clicked!');
    this.isVisibleError = false;
  }
  handleCancelError(): void {
    // //console.log('Button cancel clicked!');
    this.isVisibleError = false;
  }
  // searchActivite2(): void {
  //   //console.log('call babs');
  //   this.visibleActivite = false;
  //   this.listOfDisplayDataActivite2 = this.listeDemandeActivite2.filter((item: any) => {
  //     // console.log('item', item);
  //     let value = item.demande?.beneficiaire?.id+'';
  //     // console.log('value', value);
  //     // console.log('babs', this.searchValueActivite);
  //     // //console.log('result', value.indexOf(this.searchValueActivite));
  //     return value.indexOf(this.searchValueActivite) !== -1
  //   });
  // }
  searchActivite2(){
    this.isSpinning = true;
    //console.log('new demande', demande);
    this.pmoService.searchDemandeById(this.searchValueActivite).subscribe((response) => {
        this.isSpinning = false;
        console.log(response);
        this.listOfDisplayDataActivite2 = [];
        this.listOfDisplayDataActivite2.push(response);
      },
      (error)=>{
        this.isSpinning = false;
        this.listOfDisplayDataActivite2 = [];
        //console.log(error);
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
  showModalDescriptionDemande(data:Beneficiaire): void {
    // this.currentInfo = data;

    let benef =  this.pmoService.getBeneficiaireById(data?.id, data?.typeBeneficiaire).subscribe((response) => {
      data = response;
      this.data.changeMessage(data);
      this.modalService.create({
        nzCancelText: null,
        nzTitle: 'Informations bénéficiaire',
        nzContent: DescriptionBeneficiaireComponent,
        nzWidth: 1000
      });
    }, error => console.log(error));


  }
  checkIfCanRegisterBenef(){
    // this.isSpinning = true;
    this.pmoService.checkIfCanRegisterBenef(this.idPmo).subscribe((response) => {
        // this.isSpinning = false;
        console.log(response);
        this.isActivite2 = response.reponse;
      },
      (error)=>{
        this.isSpinning = false;
        //console.log(error);
        // this.handleCancelError();
      })
  }
  checkIfPMOSpecial(){
    // this.isSpinning = true;
    this.pmoService.checkIfPMOSpecial(this.idPmo).subscribe((response) => {
        // this.isSpinning = false;
        console.log(response);
        this.isPMOSpecial = response.reponse;
        localStorage.setItem('isPMOSpecial', this.isPMOSpecial+'');
        console.log(localStorage.getItem('isPMOSpecial'));
      },
      (error)=>{
        this.isSpinning = false;
        //console.log(error);
        // this.handleCancelError();
      })
  }
  setStatusMap(){
    this.map.set('ACTIVATED', 'Activé');
    this.map.set('REGISTRED', 'Enregistré');
    this.map.set('INITIE', 'Initié');
    this.map.set('RECU_TG', 'Reçu par Teranga');
    this.map.set('INVALIDATED_TG', 'Invalidé par Teranga');
    this.map.set('TEMPORAIRE_TG', 'Initié TG');
    this.map.set('RECU', 'Reçu par le PMO');
    this.map.set('INVALIDATED', 'Invalidé');
    this.map.set('RECU_AF', 'En cours d\'examination par l\'analyste financier');
    this.map.set('MATCHE', 'Matching effectué');
    this.map.set('RECU_AF_MATCHE', 'En cours d\'examination par l\'analyste financier');
    this.map.set('APPROUVE', 'Approuvé par le PMO');
    this.map.set('REJETE', 'Rejeté par le PMO');
    this.map.set('DECAISSE_START', 'Décaissement en cours');
    this.map.set('DECAISSE_DONE', 'Décaissé');
    this.map.set('REMBOURSEMENT_START', 'Remboursement en cours');
    this.map.set('REMBOURSEMENT_DONE', 'Remboursé');
  }
  // setStatusMapTitle(){
  //   // this.map.set('RECU', 'Reçu');
  //   this.mapBis.set('APPROUVE', 'Initier décaissement');
  //   // this.map.set('REJETE', 'Rejeté');
  //   this.mapBis.set('DECAISSE_START', 'Clôture décaissement');
  //   this.mapBis.set('DECAISSE_DONE', 'Initier remboursement');
  //   this.mapBis.set('REMBOURSEMENT_START', 'Clôture remboursement');
  //   // this.map.set('REMBOURSEMENT_DONE', 'Remboursé');
  // }
  getStatusLibelle(codeStatus:string){
    return this.map.get(codeStatus);
  }
  getStatusTitle(codeStatus:string){
    return this.mapBis.get(codeStatus);
  }
  onGetAllDemandeActivite2(pageIndex:number, pageSize:number, sortField:string, sortOrder:string){
    // this.isSpinning = true;
    this.pmoService.getAllDemandeActivite2(this.idPmo, pageIndex, pageSize, sortField, sortOrder).subscribe((response) => {
        this.isSpinning = false;
        console.log(response);
        // this.beneficiaire = response ;
        this.listeDemandeActivite2 = response.content;
        this.listOfDisplayDataActivite2 = response.content;
        this.totalActivite2 = response.totalElements;
        // console.log(this.listeDemandeActivite2);
      },
      (error)=>{
        this.isSpinning = false;
        //console.log(error);
      })
  }
  // onGetAllDemandeActivite2(pageIndex:number, pageSize:number, sortField:string, sortOrder:string){
  //   // console.log('page index', pageIndex);
  //   this.isSpinningGIE = true;
  //   this.pmoService.getAllDemandeActivite2(this.idPmo, 'gies', pageIndex, pageSize, sortField, sortOrder).subscribe((response) => {
  //     this.isSpinningGIE = false;
  //     console.log(response);
  //     this.listBeneficiaireGIE = response.content;
  //     this.listOfDisplayDataGIE = response.content;
  //     this.totalGIE = response.totalElements;
  //   },
  //   (error)=>{
  //     this.isSpinningGIE = false;
  //     console.log(error);
  //   })
  // }
  showModalDescriptionDemandeActivite2(data:any): void {
    // console.log(data);
    // this.currentInfo = data;
    this.data.changeMessage(data);
    this.modalService.create({
      nzCancelText: null,
      nzTitle: 'Description demande',
      nzContent: DescriptionDemandeComponent,
      nzWidth: 1000
    });
  }
  goExpressionBesoin(data:Demande){
    this.data.changeMessageBeneficiaire(data);
    let typeBeneficiaire: string = data?.beneficiaire?.typeBeneficiaire || '';
    if(typeBeneficiaire.trim().toLowerCase()=='pme'){
      this.router.navigateByUrl('/beneficiaire/expression-besoin/entreprise');
    }
    else if(typeBeneficiaire.trim().toLowerCase()=='gie'){
      this.router.navigateByUrl('/beneficiaire/expression-besoin/gie');
    }
    else if(typeBeneficiaire.trim().toLowerCase()=='me'){
      this.router.navigateByUrl('/beneficiaire/expression-besoin/microentreprise');
    }
  }
  goOffreBeneficiaire(data:Demande){
    console.log(data);
    const idBeneficiaire = data?.beneficiaire?.id;
    console.log(idBeneficiaire);
    this.router.navigate(['/pmo/offres-beneficiaire/'+idBeneficiaire]);
  }
  onQueryParamsChangePME(params: NzTableQueryParams): void {
    // console.log(params);
    // console.log(type);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    let sortField = (currentSort && currentSort.key) || null;
    let sortOrder = (currentSort && currentSort.value) || null;
    // console.log(sortField);
    // console.log(sortOrder);
    // console.log(filter);
    if(sortField=='nom'){
      sortField = 'denominationSociale';
    }
    // console.log(sortField);
    this.onGetAllBeneficiairePME(pageIndex, pageSize, sortField || '', sortOrder || '');
  }
  onQueryParamsChangeME(params: NzTableQueryParams): void {
    // console.log(params);
    // console.log(type);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    // console.log(sortField);
    // console.log(sortOrder);
    // console.log(filter);
    this.onGetAllBeneficiaireME(pageIndex, pageSize, sortField || '', sortOrder || '');
  }
  onQueryParamsChangeGIE(params: NzTableQueryParams): void {
    // console.log(params);
    // console.log(type);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    // console.log(sortField);
    // console.log(sortOrder);
    // console.log(filter);
    this.onGetAllBeneficiaireGIE(pageIndex, pageSize, sortField || '', sortOrder || '');
  }
  onQueryParamsChangeActivite2(params: NzTableQueryParams): void {
    // console.log(params);
    // console.log(type);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    // console.log(sortField);
    // console.log(sortOrder);
    // console.log(filter);
    this.onGetAllDemandeActivite2(pageIndex, pageSize, sortField || '', sortOrder || '');
  }
  onGetAllBeneficiairePME(pageIndex:number, pageSize:number, sortField:string, sortOrder:string){
    // console.log('page index', pageIndex);
    this.isSpinningPME = true;
    this.pmoService.getAllBeneficiaire(this.idPmo, 'pmes', pageIndex, pageSize, sortField, sortOrder).subscribe((response) => {
        this.isSpinningPME = false;
        // console.log(response);
        this.listBeneficiairePME = response.content;
        this.listOfDisplayDataPME = response.content;
        this.totalPME = response.totalElements;
      },
      (error)=>{
        this.isSpinningPME = false;
        //console.log(error);
      })
  }
  onGetAllBeneficiaireME(pageIndex:number, pageSize:number, sortField:string, sortOrder:string){
    // console.log('page index', pageIndex);
    this.isSpinningME = true;
    this.pmoService.getAllBeneficiaire(this.idPmo, 'mes', pageIndex, pageSize, sortField, sortOrder).subscribe((response) => {
        this.isSpinningME = false;
        // console.log(response);
        this.listBeneficiaireME = response.content;
        this.listOfDisplayDataME = response.content;
        this.totalME = response.totalElements;
      },
      (error)=>{
        this.isSpinningME = false;
        console.log(error);
      })
  }
  onGetAllBeneficiaireGIE(pageIndex:number, pageSize:number, sortField:string, sortOrder:string){
    // console.log('page index', pageIndex);
    this.isSpinningGIE = true;
    this.pmoService.getAllBeneficiaire(this.idPmo, 'gies', pageIndex, pageSize, sortField, sortOrder).subscribe((response) => {
        this.isSpinningGIE = false;
        console.log(response);
        this.listBeneficiaireGIE = response.content;
        this.listOfDisplayDataGIE = response.content;
        this.totalGIE = response.totalElements;
      },
      (error)=>{
        this.isSpinningGIE = false;
        console.log(error);
      })
  }
  // Utiliser pour exporter
  onGetAllBeneficiairePMEExport(dateDebut:string, dateFin:string){
    const exportPMO = new ExportPMO();
    exportPMO.id = this.idPmo;
    exportPMO.dateDebut = dateDebut;
    exportPMO.dateFin = dateFin;
    return this.pmoService.getAllBeneficiairePMEExport('pmes', exportPMO).toPromise();
  }
  onGetAllBeneficiaireMEExport(dateDebut:string, dateFin:string){
    const exportPMO = new ExportPMO();
    exportPMO.id = this.idPmo;
    exportPMO.dateDebut = dateDebut;
    exportPMO.dateFin = dateFin;
    return this.pmoService.getAllBeneficiaireExport('mes', exportPMO).toPromise();
  }
  onGetAllBeneficiaireGIEExport(dateDebut:string, dateFin:string){
    const exportPMO = new ExportPMO();
    exportPMO.id = this.idPmo;
    exportPMO.dateDebut = dateDebut;
    exportPMO.dateFin = dateFin;
    return this.pmoService.getAllBeneficiaireExport('gies', exportPMO).toPromise();
  }
  getPersonneContactInfo(beneficiaire:any){
    let listContact = beneficiaire?.personnes?.filter((item:any) =>
    {return item.typePersonnes?.map(function(e:any) {
      // //console.log(e);
      return e.code; }).indexOf("CONTACT")!==-1
    });
    // //console.log(listContact);
    if (listContact && listContact.length>0) {
      this.personneContact = listContact[0];
      // this.changeDetector.detectChanges();
      return listContact[0];
    }
    // console.log(this.personneContact.prenom);

    // this.changeDetector.detectChanges();
  }
  getPersonneDirigeantInfo(beneficiaire:any){
    let listContact = beneficiaire?.personnes?.filter((item:any) =>
    {return item.typePersonnes?.map(function(e:any) {
      // //console.log(e);
      return e.code; }).indexOf("DIRIGEANT")!==-1
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
  getPersonneAssocieInfo(beneficiaire:any){
    let listContact = beneficiaire?.personnes?.filter((item:any) =>
    {return item.typePersonnes?.map(function(e:any) {
      // //console.log(e);
      return e.code; }).indexOf("ASSOCIE")!==-1
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
  async exportAsExcelFileForUsers(): Promise<void> {
    // let listModifiedTripCommitted = this.trips;
    const beginDate = new Date(this.demandeForm?.controls?.beginDate?.value);
    const endDate = new Date(this.demandeForm?.controls?.endDate?.value);
    const strbeginDate = new Date(this.demandeForm?.controls?.beginDate?.value).toJSON();
    const strendDate = new Date(this.demandeForm?.controls?.endDate?.value).toJSON();
    console.log(strbeginDate);
    console.log(strendDate);
    if(beginDate>endDate){
      this.isVisibleError = true;
      this.erreurMsg = 'Date de début supérieure à date fin';
      return;
    }
    const diffTime = Math.abs(endDate.getTime() - beginDate.getTime());
    // console.log()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) -1;
    // console.log(diffTime + " milliseconds");
    console.log(diffDays + " days");
    // if(diffDays>30){
    //   this.isVisibleError = true;
    //   this.erreurMsg = 'L\'intervalle ne peut dépasser 30 jours';
    //   return;
    // }
    // return;
    this.isSpinning = true;
    let listBeneficiairePME : Array<any> = [] || undefined;
    let listBeneficiaireME : Array<any> = [] || undefined;
    let listBeneficiaireGIE : Array<any> = [] || undefined;
    let responsePME = await this.onGetAllBeneficiairePMEExport(strbeginDate, strendDate);
    let responseME = await this.onGetAllBeneficiaireMEExport(strbeginDate, strendDate);
    let responseGIE = await this.onGetAllBeneficiaireGIEExport(strbeginDate, strendDate);
    this.isSpinning = false;
    console.log(responsePME);
    console.log(responseME);
    console.log(responseGIE);
    // return;
    listBeneficiairePME = responsePME;
    listBeneficiaireME = responseME;
    listBeneficiaireGIE = responseGIE;
    let rowDataPME : any = [];
    let rowDataME : any = [];
    let rowDataGIE : any = [];

    for (let i = 0; i < listBeneficiairePME[0].beneficiaires.length; i++) {
      const element = listBeneficiairePME[0].beneficiaires[i];
      let categorisation = "";
      var dateActuelle = new Date();
      var dateAfter = new Date(element?.dateCreation).setMonth(new Date(element?.dateCreation).getMonth() + 3);

      // @ts-ignore
      if (dateActuelle > dateAfter) {
        categorisation = "Ancien Beneficiaire";
      } else {
        categorisation = "Nouveau bénéficiaire";
      }
      let row = {
        'ID Bénéficiaire': element.id,
        'PMO': listBeneficiairePME[0]?.pmo?.sigle,
        'Numéro de téléphone personne contact du de l\'entrprise': element?.telephone,
        'Adresse mail personne contact de l\'entreprise': this.getPersonneContactInfo(element)?.email,
        'Dénomination Sociale': element?.denominationSociale,
        'Numéro RCCM': element?.numeroRCCM,
        'Document RCCM': element?.documentRCCM,
        'NINEA': element?.ninea,
        'Document NINEA': element?.documentNinea,
        'Statut juridique de l\'entreprise': element?.statusJuridique,
        'Document de constitution (statuts sociétés, PV GIE, etc.)?': element?.documentConstitution,
        'Date de création': element?.dateCreation,
        'Adresse/Siège social': element?.adresse,
        'Zone': element?.zoneGeographique?.libelle,
        'Centre urbain ?': element?.centreUrbain,
        'Dirigeant 1': this.getPersonneDirigeantInfo(element)[0]?.nom + ' ' + this.getPersonneDirigeantInfo(element)[0]?.prenom,
        'Dir 1 Prénom': this.getPersonneDirigeantInfo(element)[0]?.prenom,
        'Dir 1 Nom': this.getPersonneDirigeantInfo(element)[0]?.nom,
        'Dir 1 Genre': this.getPersonneDirigeantInfo(element)[0]?.genre,
        'Dir 1 Age': this.getPersonneDirigeantInfo(element)[0]?.age?.libelle,
        'Dir 1 Niveau ': this.getPersonneDirigeantInfo(element)[0]?.niveauInstruction?.libelle,
        'Dir 1 Numero CNI ou passeport': this.getPersonneDirigeantInfo(element)[0]?.numeroCNI,
        'Dir 1 Fonction dans l\'entreprise': this.getPersonneDirigeantInfo(element)[0]?.titre?.libelle,
        'Dir 1 Niveau d\'instruction': this.getPersonneDirigeantInfo(element)[0]?.niveauInstruction?.libelle,
        'Dir 1 Nombre de personnes à charge au total (famille directe + dépendants hors famille directe)': this.getPersonneDirigeantInfo(element)[0]?.nombrePersonneACharge,
        'Dirigeant 2': this.getPersonneDirigeantInfo(element)[1]?.nom + ' ' + this.getPersonneDirigeantInfo(element)[1]?.prenom,
        'Dir 2 Prénom': this.getPersonneDirigeantInfo(element)[1]?.prenom,
        'Dir 2 nom': this.getPersonneDirigeantInfo(element)[1]?.nom,
        'Dir 2 Genre': this.getPersonneDirigeantInfo(element)[1]?.genre?.libelle,
        'Dir 2 Age': this.getPersonneDirigeantInfo(element)[1]?.age?.libelle,
        'Dir 2 Niveau ': this.getPersonneDirigeantInfo(element)[1]?.niveauInstruction?.libelle,
        'Dir 2 Numero CNI ou passeport': this.getPersonneDirigeantInfo(element)[1]?.numeroCNI,
        'Dir 2 Fonction dans l\'entreprise': this.getPersonneDirigeantInfo(element)[1]?.titre.libelle,
        'Dir 2 Niveau d\'instruction': this.getPersonneDirigeantInfo(element)[1]?.niveauInstruction?.libelle,
        'Dir 2 Nombre de personnes à charge au total (famille directe + dépendants hors famille directe)': this.getPersonneDirigeantInfo(element)[1]?.nombrePersonneACharge,
        'Dirigeant 3': this.getPersonneDirigeantInfo(element)[2]?.nom + ' ' + this.getPersonneDirigeantInfo(element)[2]?.prenom,
        'Dir 3 Prénom': this.getPersonneDirigeantInfo(element)[2]?.prenom,
        'Dir 3 Nom': this.getPersonneDirigeantInfo(element)[2]?.nom,
        'Dir 3 Genre': this.getPersonneDirigeantInfo(element)[2]?.genre?.libelle,
        'Dir 3 Age': this.getPersonneDirigeantInfo(element)[2]?.age?.libelle,
        'Dir 3 Niveau ': this.getPersonneDirigeantInfo(element)[2]?.niveauInstruction?.libelle,
        'Dir 3 Numero CNI ou passeport': this.getPersonneDirigeantInfo(element)[2]?.numeroCNI,
        'Dir 3 Fonction dans l\'entreprise': this.getPersonneDirigeantInfo(element)[2]?.titre.libelle,
        'Dir 3 Niveau d\'instruction': this.getPersonneDirigeantInfo(element)[2]?.niveauInstruction?.libelle,
        'Dir 3 Nombre de personnes à charge au total (famille directe + dépendants hors famille directe)': this.getPersonneDirigeantInfo(element)[2]?.nombrePersonneACharge,
        'Dirigeant 4': this.getPersonneDirigeantInfo(element)[3]?.nom + ' ' + this.getPersonneDirigeantInfo(element)[3]?.prenom,
        'Dir 4 Prénom': this.getPersonneDirigeantInfo(element)[3]?.prenom,
        'Dir 4 Nom': this.getPersonneDirigeantInfo(element)[3]?.nom,
        'Dir 4 Genre': this.getPersonneDirigeantInfo(element)[3]?.genre?.libelle,
        'Dir 4 Age': this.getPersonneDirigeantInfo(element)[3]?.age?.libelle,
        'Dir 4 Niveau ': this.getPersonneDirigeantInfo(element)[3]?.niveauInstruction?.libelle,
        'Dir 4 Numero CNI ou passeport': this.getPersonneDirigeantInfo(element)[3]?.numeroCNI,
        'Dir 4 Fonction dans l\'entreprise': this.getPersonneDirigeantInfo(element)[3]?.titre.libelle,
        'Dir 4 Niveau d\'instruction': this.getPersonneDirigeantInfo(element)[3]?.niveauInstruction?.libelle,
        'Dir 4 Nombre de personnes à charge au total (famille directe + dépendants hors famille directe)': this.getPersonneDirigeantInfo(element)[3]?.nombrePersonneACharge,
        'Associé 1': this.getPersonneAssocieInfo(element)[0]?.nom + ' ' + this.getPersonneAssocieInfo(element)[0]?.prenom,
        'Ass 1 Prénom': this.getPersonneAssocieInfo(element)[0]?.prenom,
        'Ass 1 Nom': this.getPersonneAssocieInfo(element)[0]?.nom,
        'Ass 1 Genre': this.getPersonneAssocieInfo(element)[0]?.genre?.libelle,
        'Ass 1 Age': this.getPersonneAssocieInfo(element)[0]?.age?.libelle,
        'Ass 1 Numero CNI ou passeport': this.getPersonneAssocieInfo(element)[0]?.numeroCNI,
        'Ass 1 Pourcentage de détention du capital': this.getPersonneAssocieInfo(element)[0]?.pourcentageDetenueCapital,
        'Associé 2': this.getPersonneAssocieInfo(element)[1]?.nom + ' ' + this.getPersonneAssocieInfo(element)[1]?.prenom,
        'Ass 2 Prénom': this.getPersonneAssocieInfo(element)[1]?.prenom,
        'Ass 2 Nom': this.getPersonneAssocieInfo(element)[1]?.nom,
        'Ass 2 Genre': this.getPersonneAssocieInfo(element)[1]?.genre?.libelle,
        'Ass 2 Age': this.getPersonneAssocieInfo(element)[1]?.age?.libelle,
        'Ass 2 Numero CNI ou passeport': this.getPersonneAssocieInfo(element)[1]?.numeroCNI,
        'Ass 2 Pourcentage de détention du capital': this.getPersonneAssocieInfo(element)[1]?.pourcentageDetenueCapital,
        'Associé 3': this.getPersonneAssocieInfo(element)[2]?.nom + ' ' + this.getPersonneAssocieInfo(element)[2]?.prenom,
        'Ass 3 Prénom': this.getPersonneAssocieInfo(element)[2]?.prenom,
        'Ass 3 Nom': this.getPersonneAssocieInfo(element)[2]?.nom,
        'Ass 3 Genre': this.getPersonneAssocieInfo(element)[2]?.genre?.libelle,
        'Ass 3 Age': this.getPersonneAssocieInfo(element)[2]?.age?.libelle,
        'Ass 3 Numero CNI ou passeport': this.getPersonneAssocieInfo(element)[2]?.numeroCNI,
        'Ass 3 Pourcentage de détention du capital': this.getPersonneAssocieInfo(element)[2]?.pourcentageDetenueCapital,
        'Associé 4': this.getPersonneAssocieInfo(element)[3]?.nom + ' ' + this.getPersonneAssocieInfo(element)[3]?.prenom,
        'Ass 4 Prénom': this.getPersonneAssocieInfo(element)[3]?.prenom,
        'Ass 4 Nom': this.getPersonneAssocieInfo(element)[3]?.nom,
        'Ass 4 Genre': this.getPersonneAssocieInfo(element)[3]?.genre?.libelle,
        'Ass 4 Age': this.getPersonneAssocieInfo(element)[3]?.age?.libelle,
        'Ass 4 Numero CNI ou passeport': this.getPersonneAssocieInfo(element)[3]?.numeroCNI,
        'Ass 4 Pourcentage de détention du capital': this.getPersonneAssocieInfo(element)[3]?.pourcentageDetenueCapital,
        'Source du beneficiaire': element?.source,
        'Secteur d\'activité': element?.activiteBeneficiaires[0]?.secteurActivites[0]?.libelle,
        'Secteur d\'activité (si pas répertoriée dans la liste déroulante)': element?.activiteBeneficiaires[0]?.autreSecteurActivite,
        'Nombre d\'années d\'activité': element?.activiteBeneficiaires[0]?.nombreAnneeActivite?.libelle,
        'Chiffre affaire 2021': element?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois2 ? element?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois2 : element?.activiteBeneficiaires[0]?.revenueTotalAnMoins2,
        'Chiffre affaire 2022': element?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois1 ? element?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois1 : element?.activiteBeneficiaires[0]?.revenueTotalAnMoins1,
        'Etats financiers 2021 (fournir états certifiés si applicable) ': element?.activiteBeneficiaires[0]?.etatFinancierAnMois2,
        'Etats financiers 2022 (fournir états certifiés si applicable) ': element?.activiteBeneficiaires[0]?.etatFinancierAnMois1,
        'Employés permanents de l\'entreprise ': element?.activiteBeneficiaires[0]?.nombreEmployePermanent?.libelle,
        'Nombre exact à date': element?.activiteBeneficiaires[0]?.nombreEmployePermanentExactAdate,
        'Nombre de femmes': element?.activiteBeneficiaires[0]?.nombreFemmeEmployePermanent,
        'Pourcentage de femmes   ': element?.activiteBeneficiaires[0]?.pourcentageFemmeEmployePermanent,
        'Nombre de jeunes (< 35 ans)': element?.activiteBeneficiaires[0]?.nombreJeuneEmployePermanent,
        'Pourcentage de jeunes (< 35 ans)  ': element?.activiteBeneficiaires[0]?.pourcentageJeuneEmployePermanent,
        'Employés non permanents, prestataires, saisonniers, etc.': element?.activiteBeneficiaires[0]?.nombreEmployeNonPermanent?.libelle,
        '_Nombre exact à date': element?.activiteBeneficiaires[0]?.nombreEmployeNonPermanentExactAdate,
        '_Nombre de femmes': element?.activiteBeneficiaires[0]?.nombreFemmeEmployeNonPermanent,
        '_Pourcentage de femmes': element?.activiteBeneficiaires[0]?.pourcentageFemmeNonPermanent,
        '_Nombre de jeunes (< 35 ans)': element?.activiteBeneficiaires[0]?.nombreJeuneEmployeNonPermanent,
        '_Pourcentage de jeunes (< 35 ans)': element?.activiteBeneficiaires[0]?.pourcentageJeuneNonPermanent,
        'Salaire net / mois le plus bas dans l\'entreprise en Francs CFA  ': element?.activiteBeneficiaires[0]?.revenuplusBasParMois,
        'Salaire net moyen / mois dans l\'entreprise en Francs CFA': element?.activiteBeneficiaires[0]?.revenuMoyenneParMois,
        'source': element?.source,
        'Catégorisation du bénéficiaire': categorisation,
      };
      rowDataPME.push(row);
    }
    console.log(listBeneficiaireME[0].beneficiaires);

    for (let i = 0; i < listBeneficiaireME[0].beneficiaires.length; i++) {
      console.log("enterer");
      const element = listBeneficiaireME[0].beneficiaires[i];
      let categorisation = "";
      var dateActuelle = new Date();
      var dateAfter = new Date(element?.dateCreation).setMonth(new Date(element?.dateCreation).getMonth() + 3);

      // @ts-ignore
      if (dateActuelle > dateAfter) {
        categorisation = "Ancien Beneficiaire";
      } else {
        categorisation = "Nouveau bénéficiaire";
      }
      console.log(element);
      let chiffremoins1="";
      let chiffremoins2="";
      console.log("calcul");
      if(element?.source?.name == "MIGRATION_BO"){

        chiffremoins1 = element?.chiffreAffaireHorsTaxeAnMois1 != null?element?.chiffreAffaireHorsTaxeAnMois1:"";
        chiffremoins2 =  element?.chiffreAffaireHorsTaxeAnMois2 != null?element?.chiffreAffaireHorsTaxeAnMois2:"";
      }else if(! (element?.source?.name == "MIGRATION_BO" )&& element?.activiteBeneficiaires[0] != null){
        chiffremoins1 = element?.activiteBeneficiaires[0] != null && element?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois1 != null ?element?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois1:element?.activiteBeneficiaires[0]?.revenueTotalAnMoins1;
        chiffremoins2 = element?.activiteBeneficiaires[0] != null && element?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois2 != null ?element?.activiteBeneficiaires[0]?.chiffreAffaireHorsTaxeAnMois2 : element?.activiteBeneficiaires[0]?.revenueTotalAnMoins2;
      }
      console.log("Fin calcul");
      let row = {
        'ID Bénéficiaire': element.id,
        'PMO': listBeneficiaireME[0].pmo?.sigle,
        'Prénom': element?.prenom,
        'Nom': element?.nom,
        'Genre':  this.getPersonneContactInfo(element)?.genre?.libelle,
        'Numéro de téléphone': element?.telephone,
        'Email': this.getPersonneContactInfo(element)?.email,
        'Adresse physique': element?.adresse,
        'Zone': element?.zoneGeographique?.libelle,
        'Centre urbain ?': element?.centreUrbain,
        'Chiffre affaire 2021': chiffremoins2,
        'Chiffre affaire 2022': chiffremoins1,
        'Age': this.getPersonneContactInfo(element)?.age?.libelle,
        'Numero CNI ou Document Identification': element?.numeroCNI,
        'Scan CNI ou Document Identification': element?.scanNumeroCNI,
        'Niveau instruction': element?.niveauInstruction?.libelle,
        'Nombre de personnes à charge au total (famille directe + dépendants hors famille directe)': element?.nombrePersonneACharge,
        'Occupation': element?.activiteBeneficiaires[0]?.occupation,
        'Nombre d\'années d\'activité': element?.activiteBeneficiaires[0]?.nombreAnneeActivite?.libelle,
        'Nombre d\'emplois existants': element?.activiteBeneficiaires[0]?.nombreEmplois,
        'Secteur d\'activité': element?.activiteBeneficiaires[0]?.secteurActivites[0]?.libelle,
        'Secteur d\'activité (si pas répertoriée dans la liste déroulante)': element?.activiteBeneficiaires[0]?.autreSecteurActivite,
        'source': element?.source,
        'Catégorisation du bénéficiaire': categorisation

      }
      console.log("Fin");
      rowDataME.push(row);
    }
    for (let i = 0; i < listBeneficiaireGIE[0].beneficiaires.length; i++) {
      const element = listBeneficiaireGIE[0].beneficiaires[i];
      let categorisation = "";
      var dateActuelle = new Date();
      var dateAfter = new Date(element?.dateCreation).setMonth(new Date(element?.dateCreation).getMonth() + 3);

      // @ts-ignore
      if (dateActuelle > dateAfter) {
        categorisation = "Ancien Beneficiaire";
      } else {
        categorisation = "Nouveau bénéficiaire";
      }
      let row = {
        'ID Bénéficiaire': element.id,
        'PMO': listBeneficiaireGIE[0].pmo?.sigle,
        'Numéro de téléphone personne contact du groupement  ': element?.telephone,
        'Adresse mail personne contact du groupement  ': this.getPersonneContactInfo(element)?.email,
        'Nom du groupement ': element.nom,
        'Adresse/Siège social ': element?.adresse,
        'Zone': element?.zoneGeographique?.libelle,
        'Centre urbain ?': element?.centreUrbain,
        'Date de création': element?.dateCreation,
        'Status juridique du groupement': element?.statusJuridique,
        'Document de constitution (statuts sociétés, PV GIE, etc.)? ' : '',
        'Secteur d\'activité': element?.activiteBeneficiaires[0]?.secteurActivites[0]?.libelle,
        'Secteur d\'activité (si pas répertoriée dans la liste déroulante)': element?.activiteBeneficiaires[0]?.autreSecteurActivite,
        'Nombre d\'années d\'activité': element?.activiteBeneficiaires[0]?.nombreAnneeActivite?.libelle,
        'Revenu total du Groupement en 2021': element?.activiteBeneficiaires[0]?.revenueTotalAnMoins2,
        'Revenu total du Groupement en 2022': element?.activiteBeneficiaires[0]?.revenueTotalAnMoins1,
        'Employés permanents de l\'entreprise ': element?.activiteBeneficiaires[0]?.nombreEmployePermanent?.libelle,
        'Nombre exact à date': element?.activiteBeneficiaires[0]?.nombreEmployePermanentExactAdate,
        'Nombre de femmes': element?.activiteBeneficiaires[0]?.nombreFemmeEmployePermanent,
        'Pourcentage de femmes  ': element?.activiteBeneficiaires[0]?.pourcentageFemmeEmployePermanent,
        'Nombre de jeunes (< 35 ans)': element?.activiteBeneficiaires[0]?.nombreJeuneEmployePermanent,
        'Pourcentage de jeunes (< 35 ans)  ': element?.activiteBeneficiaires[0]?.pourcentageJeuneEmployePermanent,
        'Membres non permanents, prestataires, saisonniers, etc.': element?.activiteBeneficiaires[0]?.nombreEmployeNonPermanent?.libelle,
        '_Nombre exact à date': element?.activiteBeneficiaires[0]?.nombreEmployeNonPermanentExactAdate,
        '_Nombre de femmes': element?.activiteBeneficiaires[0]?.nombreFemmeEmployeNonPermanent,
        '_Pourcentage de femmes': element?.activiteBeneficiaires[0]?.pourcentageFemmeNonPermanent,
        '_Nombre de jeunes (< 35 ans)': element?.activiteBeneficiaires[0]?.nombreJeuneEmployeNonPermanent,
        '_Pourcentage de jeunes (< 35 ans)': element?.activiteBeneficiaires[0]?.pourcentageJeuneNonPermanent,
        'Source du bénéficiaire ' : element?.source,
        'Revenu / mois par membre le plus bas du groupement en Francs CFA': element?.activiteBeneficiaires[0]?.revenuplusBasParMois,
        'Revenu moyen par membre Francs CFA / mois ': element?.activiteBeneficiaires[0]?.revenuMoyenneParMois,
        'Nombre de personnes à charge en moyenne pour chaque membre du groupement': element?.activiteBeneficiaires[0]?.nombrePersonneAChargeMoyenne,
        'source': element?.source,
        'Catégorisation du bénéficiaire': categorisation
      }
      rowDataGIE.push(row);
    }
    // console.log(rowData.length);
    this.pmoService.saveAsExcelFile(rowDataPME, rowDataME, rowDataGIE, 'list_beneficiaires');
  }
}
