import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from "../../model/user";
import { AuthGuardService } from "../../services/security/auth-guard/auth-guard.service";
import { PersonneComponent } from "./personne/personne.component";
import { BeneficiareComponent } from "./beneficiare/beneficiare.component";
import { DemandeComponent } from "./demande/demande.component";
import { TemplateComponent } from "./template/template.component";
import {NotificationComponent} from "./notification/notification.component";
import {GestionUsersComponent} from "./gestion-user/gestion-user.component";




const routes: Routes = [
  { path: '', component: PersonneComponent, data: { roles: [Role.AGENT_INITIATEUR, Role.AGENT_VALIDATEUR, Role.ANALYSTE_FINANCIER,Role.SUPERVISEUR_PMO] }, canActivate: [AuthGuardService] },
  { path: 'personnes', component: PersonneComponent, data: { roles: [Role.AGENT_INITIATEUR, Role.AGENT_VALIDATEUR, Role.ANALYSTE_FINANCIER,Role.SUPERVISEUR_PMO] }, canActivate: [AuthGuardService] },
  { path: 'beneficiaire', component: BeneficiareComponent, data: { roles: [Role.AGENT_INITIATEUR, Role.AGENT_VALIDATEUR, Role.ANALYSTE_FINANCIER,Role.SUPERVISEUR_PMO] }, canActivate: [AuthGuardService] },
  { path: 'demandes', component: DemandeComponent, data: { roles: [Role.AGENT_INITIATEUR, Role.AGENT_VALIDATEUR, Role.ANALYSTE_FINANCIER,Role.SUPERVISEUR_PMO] }, canActivate: [AuthGuardService] },
  { path: 'notifications', component: NotificationComponent, data: { roles: [Role.SUPERVISEUR_PMO] }, canActivate: [AuthGuardService] },
  { path: 'users', component: GestionUsersComponent, data: { roles: [Role.SUPERVISEUR_PMO] }, canActivate: [AuthGuardService] },
  { path: 'template', component: TemplateComponent, data: { roles: [Role.ANALYSTE_FINANCIER,Role.SUPERVISEUR_PMO] }, canActivate: [AuthGuardService] },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TouchPointRoutingModule { }
