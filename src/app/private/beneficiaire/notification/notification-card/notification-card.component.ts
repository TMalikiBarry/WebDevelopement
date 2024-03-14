import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Demande } from 'src/app/model/demande';
import { DataService } from 'src/app/services/data_service/data_service';
import { NotificationBeneficiaireService } from 'src/app/services/notification/notification-beneficiaire.service';
import { AuthService } from 'src/app/services/security/auth/auth.service';
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent implements OnInit {

  constructor(private dataService: DataService, private router : Router, public notifService : NotificationBeneficiaireService,
    private authService: AuthService, private changeDetector : ChangeDetectorRef) { }

  // data : any[] = [];
  pageIndex :number = 0;
  pageSize :number = 5;
  isSpinning = false ;
  baseUrlFile = environment.baseUrlFile;
  @Input() notifications : any ;

  ngOnInit(): void {
    this.getFirstNotification (this.pageIndex, this.pageSize);
    // console.log(this.notifications)
  }

  getFirstNotification (page:number, size:number){
    this.isSpinning = true ;
    if (localStorage.getItem('currentUser')) {

      let user  = this.authService.currentUserValue ;
      this.notifService.getNotification(user.idParent, page, size).subscribe(
        response=>{
          console.log(response);
          this.notifications = response;
          this.changeDetector.markForCheck() ;
          this.isSpinning = false ;
        },
        error => {
          console.log(error)
          this.isSpinning = false ;
        }
      );
    }
  }

  goExpressionBesoin(data:any){
    this.dataService.changeMessageBeneficiaire(data.demande);
    // console.log(this.notifications);
    // console.log(data);
    // console.log(data.demande);
    let typeBeneficiaire: string = data.beneficiaire.typeBeneficiaire;
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

  pageSizeCall(data:any){
    console.log(data);
    this.pageSize = data;
    this.getFirstNotification (this.pageIndex, this.pageSize);
  }

  pageIndexCall(data:any){
    console.log(data);
    this.pageIndex = data-1;
    this.getFirstNotification (this.pageIndex, this.pageSize);
  }

}
