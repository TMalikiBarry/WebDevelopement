import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card-offre',
  templateUrl: './card-offre.component.html',
  styleUrls: ['./card-offre.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardOffreComponent implements OnInit {

  constructor() { }

  //somme offre
  @Input() sommeOffre : string = "8,000,000 CFA" ;

  // ***** Nom du PMO *****
  @Input() nomEntreprise: string = "";

  // ***** Taux Offre *****
  @Input() tauxOffre: String = "" ;

  // ***** Logo ******
  @Input() logo : String = ""

  @Output() connexionInfoChange = new EventEmitter<any>();

  ngOnInit(): void {

  }

}
