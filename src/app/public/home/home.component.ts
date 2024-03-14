import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SwiperComponent } from "swiper/angular";
import { PageScrollService } from 'ngx-page-scroll-core';
// import Swiper core and required modules
import SwiperCore, { Autoplay, Navigation, Pagination, SwiperOptions } from "swiper";
import {DOCUMENT, ViewportScroller} from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/services/configuration/home.service';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Support } from 'src/app/model/support';
import { SupportService } from 'src/app/services/support/support.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Geosn } from 'src/app/core/geo-data/geosn';
import { MapsAPILoader} from '@agm/core';


import * as anime from 'animejs';


import * as scrollmagic from 'scrollmagic';


// install swiper module
SwiperCore.use([Navigation,Pagination,Autoplay]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

  indicateursInit : any  = {
    volumeFinancement : 0 ,
    nombreBeneficiaireEntreprise : 0 ,
    nombreBeneficiaireMicroEntrepreneur : 0 ,
    pourcentageBeneficiaireFemme : 0 ,
    pourcentageBeneficiaireJeune : 0 ,
    pourcentageBeneficiaireZoneRurale : 0 ,
  }

  animaticStatisticNumber : any ;
  indicateurs: any= this.indicateursInit ;
  public origin: any;
  public destination: any;
  buttonActivated = false ;

  constructor(private pageScrollService: PageScrollService, private router: Router, private homeService:HomeService,
             @Inject(DOCUMENT) private document: any,
            translate : TranslateService,
            private _vps: ViewportScroller ,
            private fb : UntypedFormBuilder,
            private supportService: SupportService,
            private modalService: NzModalService,
            private mapsAPILoader: MapsAPILoader,
            private ngZone: NgZone,
            private changeDetector : ChangeDetectorRef) {
          translate.setDefaultLang('fr');

          translate.use('fr');
}





ngAfterViewInit(){

     // (<any>anime).default for managing error
   // typescript dont recognize it is a function
  this.ngZone.runOutsideAngular(()=>{

    let controller = new scrollmagic.Controller();
    // animation of aproposPhoto
    let  animePhotoAPropos  = this.rightToLeft(1000 , '.photo-apropos');

    // animation of aproposText
    let  animePhotoAProposText  = this.leftToRight(1000 , '.apropos-text')

    // ****************** Fonctionnement ********************
    let animePhotoFonctionnement = this.rightToLeft(1000 , '.image-com-marche');

    let animeTexteFonctionnement = this.leftToRight(1000 , '.step-container') ;
    // ****************** Fonctionnement ********************


    // **************** Interactive Fonctionnement ***************
    // let step1Element =     document.querySelector('.step-1') ;
    // step1Element?.addEventListener('mouseenter' , ()=>{
    //   (<any>anime).default({
    //     targets : '.step-1',
    //     scale : [1,1.1],
    //     zIndex : [1, 4],
    //     translateY : [0 , 10] ,
    //     duration : 1500,
    //     easing : 'easeInQuad',


    //   }).play();
    // })
    // step1Element?.addEventListener('mouseleave' , ()=>{
    //   (<any>anime).default({
    //     targets : '.step-1',
    //     scale : 1,
    //     zIndex : 1,
    //     translateY : 0 ,
    //     duration : 1000,
    //     easing : 'easeOutQuad',
    //   }).play();

    // });

    this.interactReading('.step-1');
    this.interactReading('.step-2');
    this.interactReading('.step-3');
    // **************** Interactive Fonctionnement ***************

  //   // define animation of the statistic container
  //  let   animaticStatisticContainer = (<any>anime).default({
  //     targets : '.statistics',
  //     opacity : [0.2 , 1.0],
  //     duration : 4000,
  //     easing : 'linear'
  //   });

    // // animation time for statistic
    // let animeTimelineStat = (<any>anime).timeline({

    // })
    // animate based on the scroll
     this
     .createBasicScene(".Apropos",0.9,1000,false)
     .on('enter' , (event)=>{
      animePhotoAPropos.play();
      animePhotoAProposText.play();
     })
     .addTo(controller);

     // scene for the animation of the statistics
     this.createBasicScene(".statistic-container",0.5,7000,false)
         .on('enter' , (event) => {
          this.animaticStatisticNumber.play();
          // animaticStatisticContainer.play();
         })
         .addTo(controller);

     this.createBasicScene(".comment-ca-part" , 1.0 , 0, false  )
         .on('enter' , (event )=> {
          animePhotoFonctionnement.play();
          animeTexteFonctionnement.play();
         })
         .addTo(controller);
    //  let valueEndAnim  = 1.5;
    // hover animation for picture apropos
    //  this.document.querySelector('.photo-apropos')
    //       .addEventListener('mouseenter',()=>{
    //         (<any>anime).default({
    //           targets : '.photo-apropos',
    //           scale :[1,1.5],
    //           duration : 2000,
    //           easing : 'linear',
    //           reverse: true,
    //           update :  (anim : any)=>{
    //             console.log(anim)
    //           }
    //         })
    //       });
          // this.document.querySelector('.photo-apropos')
          // .addEventListener('mouseleave',()=>{
          //   (<any>anime).default({
          //     targets : '.photo-apropos',
          //     scale :[1.5,1],
          //     duration : 500,
          //     easing : 'linear'
          //   })
          // });
  });
}


// animations Functions START
leftToRight(duration : number , classe : string ){

  return(<any>anime).default({
    targets : classe ,
    translateX : {
      value: ['100vw' , '0vw'],
      duration: duration,
    },
    direction : 'normal',
    easing: 'linear'
  });
}

rightToLeft(duration : number , classe : string ){
  return (<any>anime).default({
    targets : classe,
    translateX : {
      value: ['-100vw' , '0vw'],
      duration: duration ,
    },
    direction : 'normal',
    easing: 'linear'
  });
}

interactReading(classe : string ){
  let step1Element =     document.querySelector(classe) ;
  let animeScaleIn : any  =  (<any>anime).default({
    autoplay : false ,
    targets : classe,
    scale : [1,1.1],
    zIndex :  {
              value :  4,
              duration : 50
              },
    translateY : [0 , 10] ,
    duration : 400,
    easing : 'linear',
  });


  let animeScaleOut : any = (<any>anime).default({
    autoplay : false ,
    targets : classe,
    scale : 1,
    zIndex : 1,
    translateY : 0 ,
    duration : 200,
    easing : 'linear',
  });

    step1Element?.addEventListener('mouseenter' , ()=>{
      animeScaleOut.pause();

      animeScaleIn.play();
    })
    step1Element?.addEventListener('mouseleave' , ()=>{
      animeScaleIn.pause();

      animeScaleOut.play();

    });
}
// animations Functions END

// Scroll magic helper Functions START
  createBasicScene(triggerElement: string , triggerHook : number , duration: number , reverse : boolean ){
    return new scrollmagic.Scene({
       triggerElement :triggerElement,
       triggerHook: triggerHook,
       duration: duration,
       reverse: reverse
    })
  }
// Scroll magic helper Functions END


ngDoCheck(){
// console.log('fire the check ')
}
// capture the child instance corresponding the input which we type place
// used with the autocomplete of google maps
@ViewChild('placeInput')
public searchElementRef?: ElementRef;

geoPositionList = new Geosn().GEO_DATA_SN;
private geoCoder? : google.maps.Geocoder ;
  previousInfoWindow: any ;
  previous: any;

parseNumber(value : string ){

  return Number(value);
}
// formulaire contact

formulaireContact = this.fb.group({
  nomPrenom : [ '' , Validators.required ],
  email : ['' ,  Validators.required],
  message : [ '' , Validators.required ],
  subject : ['' , Validators.required ]

});

submitted = false ;

envoyerMessage(){
  this.submitted = true ;
  if(this.formulaireContact.valid){
    let supportMail : Support = new Support()                           ;
    supportMail.nom = this.formulaireContact.controls.nomPrenom.value   ;
    supportMail.email = this.formulaireContact.controls.email.value     ;
    supportMail.message = this.formulaireContact.controls.message.value ;
    supportMail.subject = this.formulaireContact.controls.subject.value ;




    this.supportService.sendMailSupport(supportMail).subscribe(
      response => {
        //console.log(response);
        this.modalService.success(
          {
            nzTitle: 'Notification',
            nzContent: 'Votre message a été bien prise en compte. Nous vous revenons dans les plus bref delais'
          }
        );
        this.formulaireContact.reset();
        this.submitted = false ;
      }
    )
  }
  else
  {

  }
}


// formulaire contact

  lat = 14.710282610378616;
  lng = -17.475344902340513;
  iconUrlValue = { url: '../../../assets/images/logo/logo-mini.svg',
                  scaledSize: {height: 40, width: 40} } ;
  zoom = 12;
  title = 'Vous';
  labelCurrentPerson = 'Vous';


  // 14.710282610378616, -17.475344902340513

  // options for partner swiper
  config: SwiperOptions = {
    slidesPerView: 4,
    spaceBetween: 30,
    navigation: true,
    autoplay: {
      delay: 2500,
    },
    breakpoints:{
      100:{
        slidesPerView: 3,
        spaceBetween: 2,
      },
      768:{
        slidesPerView: 4,
        spaceBetween: 20,
      },
      970:{
        slidesPerView: 4,
        spaceBetween: 10,
      }
    },
    loop: true
  };

  // options for partner swiper
  configTemoignages: SwiperOptions = {
    centeredSlides: true,
    navigation: true,
    breakpoints:{
      100:{
        slidesPerView: 1,

      },
      768:{
        slidesPerView: 1,
        spaceBetween: 20,
      },
      970:{
        slidesPerView: 1.5,
        spaceBetween: 30,
      }
    }
  };

  ngOnInit(): void {
    this.onGetAllInfoSuqali();

    // loads places autocomplete

    this.mapsAPILoader.load()
    .then( ()=> {
      console.log('loaded')
        this.setCurrentLocation();
        this.geoCoder = new google.maps.Geocoder();
        let options = {
          types: ['geocode'],
          componentRestrictions: {country: "sn"},
         };

         console.log('loaded before');
        let autoComplete = new google.maps.places.Autocomplete(this.searchElementRef?.nativeElement , options );

        autoComplete.addListener('place_changed', ()=>{
          this.ngZone.run(
            ()=>{
              console.log('inside hoho');
              // retrive the result
              let place : google.maps.places.PlaceResult = autoComplete.getPlace();

              // check result
              if(place.geometry === undefined || place.geometry == null ){

                return ;
              }

              this.lat = place.geometry.location.lat();
              this.lng = place.geometry.location.lng();
            });
        });
      });
  }

  setCurrentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (position )=>{
          this.lat = position.coords.latitude ;
          this.lng = position.coords.longitude ;
        })
    }
  }
  //Direction Tracer
  getDirection(geo: any) {
    this.origin = { lat: this.lat, lng: this.lng };
    this.destination = { lat: this.parseNumber(geo._geolocalisation_latitude), lng: this.parseNumber(geo._geolocalisation_longitude) };
  }

  //zoom locality
  setZoom(geo: any){


    this.lat = geo._geolocalisation_latitude;
    this.lng = geo._geolocalisation_longitude;
    this.zoom += 1;
  }

  clickedMarker(infowindow: any) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  connexion(){
    this.router.navigateByUrl('login');
  }

  goAPropos(){
    this.router.navigateByUrl('apropos');
  }

  onGetAllInfoSuqali(){
    this.homeService.getAIndicateurSuqali().subscribe((response) => {
      //console.log(response);
      this.indicateursInit = response ;

       // animation with the statistic

        this.animaticStatisticNumber =  (<any>anime).default({
          autoplay: false ,
          targets : this.indicateurs,
          volumeFinancement : this.indicateursInit.volumeFinancement ,
          nombreBeneficiaireEntreprise : this.indicateursInit.nombreBeneficiaireEntreprise ,
          nombreBeneficiaireMicroEntrepreneur : this.indicateursInit.nombreBeneficiaireMicroEntrepreneur,
          pourcentageBeneficiaireFemme : this.indicateursInit.pourcentageBeneficiaireFemme ,
          pourcentageBeneficiaireJeune : this.indicateursInit.pourcentageBeneficiaireJeune ,
          pourcentageBeneficiaireZoneRurale : this.indicateursInit.pourcentageBeneficiaireZoneRurale ,
          round : 1,
          easing : 'linear',
          duration : 3000,
          update : (updateELement : any)=>{
            this.changeDetector.detectChanges();
          }
        });




    },
    err => {
      //console.log(err);Indicateur
    })
  }

  scrollFn(anchor: string): void{
    this._vps.scrollToAnchor(anchor)
  }


}
