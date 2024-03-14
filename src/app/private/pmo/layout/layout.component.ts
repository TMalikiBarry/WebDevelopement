
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { NzModalService } from 'ng-zorro-antd/modal';
import { BeneficiaireGieService } from 'src/app/services/beneficiaire/beneficiaire-gie/beneficiaire-gie.service';
import { BeneficiairePmeService } from 'src/app/services/beneficiaire/beneficiaire-pme/beneficiaire-pme.service';
import { BeneficiaireMEService } from 'src/app/services/beneficiaire/beneficiaire_me/beneficiaire-me.service';
import { AuthService } from 'src/app/services/security/auth/auth.service';
import { PmoService } from 'src/app/services/pmo/pmo.service';
import { Demande } from 'src/app/model/demande';
import {environment} from "../../../../environments/environment";



export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

// tooltipStyle : Object =  {
//   'font-family' : "Manrope"
// };

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  idPmo: number=0;
  listeDemande : any;
  baseUrlFile: any;
  listeDemandeApprouvees : Array<Demande> = [];
  listeDemandeRejetees : Array<Demande> = [];
  role: string = '';

  //@ViewChild("chart") chart: ChartComponent = new ChartComponent();

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
    this.baseUrlFile = environment.baseUrlFile;

    if (localStorage.getItem('currentUser')) {
      let user = this.authService.currentUserValue;
      console.log(user);
      this.idPmo = user.idParent;
      if(user?.roles){
        this.role = user?.roles[0];
      }
    }
    this.onGetInfoPmo();

  }


  expandSet = new Set<string>();
  pmo?: any;

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

  onGetInfoPmo(){
    this.pmoService.getById(this.idPmo).subscribe(response => {
      //console.log('response ==> ', response)
      this.pmo = response;
    })
  }
}
