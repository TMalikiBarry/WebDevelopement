import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TouchPointRoutingModule } from './touch-point-routing.module';
import { PersonneComponent } from './personne/personne.component';
import { BeneficiareComponent } from './beneficiare/beneficiare.component';
import { DemandeComponent } from './demande/demande.component';
import {RouterModule} from "@angular/router";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import { TouchComponent } from './touch/touch.component';
import { TemplateComponent } from './template/template.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "../../app.module";
import {HttpClient} from "@angular/common/http";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NotificationComponent} from "./notification/notification.component";
import {NotificationCardComponent} from "./notification/notification-card/notification-card.component";
import {NzCommentModule} from "ng-zorro-antd/comment";
import {NzListModule} from "ng-zorro-antd/list";
import {GestionUsersComponent} from "./gestion-user/gestion-user.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FormAjoutUserPMOComponent} from "./form-ajout-utilisateurs/form-ajout-user.component";
import {AddUserComponent} from "./form-ajout-utilisateurs/ajout-user/ajout-user.component";
import {ConnexionComponent} from "./form-ajout-utilisateurs/connexion/connexion.component";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzResultModule} from "ng-zorro-antd/result";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzFormModule} from "ng-zorro-antd/form";



@NgModule({
  declarations: [
    PersonneComponent,
    BeneficiareComponent,
    DemandeComponent,
    TouchComponent,
    TemplateComponent,
    NotificationComponent,
    NotificationCardComponent,
    GestionUsersComponent,
    FormAjoutUserPMOComponent,
    AddUserComponent,
    ConnexionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TouchPointRoutingModule,
    NzLayoutModule,
    NzGridModule,
    NzAvatarModule,
    NzDropDownModule,
    TranslateModule.forChild(
      {
        defaultLanguage: 'fr',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    ),
    NzModalModule,
    NzTableModule,
    NzSpinModule,
    NzTabsModule,
    NzIconModule,
    NzToolTipModule,
    NzButtonModule,
    NzPaginationModule,
    NzPopoverModule,
    NzCommentModule,
    NzListModule,
    FormsModule,
    NzStepsModule,
    NzResultModule,
    NzCardModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule
  ]
})
export class TouchPointModule { }
