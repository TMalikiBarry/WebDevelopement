import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzIconService } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BeneficiaireService } from 'src/app/services/beneficiaire/beneficiaire.service';
import { NotificationBeneficiaireService } from 'src/app/services/notification/notification-beneficiaire.service';
import { AuthService } from 'src/app/services/security/auth/auth.service';
import {environment} from "../../../../environments/environment";
import {NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table";
import {Demande} from "../../../model/demande";
import {Notification} from "../../../model/notification";

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Notification> | null;
  sortDirections: NzTableSortOrder[];
}
interface ColumnItemBis {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Notification> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<Notification> | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
}
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})

export class NotificationComponent implements OnInit {

  listOfColumns: ColumnItem[] = [
    {
      name: 'Date Modification',
      sortOrder: null,
      sortFn: (a: Notification, b: Notification) => a.demande.dateCreation?.localeCompare(b.demande.dateCreation || '') || 1,
      //sortFn: null,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'ID Beneficiaire',
      sortOrder: null,
      sortFn: (a: Notification, b: Notification) => (a.beneficiaire?.id || 1) - (b.beneficiaire?.id  || 1),
      //sortFn : null,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'ID Demande',
      sortOrder: null,
      //sortFn: (a: Demande, b: Demande) => (a.montant || 1) - (b.montant || 1),
      sortFn: (a: Notification, b: Notification) => (a.demande?.id || 1) - (b.demande?.id  || 1),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Agent',
      sortOrder: null,
      //sortFn: (a: Demande, b: Demande) => (a.montant || 1) - (b.montant || 1),
      sortFn: (a: Notification, b: Notification) => a.auteur.nom?.localeCompare(b.auteur.nom || '') || 1,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Profil Agent',
      sortOrder: null,
      //sortFn: (a: Demande, b: Demande) => (a.montant || 1) - (b.montant || 1),
      sortFn: (a: Notification, b: Notification) => a.auteur?.acces?.profil?.libelle?.localeCompare(b.auteur?.acces?.profil?.libelle || '') || 1,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Action',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: Notification, b: Notification) => a.motif?.localeCompare(b.motif || '') || 1,
    }
  ];

  constructor(private iconService: NzIconService,
              private authService: AuthService,
              private modal: NzModalService,
              private router: Router,
              public beneficiaireService: BeneficiaireService,
              public notifService : NotificationBeneficiaireService,
              private changeDetector : ChangeDetectorRef) { }


  ngOnInit(): void {
    // this.getFirstNotification();
    this.getFirstNotification(this.pageIndex, this.pageSize);
  }

  listNotification : any ;
  pageIndex :number = 0;
  pageSize :number = 5;
  baseUrlFile = environment.baseUrlFile ;
  isSpinning = false ;
  home(){}

  showConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Deconnexion',
      nzOkText: 'Oui',
      nzContent: 'Voulez-vous vraiment vous déconnecter ?',
      nzOnOk: () => {
        this.logout();
      }
    });
  }

  logout(){
    this.authService.logout();
  }

  getFirstNotification (page:number, size:number){
    this.isSpinning = true ;
    if (localStorage.getItem('currentUser')) {

      let user  = this.authService.currentUserValue ;
      this.notifService.getNotificationPMO(user.idParent, page, size).subscribe(
        response=>{
          console.log(response);
          this.listNotification = response;
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

  // getFirstNotification (){
  //   this.isSpinning = true ;
  //   if (localStorage.getItem('currentUser')) {

  //     let user  = this.authService.currentUserValue ;
  //   this.notifService.getNotification(user.idParent).subscribe(
  //     response=>{
  //       console.log(response)
  //       this.listNotification = response
  //       this.changeDetector.markForCheck() ;
  //       this.isSpinning = false ;
  //     },
  //     error => {
  //       console.log(error)
  //       this.isSpinning = false ;
  //     }
  //   );
  // }
// }
}
