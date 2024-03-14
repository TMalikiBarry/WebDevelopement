import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmoRoutingModule } from './pmo-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { IndicateursComponent } from './indicateurs/indicateurs.component';
import { ProfilUserComponent } from './profil-user/profil-user.component';
import { DescriptionDemandeComponent } from './description-demande/description-demande.component';
import { DescriptionBeneficiaireComponent } from './description-beneficiaire/description-beneficiaire.component';
import { UsersBeneficiaireComponent } from './beneficiaire-users/beneficiaire-users.component';
import { AddUserComponent } from './form-ajout-utilisateurs/ajout-user/ajout-user.component';
import { FormAjoutUserPMOComponent } from './form-ajout-utilisateurs/form-ajout-user.component';
import { ModifyUserComponent } from './modify-user/modify-user.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationCardComponent } from './notification/notification-card/notification-card.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ConnexionComponent } from './form-ajout-utilisateurs/connexion/connexion.component';
import { GestionUsersComponent } from './gestion-user/gestion-user.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCollapseModule} from "ng-zorro-antd/collapse";
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzImageModule } from 'ng-zorro-antd/image';
import {
  NgApexchartsModule
} from "ng-apexcharts";
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from 'src/app/app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ApercuComponent } from './apercu/apercu.component';
import { OffresComponent } from './offres/offres.component';
import { OffresBeneficiaireComponent } from './offers-beneficiaire/offers-beneficiaire.component';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzAlertModule} from "ng-zorro-antd/alert";
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";

@NgModule({
  declarations: [
    LayoutComponent,
    AddUserComponent,
    ApercuComponent,
    OffresComponent,
    OffresBeneficiaireComponent,
    FormAjoutUserPMOComponent,
    DescriptionBeneficiaireComponent,
    ChangePasswordComponent,
    IndicateursComponent,
    UsersBeneficiaireComponent,
    ProfilUserComponent,
    ConnexionComponent,
    ModifyUserComponent,
    DescriptionDemandeComponent,
    GestionUsersComponent,
    NotificationComponent,
    NotificationCardComponent
  ],
  imports: [
    CommonModule,
    NzCardModule,
    NzCommentModule,
    PmoRoutingModule,
    NzCheckboxModule,
    NzPopoverModule,
    NzResultModule,
    NzSpaceModule,
    NzPaginationModule,
    NzListModule,
    NzNotificationModule,
    NzAlertModule,
    NzPopconfirmModule,
    NzRadioModule,
    NzLayoutModule,
    NzCollapseModule,
    NzDropDownModule,
    NzInputModule,
    NzSelectModule,
    NzInputNumberModule,
    NzMenuModule,
    NzDatePickerModule,
    FormsModule,
    NzDividerModule,
    ReactiveFormsModule,
    NzModalModule,
    NzSpinModule,
    NzFormModule,
    NzTabsModule,
    NzBadgeModule,
    NzDescriptionsModule,
    NzToolTipModule,
    NzLayoutModule,
    NzAvatarModule,
    NzGridModule,
    NzIconModule,
    NzTableModule,
    NzIconModule,
    NzButtonModule,
    NzStepsModule,
    NzImageModule,
    NgApexchartsModule,
    TranslateModule.forChild(
      {
        defaultLanguage: 'fr',
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
      }
    )
  ]
})
export class PmoModule { }
