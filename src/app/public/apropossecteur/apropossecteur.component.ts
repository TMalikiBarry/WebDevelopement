import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-apropossecteur',
  templateUrl: './apropossecteur.component.html',
  styleUrls: ['./apropossecteur.component.scss']
})
export class ApropossecteurComponent implements OnInit {

  constructor() { }

  @Input() imgSrc : string ='' ;
  @Input() textSecteur : string ='' ;

  ngOnInit(): void {
  }

}
