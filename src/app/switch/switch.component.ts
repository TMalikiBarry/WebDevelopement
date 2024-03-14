import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {
  beneficiaireId: any;

  constructor(private activateRoute: ActivatedRoute) {
    this.beneficiaireId = this.activateRoute.snapshot.params.beneficiaire;
  }

  ngOnInit(): void {
  }
  index1 = 0;
  index2 = 0;
}
