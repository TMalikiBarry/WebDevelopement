import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartComponent} from "ng-apexcharts";
import {NzModalService} from "ng-zorro-antd/modal";
import {AuthService} from "../../../services/security/auth/auth.service";
import {PmoService} from "../../../services/pmo/pmo.service";
import {environment} from "../../../../environments/environment";
import {TouchPointService} from "../../../services/touch-point/touch-point.service";

@Component({
  selector: 'app-touch',
  templateUrl: './touch.component.html',
  styleUrls: ['./touch.component.scss']
})
export class TouchComponent implements OnInit {

  idPmo: number=0;
  baseUrlFile: any;
  role: string = '';
  // @ts-ignore
  @ViewChild("chart") chart: ChartComponent = new ChartComponent();
  constructor(private modalService : NzModalService,
              public authService : AuthService,
              private pmoService:PmoService,
              private touchPointService: TouchPointService) {
  }


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
    this.onGetInfoPmo();
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
    })
  }

  getAllPersonnes(){
    this.touchPointService.getAllPersonnes().subscribe(response => {
    })
  }
}
