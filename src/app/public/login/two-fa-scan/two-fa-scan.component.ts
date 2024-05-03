import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../../model/user";
import {StorageService} from "../../../services/Storage/storage.service";
import {AuthService} from "../../../services/security/auth/auth.service";

@Component({
  selector: 'app-two-fa-scan',
  templateUrl: './two-fa-scan.component.html',
  styleUrls: ['./two-fa-scan.component.scss']
})
export class TwoFaScanComponent implements OnInit {

  qrBase64!: string;
  currentUser!: User;

  constructor(private router: Router, private route: ActivatedRoute, private storage: StorageService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.storage.getItem('currentUser')!);
    // console.log('USER WANNA SCAN ', this.currentUser)
    this.qrBase64 = this.currentUser ? this.currentUser.codeQR! : this.authService.storage.getItem('SUQALI_QR')!;

    if (this.authService.isLoggedIn()) {
      this.authService.routingAlreadyConnectedApp();
    }

  }

  /*
    getQRCode(): string {
      console.log("++++++++++++++++++++");
      console.log(this.currentUser.responseLoginBulk.twoFactorAuthentication);
      console.log(this.qrBase64);
      return this.qrBase64;
    }
  */

  onNextStepTwoFa() {
    this.router.navigateByUrl('/two-fa');
  }

}
