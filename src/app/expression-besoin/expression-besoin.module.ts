import { NgModule } from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';

import { ExpressionBesoinRoutingModule } from './expression-besoin-routing.module';
import { EbMicroEntrepriseComponent } from './eb-micro-entreprise/eb-micro-entreprise.component';
import { DescriptionProjetComponent } from './eb-micro-entreprise/description-projet/description-projet.component';
import { ExpressionBesoinComponent } from './eb-micro-entreprise/expression-besoin/expression-besoin.component';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {NzCardModule} from "ng-zorro-antd/card";
import { EbEntrepriseComponent } from './eb-entreprise/eb-entreprise.component';
import { DemandeFinancementComponent } from './eb-entreprise/demande-financement/demande-financement.component';
import { DescriptionProjetEntrepriseComponent } from './eb-entreprise/description-projet-entreprise/description-projet-entreprise.component';
import {NzDividerModule} from "ng-zorro-antd/divider";
import { EbGieComponent } from './eb-gie/eb-gie.component';
import { DescriptionProjetGieComponent } from './eb-gie/description-projet-gie/description-projet-gie.component';
import { DemandeFinancementGieComponent } from './eb-gie/demande-financement-gie/demande-financement-gie.component';
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {ToastrService} from "ngx-toastr";
import {MessageService} from "../services/message/message-service.service";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import { NzResultModule } from 'ng-zorro-antd/result';
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {NzModalModule} from "ng-zorro-antd/modal";
import { NzSpinModule } from 'ng-zorro-antd/spin';



@NgModule({
  declarations: [

    EbMicroEntrepriseComponent,
       DescriptionProjetComponent,
       ExpressionBesoinComponent,
       EbEntrepriseComponent,
       DemandeFinancementComponent,
       DescriptionProjetEntrepriseComponent,
       EbGieComponent,
       DescriptionProjetGieComponent,
       DemandeFinancementGieComponent


  ],
    imports: [
        CommonModule,
        ExpressionBesoinRoutingModule,
        NzFormModule,
        NzInputModule,
        NzSelectModule,
        NzInputNumberModule,
        NzStepsModule,
        NzLayoutModule,
        NzGridModule,
        NzRadioModule,
        NzUploadModule,
        NzCollapseModule,
        NzCardModule,
        NzDividerModule,
        NzDropDownModule,
        NzButtonModule,
        NzDatePickerModule,
        FormsModule,
        NzIconModule,
        NzPopoverModule,
        NzCardModule,
        ReactiveFormsModule,
        NzFormModule,
        NzGridModule,
        NzAlertModule,
        NzToolTipModule,
        NzPopconfirmModule,
        NzResultModule,
        NzBadgeModule,
        NzModalModule,
        NzSpinModule


    ],
  providers: [
    CurrencyPipe
  ]
})
export class ExpressionBesoinModule { }
