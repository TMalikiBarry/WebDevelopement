import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/security/auth/auth.service";
import {PmoService} from "../../../services/pmo/pmo.service";
import {Offre} from "../../../model/offre";
import {InfoSelection} from "../../../model/info-selection";
import {PMO} from "../../../model/pmo";
import {Demande} from "../../../model/demande";

@Component({
  selector: 'app-offres',
  templateUrl: './offres.component.html',
  styleUrls: ['./offres.component.scss']
})
export class OffresComponent implements OnInit {
  idPmo: number = 0;
  isSpinning = false;
  pmo?: PMO;
  expandSet = new Set<string>();
  offers:  Offre[] = [];

  constructor(private authService : AuthService,
              private pmoService:PmoService) { }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      let user = this.authService.currentUserValue;
      this.idPmo = user.idParent;
      this.onGetAllOffer();
    }
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  onGetAllOffer(){
    this.isSpinning = true;
    this.pmoService.getById(this.idPmo).subscribe((response) => {
      this.isSpinning = false;
      //console.log(response);
      this.offers = response?.offres;
    },
    (error)=>{
      this.isSpinning = false;
      //console.log(error);
    })
  }

}
