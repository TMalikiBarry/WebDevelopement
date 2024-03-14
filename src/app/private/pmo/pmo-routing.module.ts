import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import {AuthGuardService} from "../../services/security/auth-guard/auth-guard.service";
import {ApercuComponent} from "./apercu/apercu.component";
import {OffresComponent} from "./offres/offres.component";
import {Role} from "../../model/user";
import { IndicateursComponent } from './indicateurs/indicateurs.component';
import { GestionUsersComponent } from './gestion-user/gestion-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfilUserComponent } from './profil-user/profil-user.component';
import { UsersBeneficiaireComponent } from './beneficiaire-users/beneficiaire-users.component';
import { NotificationComponent } from './notification/notification.component';
import { OffresBeneficiaireComponent } from './offers-beneficiaire/offers-beneficiaire.component';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'indicateurs',
    pathMatch: 'full'
  },
  {path:'apercu' , component:ApercuComponent, data: {roles: [Role.SUPERVISEUR_PMO, Role.AGENT_PMO]}, canActivate: [AuthGuardService]},
  {path:'offres' , component:OffresComponent, data: {roles: [Role.SUPERVISEUR_PMO, Role.AGENT_PMO]}, canActivate: [AuthGuardService]},
  {path:'offres-beneficiaire/:idBeneficiaire' , component:OffresBeneficiaireComponent, data: {roles: [Role.SUPERVISEUR_PMO, Role.AGENT_PMO]}, canActivate: [AuthGuardService]},
  {path:'indicateurs' , component:IndicateursComponent, data: {roles: [Role.SUPERVISEUR_PMO, Role.AGENT_PMO]}, canActivate: [AuthGuardService]},
  {path:'users' , component:GestionUsersComponent, data: {roles: [Role.SUPERVISEUR_PMO]}, canActivate: [AuthGuardService]},
  {path:'change_password' , component:ChangePasswordComponent, data: {roles: [Role.SUPERVISEUR_PMO, Role.AGENT_PMO]}, canActivate: [AuthGuardService]},
  {path:'profil' , component:ProfilUserComponent, data: {roles: [Role.SUPERVISEUR_PMO, Role.AGENT_PMO]}, canActivate: [AuthGuardService]},
  {path:'users_beneficiaire' , component:UsersBeneficiaireComponent, data: {roles: [Role.SUPERVISEUR_PMO, Role.AGENT_PMO]}, canActivate: [AuthGuardService]},
  {path: 'notification' , component : NotificationComponent , canActivate: [AuthGuardService],data: {roles:[Role.SUPERVISEUR_PMO, Role.AGENT_PMO]} },
  {
    path: '**',
    redirectTo: 'indicateurs'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PmoRoutingModule { }
