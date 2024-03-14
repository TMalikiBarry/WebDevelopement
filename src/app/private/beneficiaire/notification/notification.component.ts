import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzIconService} from 'ng-zorro-antd/icon';
import {NzModalService} from 'ng-zorro-antd/modal';
import {AuthService} from 'src/app/services/security/auth/auth.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(private iconService: NzIconService,
              private authService: AuthService,
              private modal: NzModalService,
              private router: Router) {
  }


  ngOnInit(): void {
    // this.getFirstNotification();
  }

  listNotification: any;
  baseUrlFile = '';
  isSpinning = false;

  home() {
    this.router.navigateByUrl('home');
  }

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
