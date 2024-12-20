import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SwiperComponent } from "swiper/angular";
// import Swiper core and required modules
import SwiperCore, {Autoplay , Navigation, Grid, Pagination } from "swiper";


// install Swiper modules
SwiperCore.use([Autoplay, Navigation,Grid, Pagination]);

import { Geosn } from 'src/app/core/geo-data/geosn';
import { MapsAPILoader} from '@agm/core';
import * as anime from 'animejs';
import * as scrollmagic from 'scrollmagic';
import { ViewportScroller } from '@angular/common';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import { SupportService } from 'src/app/services/support/support.service';
import { HomeService } from 'src/app/services/configuration/home.service';
import { Support } from 'src/app/model/support';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homev2',
  templateUrl: './homev2.component.html',
  styleUrls: ['./homev2.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class Homev2Component implements OnInit {

  public origin: any;
  public destination: any;

  geoPositionList = new Geosn().GEO_DATA_SN;
  private geoCoder? : google.maps.Geocoder ;
  previousInfoWindow: any ;
  previous: any;

  indicateursInit : any  = {
    volumeFinancement : 0 ,
    nombreBeneficiaireEntreprise : 0 ,
    nombreBeneficiaireADate : 0 ,
    nombreBeneficiaireMicroEntrepreneur : 0 ,
    pourcentageBeneficiaireFemme : 0 ,
    pourcentageBeneficiaireJeune : 0 ,
    pourcentageBeneficiaireZoneRurale : 0 ,
  }

  animaticStatisticNumber : any ;
  indicateurs: any= this.indicateursInit ;
  // public origin: any;
  // public destination: any;
  buttonActivated = false ;

  lat = 14.710282610378616;
  lng = -17.475344902340513;
  iconUrlValue = { url: 'assets/images/Touch-Finance.png',
                  scaledSize: {height: 40, width: 40} } ;
  zoom = 12;
  title = 'Vous';
  labelCurrentPerson = 'Vous';

  modalRefFaq? :NzModalRef =undefined ;

  constructor(
    private homeService:HomeService,
    private _vps: ViewportScroller ,
    private fb : UntypedFormBuilder,
    private supportService: SupportService,
    private modalService: NzModalService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private changeDetector : ChangeDetectorRef,
    private router : Router
  ) { }

  @ViewChild('placeInput')
  public searchElementRef?: ElementRef;
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

  ngAfterViewInit(){

    // (<any>anime).default for managing error
  // typescript dont recognize it is a function
 this.ngZone.runOutsideAngular(()=>{

   let controller = new scrollmagic.Controller();
   // animation of aproposPhoto
   let  animePhotoAPropos  = this.rightToLeft(1000 , '.photo-apropos-v2');

   // animation of aproposText
   let  animePhotoAProposText  = this.leftToRight(1000 , '#apropos-content-text')

   // ****************** Fonctionnement ********************
  //  let animePhotoFonctionnement = this.rightToLeft(1000 , '.image-com-marche');

  //  let animeTexteFonctionnement = this.leftToRight(1000 , '.step-container') ;
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
    .createBasicScene("#apropos-container",0.9,1000,false)
    .on('enter' , (event)=>{
     animePhotoAPropos.play();
     animePhotoAProposText.play();
    })
    .addTo(controller);

    // scene for the animation of the statistics
    this.createBasicScene("#stat-header-container",0.5,7000,false)
        .on('enter' , (event) => {
         this.animaticStatisticNumber.play();
         // animaticStatisticContainer.play();
        })
        .addTo(controller);
    // this.createBasicScene(".comment-ca-part" , 1.0 , 0, false  )
    //     .on('enter' , (event )=> {
    //      animePhotoFonctionnement.play();
    //      animeTexteFonctionnement.play();
    //     })
    //     .addTo(controller);

 });


}

  parseNumber(value : string ){

    return Number(value);
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

onGetAllInfoSuqali(){
  this.homeService.getAIndicateurSuqali().subscribe((response) => {
    //console.log(response);
    this.indicateursInit = response ;

     // animation with the statistic

      this.animaticStatisticNumber =  (<any>anime).default({
        autoplay: true ,
        targets : this.indicateurs,
        volumeFinancement : this.indicateursInit.volumeFinancement ,
        nombreBeneficiaireEntreprise : this.indicateursInit.nombreBeneficiaireEntreprise ,
        nombreBeneficiaireADate : this.indicateursInit.nombreBeneficiaireADate,
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
    //console.log(err);IndicateuTOUCHPOINTSr
  })
}

goAPropos(){
  this.router.navigateByUrl('apropos');
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

scrollTo(anchor : string ){
  this._vps.scrollToAnchor(anchor);
}

goToLoginv2(){
  this.router.navigateByUrl("login")
}

  openFaq() {

if(!this.modalRefFaq) {


    this.modalRefFaq = this.modalService.info({
      nzOnOk: ()=> {this.modalRefFaq!.destroy();this.modalRefFaq=undefined},
      nzTitle: "Foire Aux Questons",
      nzContent: '<div xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html">' +
        '<hr></hr></br></br>' +

        '<h4>En quoi consiste TouchFinance ?</h4>' +
        '<p>TouchFinance est un projet d’élargissement de l’accès au financement des micro-entrepreneurs et des micro, petites et moyennes entreprises « MPME » au Sénégal, conçu pour apporter une réponse efficace face aux effets néfastes de la pandémie liée à la COVID-19. Des instruments et mécanismes de financement adaptés sont mis à la disposition des micro-entrepreneurs et MPME par les partenaires du projet. </p>' +
        '<h4>A qui est-il destiné ? </h4>' +
        '<p>Où que vous soyez au Sénégal, TouchFinance propose des solutions de financement adaptées à votre activité. TouchFinance visera en priorité les secteurs de l’agriculture, l’élevage, la pêche, l’artisanat, l’hôtellerie, la restauration, le commerce, le tourisme, le transport et la logistique, les TIC, l’éducation, la santé et la petite industrie.' +
        '</p>' +
        '<p>Les bénéficiaires éligibles sont les 2 catégories suivantes : </br>' +
        '<span class="premierdecalage">   • Les micro-entrepreneur.e.s individuel.le.s: toute personne physique exerçant, à titre individuel, une activité professionnelle, commerciale, artisanale, agricole ou de prestation de services, formelle ou informelle, dont le chiffre d’affaires annuel hors taxes est inférieur ou égal à 50 millions FCFA</br></pclass>' +
        '<span class="premierdecalage">    • Les micro, petites et moyennes entreprises et GIE : </span></br>' +
        ' <span class="deuxiemedecalage">       ◦ Micro-entreprises: toute personne, physique ou morale exerçant, en société ou en GIE, une activité professionnelle, commerciale, artisanale, agricole, industrielle ou de prestation de services, formelle ou informelle, et dont le chiffre d’affaires annuel est inférieur ou égal à 50 millions FCFA (ou pour les GIE, les revenus collectifs des membres ensemble ne dépassent pas 50 millions FCFA par an) </br></span>' +
        '  <span class="deuxiemedecalage">      ◦ Petites et moyennes entreprises: toute personne, physique ou morale exerçant, en société ou en GIE, une activité professionnelle, commerciale, artisanale, agricole, industrielle ou de prestation de services, formelle ou informelle, et dont le chiffre d’affaires annuel est compris entre 51 millions FCFA et 300 millions FCFA (ou pour les GIE, les revenus collectifs des membres ensemble sont compris entre 51 et 300 millions FCFA par an)</span></span>' +
        '</br>' +
        'Une priorité sera accordé aux femmes et jeunes entrepreneur.e.s surtout femme (jeunes femmes entre 15 et 35 ans) installé.e.s dans toutes les régions du Sénégal, principalement en zones rurales en dehors de la région de Dakar. </br>' +
        '<h4>Comment en bénéficier</h4>' +
        '<p>Pour faire partie de ce Projet, vous pouvez vous: </br>' +
        '<span class="premierdecalage">    • Rendre sur la plateforme <a routerLink="https://dev-www.gutouch.net">https://dev-www.gutouch.net</a> pour vous inscrire et soumettre une demande de financement; </span> </br>' +
        ' <span class="premierdecalage">   • Rapprocher des agents de votre institution financière ou de l’institution financière qui est la plus proche de vous (banques, institutions de microfinance, fonds d’investissements) pour leur demander si elles sont partenaires de Suqali, et si oui comment bénéficier de leurs offres «Suqali» sur place; </span> </br>' +
        ' <span class="premierdecalage">   • Rendre au TouchPoint le plus proche pour vous faire assister. Vous trouverez le TouchPoint le plus proche en vous rendant sur le site https://intouchgroup.net/sn/trouver-un-touchpoint/ pour le localiser. Pour les TouchPoints, un paiement de 1000FCFA est requis à l’enregistrement et 150 FCFA pour chaque vérification de statut à effectuer après inscription.</span></p>' +
        '<h4>De quoi pourrais-je bénéficier concrètement?</h4>' +
        '<p>Les financements mis à votre disposition par les partenaires financiers de TouchFinance seront de natures diverses et vont varier en fonction de vos besoins : par exemple il pourrait s’agir de micro-crédits, crédits d’exploitation court-terme, crédits de micro-investissements moyen terme, prêts d’honneur, avances remboursables, et du quasi-capital.</p>' +
        '<p>La plateforme digitale du Projet  <a routerLink="https://dev-www.gutouch.net">https://dev-www.gutouch.net</a> est conçue pour vous faire des propositions de financement en fonction des besoins que vous aurez exprimé en vous inscrivant. </p>' +
        '<p>Ces offres s’accompagneront des noms des partenaires financiers qui distribuent les produits qui vous seront proposés, ainsi que les informations clés telles que les taux d’intérêt applicables, les durées de remboursement, etc. La plateforme se chargera d’acheminer votre demande directement vers le partenaire financier que vous aurez choisi. Il est à souligner que chaque institution financière évalue les demandes de financements selon ses propres règles et reste souveraine dans la décision d’accorder ou non un financement. La plateforme TouchFinance ne joue qu’un rôle de place de marché et n’intervient pas dans la décision de financement en tant que telle.</p>' +
        '<p>Si vous décidez de vous rendre en agence chez un de nos partenaires, leurs agents vous orienteront sur les offres «Suqali» disponibles sur la plateforme depuis le site web ou l’application mobile réservée aux agents itinérants et TouchPoints. </p>' +
        '<p>Un service client ouvert 7j/7 de 09 :00 à 18 :00 est également à votre service pour répondre à vos questions concernant TouchFinance et les offres de nos partenaires financiers au numéro suivant par  <strong>téléphone ou WhatsApp +221 76 624 04 60  </strong></p>' +
        '<h4>En quoi vos équipes peuvent-elles m’aider? </h4>' +
        ' Le candidat est responsable de sa demande auprès du partenaire choisi mais il est à souligner que le projet dispose de toute une équipe support pour l’accompagner.</br>' +
        'Cette équipe support est composée : </br>' +
        ' <span class="premierdecalage">- d’<strong>analystes financiers </strong>pour vous aider à compléter les dossiers manquants et vous accompagner jusqu’à la soumission du dossier auprès d’un partenaire financier qui est responsable de la validation finale.</span></br>' +
        ' <span class="premierdecalage">- d’<strong>agents opérations</strong> dont la mission consiste à valider votre inscription en vérifiant les informations renseignées sur la plateforme sur votre identité et votre activité.</span></br>' +
        '- d’un <strong>SPOC </strong>(Single Point of Contact) pour répondre à vos sollicitations par appels, mails ou WhatsApp.   </br></br>' +
        '<h4>De combien pourrais-je bénéficier et à quel taux d’intérêt?</h4>' +
        '<p> Les montants vont varier en fonction de vos besoins: </br>' +
        ' <span class="premierdecalage">   • Pour les micro-entrepreneurs individuels, les montants octroyés par les partenaires de TouchFinance peuvent aller de 50 mille FCFA à 5 millions FCFA par demande.<strong> Toutefois chaque partenaire de TouchFinance définit et valide les montants à octroyer à chaque demandeur dans ces fourchettes.</strong></span> </br>' +
        '  <span class="premierdecalage">  • Pour les GIE et entreprises, les montants octroyés par les partenaires de TouchFinance peuvent aller de 500 mille FCFA à 50 millions FCFA par demande. <strong>Toutefois chaque partenaire de TouchFinance définit et valide les montants à octroyer à chaque demandeur dans ces fourchettes.</strong></span> </br>' +
        'Les taux d’intérêt annuel dans le cadre de TouchFinance peuvent variés en fonction des produits financiers et des partenaires mais<strong> tous plafonnés à 5% hors taxe. Chaque partenaire de TouchFinance définit et valide le taux d’intérêt en fonction de la nature de la demande reçue.</strong> </br>' +
        '</p>' +

        '<h4>Sur quelle durée (maximale) pourrais-je bénéficier du prêt?</h4>' +
        'Ceci dépendra de vos besoins exprimés. Les prêts peuvent aller de 3 mois à 24 mois selon le produit financier. La décision finale sur la durée du prêt sera prise par le partenaire financier de TouchFinance avec qui vous serez mis en relation.  </br></br>' +
        '<h4>Y’aura-t-il un délai minimal de grâce entre la réception des fonds et le démarrage des remboursements?</h4>' +

        'Ceci dépendra de vos besoins exprimés, des types de financement et de votre situation financière. Les périodes de grâce, partielle ou totale, peuvent aller de 0 à 03 mois. La décision finale sur la durée de la période de grâce sera prise par le partenaire financier de TouchFinance avec qui vous serez mis en relation. </br> </br>' +
        '<h4>Comment se font les décaissements et les remboursements si jamais ma demande de financement est acceptée?</h4>' +
        'Le décaissement sera effectué directement vers vous par le partenaire financier de TouchFinance qui aura accepté votre demande.</br>' +
        'Le remboursement du financement s’effectuera également directement du bénéficiaire vers le partenaire financier.</br></br>' +
        '<h4>Quelle est la différence entre se rendre sur la plateforme et se rendre en agence</h4>' +
        'En vous rendant sur la plateforme, vous pourrez voir directement toutes les offres de tous nos partenaires qui correspondent à vos besoins exprimés.  </br>' +
        'Lorsque vous vous rendez en agence, le partenaire fera un focus sur ses propres offres. Au moment de soumettre votre demande sur la plateforme, ses offres de financement seront affichées en priorité, à côté des autres offres de nos partenaires.</br>' +

        'Dans le cadre du Projet, il n’y aura pas de distinction entre les bénéficiaires qui se rendent directement sur la plateforme pour faire une demande et ceux qui sont référés par un partenaire vers la plateforme. </br></br>' +
        '<h4>Est-ce que j’ai besoin d’être client.e d’une institution financière partenaire</h4> ' +
        'Oui. Vous avez besoin d’être client d’une institution financière partenaire.  </br>' +
        'Si vous n’êtes pas encore client d’une institution financière partenaire, vous pouvez soumettre votre demande de financement à l’institution financière de votre choix que vous trouverez sur la plateforme et le traitement de cette demande sera effectué de façon autonome selon les procédures internes de l’organisation concernée. En sus de votre enregistrement sur la plateforme Suqali, vous aurez à vous rapprocher de l’institution financière partenaire de TouchFinance pour suivre leurs propres modalités d’adhésion afin de devenir leur client.  </br>' +

        'Si vous êtes client d’une institution financière qui n’est pas encore partenaire de Suqali, elle peut se rapprocher du projet pour voir si elle peut devenir partenaire ou bien vous pouvez toujours choisir une autre institution financière partenaire sur la plateforme. Vous deviendrez par la suite un nouveau client pour cette institution. </br></br>' +
        ' <h4>Combien de temps dure le Projet? </h4>' +
        ' Le Projet se déroulera jusqu’à fin septembre 2023. Les bénéficiaires potentiels peuvent soumettre leurs demandes de financement via la plateforme au plus tard jusqu’à fin décembre 2022 afin de se donner suffisamment de temps pour rembourser les financements obtenus aux partenaires financiers avant septembre 2023. Si toutefois, au-delà de décembre 2022, vous pensez que vous n’aurez pas besoin d’un prêt d’une longue durée qui pourra être remboursée avant septembre 2023 (par exemple un prêt ponctuel de quelques semaines ou de 3 mois, etc.), veuillez ne pas hésiter à vous rapprocher de votre institution financière partenaire de Suqali.  </br>' +
        '<h4> Comment bénéficier des programmes de renforcement de capacités? </h4> ' +
        ' La liste des partenaires de TouchFinance qui seront en charge de dispenser les programmes de renforcement de capacités sera publiée sur la plateforme <a routerLink="https://dev-www.gutouch.net">https://dev-www.gutouch.net</a> à une date ultérieure. En vous inscrivant sur la plateforme, vous pourrez recevoir une alerte. </br> </br>' +

        ' L’information sera également publiée sur nos différentes pages sur les réseaux sociaux que vous pouvez suivre d’ores et déjà: </br>' +
        '<span class="premierdecalage">    • Facebook https: www.facebook.com/Suqali-100680222470713</span></br>' +
        ' <span class="premierdecalage">   • Twitter https: www.twitter.com/SuqaliSN</span></br>' +
        ' <span class="premierdecalage">   • LinkedIn https: www.linkedin.com/company/suqalisn/about/</span></br>' +
        ' <span class="premierdecalage">   • WhatSapp  +221 76 624 04 60</span></br>' +
        ' <span class="premierdecalage">   • Instagram: https://www.instagram.com/suqali.officiel/?hl=fr</span></br>' +
        ' <span class="premierdecalage">   • Identifiant : suqali.officiel</span></br></br>' +
        '<h4>Qui a financé le projet? </h4>' +
        'Ce projet s’inscrit dans l’initiative d’appuyer les entrepreneurs et entreprises sénégalais touchés par la crise de la COVID19 mais aussi dans le but de favoriser l’inclusion financière à travers les partenaires de TouchFinance que vous retrouverez sur la plateforme <a routerLink="https://dev-www.gutouch.net">https://dev-www.gutouch.net</a>.</br></br></br>' +
        '<p>' +
        'Numéro: +221 76 624 04 60</br>' +
        'Courriel: contact@intouchgroup.net</br>' +
        'Site web: https://dev-www.gutouch.net' +

        '</p>' +
        '</div>',
      nzCentered: true,
      nzWidth: 1000
    });
  }

  }
  }

