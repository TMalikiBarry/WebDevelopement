import {Component, OnInit, ViewChild} from '@angular/core';
import {ApexAxisChartSeries, ApexChart, ApexTitleSubtitle, ApexXAxis, ChartComponent} from "ng-apexcharts";
import {NzModalService} from 'ng-zorro-antd/modal';
import {BeneficiaireGieService} from 'src/app/services/beneficiaire/beneficiaire-gie/beneficiaire-gie.service';
import {BeneficiairePmeService} from 'src/app/services/beneficiaire/beneficiaire-pme/beneficiaire-pme.service';
import {BeneficiaireMEService} from 'src/app/services/beneficiaire/beneficiaire_me/beneficiaire-me.service';
import {AuthService} from 'src/app/services/security/auth/auth.service';
import {PmoService} from 'src/app/services/pmo/pmo.service';
import {Demande} from 'src/app/model/demande';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};


@Component({
  selector: 'app-layout',
  templateUrl: './financement.component.html',
  styleUrls: ['./financement.component.scss']
})
export class FinancementComponent implements OnInit {
  idPmo: number=0;
  listeDemande : any;
  listeDemandeApprouvees : Array<Demande> = [];
  listeDemandeRejetees : Array<Demande> = [];
  @ViewChild("chart") chart!: ChartComponent;

  public chartOptions: ChartOptions;
  listBeneficiaire : any[] = [];
  listBeneficiaireApprouve : any[] = [];
  listBeneficiaireNonApprouve : any[] = [];

  constructor(private modalService : NzModalService,
              private authService : AuthService,
              private pmoService:PmoService,
              private beneficiaireGieService : BeneficiaireGieService,
              private beneficiaireMeService : BeneficiaireMEService,
              private beneficiairePMEService : BeneficiairePmeService) {
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
    // this.getAllBeneficiaires();
    if (localStorage.getItem('currentUser')) {
      let user = JSON.parse(this.authService.storage.getItem('currentUser') || '{}');
      // //console.log('local storage', user);
      this.idPmo = user.idParent;
      this.onGetAllDemande();
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


  onGetAllDemande(){
    this.pmoService.getAll(this.idPmo).subscribe((response) => {
      //console.log(response);
      // this.beneficiaire = response ;
      this.listeDemande = response;
      // for (let i = 0; i < this.listeDemande.length; i++) {
      //   if (this.listeDemande[i].demande?.statutDossier=='APPROUVE') {
      //     let length = this.listeDemandeApprouvees.length ;
      //     this.listeDemandeApprouvees[length] = this.listeDemande[i].demande || {};
      //   }
      //   else if (this.listeDemande[i].demande?.statutDossier=='REJETE'){
      //     let length = this.listeDemandeRejetees.length ;
      //     this.listeDemandeRejetees[length] = this.listeDemande[i].demande || {};
      //   }

      // }
      // //console.log(this.listeDemandeApprouvees);
    })
  }

  // listOfData = [
  //   {
  //     id: '#1545300',
  //     name: 'Aminata Diallo',
  //     date: '16/7/21',
  //     montant: '8,500,000CFA',
  //     secteur: 'Agriculture',
  //     status : 'Bien',
  //     age: 32,
  //     expand: false,
  //     address: 'New York No. 1 Lake Park',
  //     description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
  //   },
  //   {
  //     id: '#1545301',
  //     name: 'Aminata Diallo',
  //     date: '16/7/21',
  //     montant: '8,500,000CFA',
  //     secteur: 'Agriculture',
  //     status : 'Bien',
  //     age: 32,
  //     expand: false,
  //     address: 'New York No. 1 Lake Park',
  //     description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
  //   },
  //   {
  //     id: '#1545302',
  //     name: 'Aminata Diallo',
  //     date: '16/7/21',
  //     montant: '8,500,000CFA',
  //     secteur: 'Agriculture',
  //     status : 'Bien',
  //     age: 32,
  //     expand: false,
  //     address: 'New York No. 1 Lake Park',
  //     description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
  //   },
  //   {
  //     id: '#1545303',
  //     name: 'Aminata Diallo',
  //     date: '16/7/21',
  //     montant: '8,500,000CFA',xpression-besoin/eb-micro-entreprise/form-demande.component.ts
  //     Fusion automatique de src/app/private/beneficiaire/descri
  //     secteur: 'Agriculture',
  //     status : 'Bien',
  //     age: 32,
  //     expand: false,
  //     address: 'New York No. 1 Lake Park',
  //     description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
  //   },
  //   {
  //     id: '#1545304',
  //     name: 'Aminata Diallo',
  //     date: '16/7/21',
  //     montant: '8,500,000CFA',
  //     secteur: 'Agriculture',
  //     status : 'Bien',
  //     age: 32,
  //     expand: false,
  //     address: 'New York No. 1 Lake Park',
  //     description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
  //   },

  // ];
}
