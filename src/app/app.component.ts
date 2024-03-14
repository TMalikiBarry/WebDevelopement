import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { SwiperComponent } from "swiper/angular";

// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination } from "swiper";
import {Subscription} from "rxjs";
import {MessageService} from "./services/message/message-service.service";
import {ToastrService} from "ngx-toastr";
import { Router } from '@angular/router';
import { AuthService } from './services/security/auth/auth.service';

import * as anime from 'animejs';
import * as scrollmagic from 'scrollmagic';
// install swiper module
SwiperCore.use([Navigation]);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit{
  title = 'teranga-crrp-web';
  message: any;
  subscription: Subscription;




  constructor(private messageService : MessageService, private router : Router, private authService: AuthService,
              private toastr: ToastrService
              ) {
    this.subscription = this.messageService.getMessage().subscribe(
      message => {
        console.log(message);
        this.toastr
          .success('<span class="text-center"><span class="tim-icons icon-bell-55" [data-notify]="icon"></span> '
            + message.text + '</span>' , 'Notifications ', {
            disableTimeOut: true,
            closeButton: true,
            enableHtml: true,
            toastClass: 'alert alert-info alert-with-icon',
            positionClass: 'toast-' + 'top' + '-' +  'center',
            timeOut: 500,
            extendedTimeOut: 500
          });
      }
    );
  }

  ngOnInit(): void {
   
  }

}
