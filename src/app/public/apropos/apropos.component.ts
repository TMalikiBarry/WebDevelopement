import { DOCUMENT } from '@angular/common';
import { Component, Inject, NgZone, OnInit } from '@angular/core';
import * as anime from 'animejs';

@Component({
  selector: 'app-apropos',
  templateUrl: './apropos.component.html',
  styleUrls: ['./apropos.component.scss']
})
export class AproposComponent implements OnInit {

  constructor(
  private  ngZone : NgZone,
  @Inject(DOCUMENT) private document: any,
  ){ }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.ngZone.runOutsideAngular( ()=>{
      // animation des secteurs a droite et a gauche

        // retrive class of the different element
       let elements = this.document.getElementsByClassName("secteur");

       console.table(elements);

       this.leftToRight(1000 , ".secteur").play();

    })
  }


  // function for animations
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

}
