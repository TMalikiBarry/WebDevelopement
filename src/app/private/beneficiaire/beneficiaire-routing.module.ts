import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import {AuthGuardService} from "../../services/security/auth-guard/auth-guard.service";
import { DemandeComponent } from './demandes/demande.component';
import {Role} from "../../model/user";
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ValidateCodeComponent } from './validate-code/validate-code.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  {path:'' , component:LayoutComponent, canActivate: [AuthGuardService], data: {roles: [Role.SUPERVISEUR_BE]} },
  {path:'demande' , component:DemandeComponent, canActivate: [AuthGuardService], data: {roles: [Role.SUPERVISEUR_BE]} },
  {path:'validate_code' , component:ValidateCodeComponent, data: {roles: [Role.SUPERVISEUR_BE]} },
  {path:'change_password' , component:ChangePasswordComponent, canActivate: [AuthGuardService],data: {roles:[Role.SUPERVISEUR_BE]} },
  {path: 'expression-besoin', loadChildren: () => import('./expression-besoin/expression-besoin.module').then(m => m.ExpressionBesoinModule) },
  {path: 'notification' , component : NotificationComponent , canActivate: [AuthGuardService],data: {roles:[Role.SUPERVISEUR_BE]} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficiaireRoutingModule { }
