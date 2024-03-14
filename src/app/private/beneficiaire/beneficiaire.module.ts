import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiaireRoutingModule } from './beneficiaire-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { DemandeComponent } from './demandes/demande.component';
import { DescriptionDemandeComponent } from './description-demande/description-demande.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ValidateCodeComponent } from './validate-code/validate-code.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {NzAlertModule} from "ng-zorro-antd/alert";
import { NzCardModule} from "ng-zorro-antd/card";
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCollapseModule} from "ng-zorro-antd/collapse";
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal'
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { SwiperModule } from 'swiper/angular';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NgApexchartsModule } from "ng-apexcharts";
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import {  NzDividerModule } from 'ng-zorro-antd/divider';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { CardOffreComponent } from './card-offre/card-offre.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NotificationComponent } from './notification/notification.component';
import { NotificationCardComponent } from './notification/notification-card/notification-card.component';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';



@NgModule({
  declarations: [
    LayoutComponent,
    DemandeComponent,
    DescriptionDemandeComponent,
    CardOffreComponent,
    ChangePasswordComponent,
    ValidateCodeComponent,
    NotificationComponent,
    NotificationCardComponent
  ],
  imports: [
    CommonModule,
    BeneficiaireRoutingModule,
    FormsModule,
    HttpClientModule,
    NzInputModule,
    NzAlertModule,
    NzCardModule,
    NzSpinModule,
    NzLayoutModule,
    NzPaginationModule,
    // BrowserAnimationsModule,
    NzToolTipModule,
    NzDescriptionsModule,
    NzGridModule,
    NzCollapseModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    SwiperModule,
    NzFormModule,
    NzIconModule,
    NzMenuModule,
    ReactiveFormsModule,
    NzTableModule,
    NgApexchartsModule,
    NzDropDownModule,
    NzBadgeModule,
    NzAvatarModule,
    NzTabsModule,
    NzDividerModule,
    NzStepsModule,
    NzBadgeModule,
    NzCommentModule,
    NzListModule,
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
  ],
  providers: [NzModalService]
})
export class BeneficiaireModule { }
