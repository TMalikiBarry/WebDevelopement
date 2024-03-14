import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent implements OnInit {

  @Input() imgSrc : string = '';
  @Input() statNumber: string = '0' ;
  @Input() statText : string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
