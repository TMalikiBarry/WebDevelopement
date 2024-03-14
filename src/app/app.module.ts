import {LOCALE_ID, NgModule, NgZone} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import localeFr from '@angular/common/locales/fr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { fr_FR } from 'ng-zorro-antd/i18n';
import { CommonModule, registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SwiperModule } from 'swiper/angular';
import { HomeComponent } from './public/home/home.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AgmCoreModule } from '@agm/core';
import {AgmMarkerClustererModule} from '@agm/markerclusterer';
import { BeneficiaireModule } from './private/beneficiaire/beneficiaire.module';
import { MensualitePipe } from './private/beneficiaire/pipes/mensualite.pipe';
import { SwitchComponent } from './switch/switch.component';
import {NzCardModule} from "ng-zorro-antd/card";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {FormulaireModule} from "./formulaire/formulaire.module";
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { LoginComponent } from './public/login/login.component';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { httpInterceptorProviders } from './core/interceptors/http-general-interceptor.interceptor';
import { NzPopoverComponent, NzPopoverModule } from 'ng-zorro-antd/popover';
import {NzAlertModule} from "ng-zorro-antd/alert";
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import {AuthGuardService} from "./services/security/auth-guard/auth-guard.service";
import {AuthService} from "./services/security/auth/auth.service";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {MessageService} from "./services/message/message-service.service";
import { httpInterceptorProvidersJwt } from './core/interceptors/jwt-interceptor.interceptor';
import { ResetPasswordComponent } from './public/reset-password/reset-password.component';
import { SetNewPasswordComponent } from './public/set-new-password/set-new-password.component';
import {AgmDirectionModule} from "agm-direction";
import { FooterComponent } from './public/footer/footer.component';
import { Homev2Component } from './public/homev2/homev2.component';
import { AproposComponent } from './public/apropos/apropos.component';
import { ApropossecteurComponent } from './public/apropossecteur/apropossecteur.component';
import { StatCardComponent } from './public/homev2/stat-card/stat-card.component';
import { PartnerCardComponent } from './public/homev2/partner-card/partner-card.component';
import { NzImageModule } from 'ng-zorro-antd/image';
registerLocaleData(fr);


// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SwitchComponent,
    LoginComponent,
    ResetPasswordComponent,
    SetNewPasswordComponent,
    FooterComponent,
    Homev2Component,
    AproposComponent,
    ApropossecteurComponent,
    StatCardComponent,
    PartnerCardComponent,

  ],
    imports: [
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        NzSpinModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NzLayoutModule,
        NzGridModule,
        NzButtonModule,
        NzIconModule,
        NzAlertModule,
        SwiperModule,
        NzFormModule,
        NzSelectModule,
        NzInputModule,
        NzDividerModule,
        NzIconModule,
        AgmCoreModule.forRoot({
            //apiKey:'AIzaSyB0YtWkCilMbyfAfZk1-NA6mI0IHi-kA1k',
            apiKey: 'AIzaSyB0YtWkCilMbyfAfZk1-NA6mI0IHi-kA1k',
            libraries: ['places'],
            language:'fr_FR'
        }),
        AgmDirectionModule,
        BeneficiaireModule,
        NzCardModule,
        NzTabsModule,
        FormulaireModule,
        NzDropDownModule,
        ReactiveFormsModule,
        NgxPageScrollCoreModule,
        // translate Module configuration
        TranslateModule.forRoot(
            {
                defaultLanguage: 'fr',
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient]
                }
            }
        ),
        NzPopoverModule,
        NzToolTipModule,
        ToastrModule.forRoot(),
        AgmDirectionModule,
        AgmMarkerClustererModule,
        NzImageModule

    ],
  providers: [{ provide: NZ_I18N, useValue: fr_FR }, { provide: LOCALE_ID, useValue: "fr-FR" },
                httpInterceptorProviders, httpInterceptorProvidersJwt,
                AuthGuardService,
                AuthService,
                MensualitePipe
             ],
  bootstrap: [AppComponent]
})
export class AppModule { }
