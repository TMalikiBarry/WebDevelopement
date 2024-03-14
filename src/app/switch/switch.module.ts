import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SwitchComponent} from "./switch.component";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {SwitchRoutingModule} from "./switch-routing.module";
import {NzModalRef} from "ng-zorro-antd/modal";



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    NzLayoutModule,
    SwitchRoutingModule,
  ]
})
export class SwitchModule { }
