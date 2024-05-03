import {Component, OnInit} from '@angular/core';
import {ApexAxisChartSeries, ApexChart, ApexTitleSubtitle, ApexXAxis} from "ng-apexcharts";
import {BeneficiaireService} from 'src/app/services/beneficiaire/beneficiaire.service';
import {AuthService} from 'src/app/services/security/auth/auth.service';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Demande} from 'src/app/model/demande';
import {DescriptionDemandeComponent} from '../description-demande/description-demande.component';
import {DataService} from 'src/app/services/data_service/data_service';
import {Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder} from 'ng-zorro-antd/table';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

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
  selector: 'app-layout',
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.scss']
})
export class DemandeComponent implements OnInit {
  beneficiaire : any;
  map = new Map();
  // @ViewChild("chart") chart: ChartComponent = new ChartComponent();
  idBeneficiaire: number = 0;
  listeDemande : any;
  isSpinning = false;
  baseUrlFile = environment.baseUrlFile;
  listeDemandeApprouvees : Array<Demande> = [];
  listeDemandeRejetees : Array<Demande> = [];
  public chartOptions: ChartOptions;

  listOfColumnsBis: ColumnItemBis[]= [
    {
      name: 'Statut demande',
      sortOrder: 'ascend',
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: Demande, b: Demande) => a.statutDossier?.localeCompare(b.statutDossier || '') || 1,
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
      filterFn: (statut: string, item: Demande) => item.statutDossier?.indexOf(statut) !== -1
      // filterFn: null
    }
  ]

  listOfColumns: ColumnItem[] = [
    {
      name: 'Date',
      sortOrder: 'descend',
      sortFn: (a: Demande, b: Demande) => a.dateCreation?.localeCompare(b.dateCreation || '') || 1,
      // sortFn: null,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Montant demandé',
      sortOrder: 'descend',
      sortFn: (a: Demande, b: Demande) => (a.montant || 1) - (b.montant || 1),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Montant octroyé',
      sortOrder: 'descend',
      sortFn: (a: Demande, b: Demande) => (a.montantOctroye || 1) - (b.montantOctroye || 1),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Type',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: Demande, b: Demande) => a.typeDemande?.localeCompare(b.typeDemande || '') || 1,
    }
  ];

  constructor(public beneficiaireService: BeneficiaireService, private authService: AuthService, private router : Router, private modalService: NzModalService, private data: DataService) {
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
        categories: ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul"]
      }
    };
  }


  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      let user = JSON.parse(this.authService.storage.getItem('currentUser') || '{}');
      // //console.log('local storage', user);
      this.idBeneficiaire = user.idParent;
      this.setStatusMap();
      this.onGetAllSecteurActivite();
    }
  }

  onGetAllSecteurActivite(){
    this.isSpinning = true;
    this.beneficiaireService.getAllDemande(this.idBeneficiaire).subscribe((response) => {
      this.isSpinning = false;
      console.log(response);
      this.beneficiaire = response ;
      this.listeDemande = response.demandes;
      for (let i = 0; i < this.listeDemande.length; i++) {
        if (this.listeDemande[i].statutDossier=='APPROUVE') {
          let length = this.listeDemandeApprouvees.length ;
          this.listeDemandeApprouvees[length] = this.listeDemande[i];
        } else if (this.listeDemande[i].statutDossier=='REJETE'){
          let length = this.listeDemandeRejetees.length ;
          this.listeDemandeRejetees[length] = this.listeDemande[i];
        }

      }
      //console.log(this.listeDemandeApprouvees);
    },
    (error)=>{
      this.isSpinning = false;
      //console.log(error);
    })
  }

  showModalDescriptionDemande(data:Demande): void {
    // this.currentInfo = data;
    this.data.changeMessageBeneficiaire(data);
    this.modalService.create({
      nzCancelText: null,
      nzTitle: 'Description demande',
      nzContent: DescriptionDemandeComponent,
      nzWidth: 1000
    });
  }

  goExpressionBesoin(data:Demande){
    this.data.changeMessageBeneficiaire(data);
    let typeBeneficiaire: string = this.beneficiaire.typeBeneficiaire;
    if(typeBeneficiaire.trim().toLowerCase()=='pme'){
      this.router.navigateByUrl('beneficiaire/expression-besoin/entreprise');
    }
    else if(typeBeneficiaire.trim().toLowerCase()=='gie'){
      this.router.navigateByUrl('beneficiaire/expression-besoin/gie');
    }
    else if(typeBeneficiaire.trim().toLowerCase()=='me'){
      this.router.navigateByUrl('beneficiaire/expression-besoin/microentreprise');
    }
  }

  setStatusMap(){
    this.map.set('INITIE', 'Initié');
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

  showConfirm(): void {
    this.modalService.confirm({
      nzTitle: 'Deconnexion',
      nzOkText: 'Oui',
      nzContent: 'Voulez-vous vraiment vous déconnecter ?',
      nzOnOk: () => {
        this.logout();
      }
    });
  }

  home(){

  }

  getStatusLibelle(codeStatus:any){
    return this.map.get(codeStatus);
  }

  logout(){
    this.authService.logout();
  }

  expandSet = new Set<string>();
  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }


  listOfData = [
    {
      id: '#1545300',
      name: 'Aminata Diallo',
      date: '16/7/21',
      montant: '8,500,000CFA',
      secteur: 'Agriculture',
      status : 'Bien',
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
      status : 'Bien',
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
      status : 'Bien',
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
      status : 'Bien',
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
      status : 'Bien',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },

  ];
}
