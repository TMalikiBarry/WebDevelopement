import { NgModule } from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';

import { FormulaireRoutingModule } from './formulaire-routing.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormMicroEntrepreneursComponent } from './form-micro-entrepreneurs/form-micro-entrepreneurs.component';
import { FormEntrepriseComponent } from './form-entreprise/form-entreprise.component';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
// import { ActivitesMicroEntrepreneurComponent } from './form-micro-entrepreneurs/activites-micro-entrepreneur/activites-micro-entrepreneur.component';
import {NzRadioModule} from "ng-zorro-antd/radio";
import { PersonnecontactComponent } from './form-micro-entrepreneurs/personnecontact/personnecontact.component';
import { AgentComponent } from './form-micro-entrepreneurs/agent/agent.component';
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzCardModule} from "ng-zorro-antd/card";
import { ConnexionComponent } from './form-micro-entrepreneurs/connexion/connexion.component';
import {NzButtonModule} from "ng-zorro-antd/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import { ActivitesMicroEntrepreneurComponent } from './form-micro-entrepreneurs/activites-micro-entrepreneur/activites-micro-entrepreneur.component';

import { IdentificationEntrepriseComponent } from './form-entreprise/identification-entreprise/identification-entreprise.component';
import { IdentificationAgentComponent } from './form-entreprise/identification-agent/identification-agent.component';
import { IdentificationPersonContactComponent } from './form-entreprise/identification-person-contact/identification-person-contact.component';
import { IdentificationDirigeantComponent } from './form-entreprise/identification-dirigeant/identification-dirigeant.component';
import { DescriptionActiviteEntrepriseComponent } from './form-entreprise/description-activite-entreprise/description-activite-entreprise.component';
import { FormGieComponent } from './form-gie/form-gie.component';
import { GieIdentificationPersonContactComponent } from './form-gie/gie-identification-person-contact/gie-identification-person-contact.component';
import { GieIdentificationAgentComponent } from './form-gie/gie-identification-agent/gie-identification-agent.component';
import { GieIdentificationGroupementComponent } from './form-gie/gie-identification-groupement/gie-identification-groupement.component';
import { GieIdentificationActiviteGroupementComponent } from './form-gie/gie-identification-activite-groupement/gie-identification-activite-groupement.component';
import { RegisterFormEntrepriseComponent } from './form-entreprise/register-form-entreprise/register-form-entreprise.component';
import { RegisterFormGieComponent } from './form-gie/register-form-gie/register-form-gie.component';
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzAlertModule} from "ng-zorro-antd/alert";
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import { NzResultModule } from 'ng-zorro-antd/result';
import {WebcamModule} from 'ngx-webcam';
import { SelphieComponent } from './form-micro-entrepreneurs/selphie/selphie.component';
import {NzModalModule} from 'ng-zorro-antd/modal';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzImageModule } from 'ng-zorro-antd/image';
import { PmeSelphieComponent } from './form-entreprise/pme-selphie/pme-selphie.component';
import { GieSelphieComponent } from './form-gie/gie-selphie/gie-selphie.component';
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import { FormAnalysteMeComponent } from './form-analyste-me/form-analyste-me.component';
//import { FormAnalystePmeComponent } from './form-analyste-pme-gie/form-analyste-pme.component';
import { FormAnalystePmeGieComponent } from './form-analyste-pme-gie/form-analyste-pme-gie.component';
import { IdentifyEntrepreneurComponent } from './form-analyste-pme-gie/identify-entrepreneur/identify-entrepreneur.component';
import { IdentifyEntrepriseComponent } from './form-analyste-pme-gie/identify-entreprise/identify-entreprise.component';
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {FormDemandeComponent} from "./form-demande/form-demande.component";
import {DescriptionProjetComponent} from "./form-demande/description-projet/description-projet.component";
import {ExpressionBesoinComponent} from "./form-demande/expression-besoin/expression-besoin.component";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import { IdentificationComponent } from './form-analyste-me/identification/identification.component';
import { ActiviteComponent } from './form-analyste-me/activite/activite.component';
import { CapaciteRemboursementComponent } from './form-analyste-me/capacite-remboursement/capacite-remboursement.component';
import { DescriptionTemplateComponent } from './description-template/description-template.component';
import {NzTabsModule} from "ng-zorro-antd/tabs";



@NgModule({
  declarations: [
    FormMicroEntrepreneursComponent,
    FormEntrepriseComponent,
    IdentificationEntrepriseComponent,
    IdentificationAgentComponent,
    IdentificationPersonContactComponent,
    ActivitesMicroEntrepreneurComponent,
    IdentificationDirigeantComponent,
    DescriptionActiviteEntrepriseComponent,
    PersonnecontactComponent,
    AgentComponent,
    ConnexionComponent,
    FormGieComponent,
    FormDemandeComponent,
    GieIdentificationPersonContactComponent,
    GieIdentificationAgentComponent,
    GieIdentificationGroupementComponent,
    GieIdentificationActiviteGroupementComponent,
    RegisterFormEntrepriseComponent,
    RegisterFormGieComponent,
    SelphieComponent,
    PmeSelphieComponent,
    GieSelphieComponent,
    FormAnalysteMeComponent,
    FormAnalystePmeGieComponent,
    IdentifyEntrepreneurComponent,
    IdentifyEntrepriseComponent,
    DescriptionProjetComponent,
    ExpressionBesoinComponent,
    IdentificationComponent,
    ActiviteComponent,
    CapaciteRemboursementComponent,
    DescriptionTemplateComponent,
  ],
  exports: [
    FormEntrepriseComponent,
    FormMicroEntrepreneursComponent,
    FormGieComponent,
    FormDemandeComponent
  ],
    imports: [
        CommonModule,
        FormulaireRoutingModule,
        NzFormModule,
        NzInputModule,
        NzSelectModule,
        NzInputNumberModule,
        NzStepsModule,
        NzLayoutModule,
        NzDividerModule,
        NzCardModule,
        NzButtonModule,
        NzGridModule,
        NzRadioModule,
        ReactiveFormsModule,
        NzCollapseModule,
        NzPopoverModule,
        NzDropDownModule,
        FormsModule,
        NzPopconfirmModule,
        NzIconModule,
        NzIconModule,
        NzPopconfirmModule,
        NzAlertModule,
        NzNotificationModule,
        NzToolTipModule,
        NzResultModule,
        WebcamModule,
        NzModalModule,
        NzUploadModule,
        NzImageModule,
        NzSpaceModule,
        NzCheckboxModule,
        NzSpinModule,
        NzBadgeModule,
        NzDatePickerModule,
        NzTabsModule,
    ],

  providers: [
    CurrencyPipe
  ]
})
export class FormulaireModule { }
