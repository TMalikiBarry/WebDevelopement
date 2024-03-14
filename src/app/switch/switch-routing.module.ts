import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormEntrepriseComponent} from "../formulaire/form-entreprise/form-entreprise.component";
import {FormGieComponent} from "../formulaire/form-gie/form-gie.component";
import {FormMicroEntrepreneursComponent} from "../formulaire/form-micro-entrepreneurs/form-micro-entrepreneurs.component";
import {AuthGuardService} from "../services/security/auth-guard/auth-guard.service";
import {Role} from "../model/user";

const routes: Routes = [
  { path: 'inscription/pme', component: FormEntrepriseComponent, canDeactivate: [AuthGuardService], data: {roles: [Role.SUPERVISEUR_BE]}},
  { path: 'edit-pme/:beneficiaire', component: FormEntrepriseComponent, canActivate: [AuthGuardService], data: {roles: [Role.SUPERVISEUR_BE]}},
  { path: 'beneficiaire-pme/:pmo', component: FormEntrepriseComponent, canActivate: [AuthGuardService], data: {roles: [Role.SUPERVISEUR_PMO, Role.AGENT_PMO, Role.AGENT_INITIATEUR]}},
  { path: 'inscription/gie', component: FormGieComponent, canDeactivate: [AuthGuardService], data: {roles: [Role.SUPERVISEUR_BE]}},
  { path: 'edit-gie/:beneficiaire', component: FormGieComponent, canActivate: [AuthGuardService], data: {roles: [Role.SUPERVISEUR_BE]}},
  { path: 'beneficiaire-gie/:pmo', component: FormGieComponent, canActivate: [AuthGuardService], data: {roles: [Role.SUPERVISEUR_PMO, Role.AGENT_PMO, Role.AGENT_INITIATEUR]}},
  { path: 'inscription/me', component: FormMicroEntrepreneursComponent, canDeactivate: [AuthGuardService], data: {roles: [Role.SUPERVISEUR_BE, Role.AGENT_INITIATEUR]}},
  { path: 'edit-me/:beneficiaire', component: FormMicroEntrepreneursComponent, canActivate: [AuthGuardService], data: {roles: [Role.SUPERVISEUR_BE]}},
  { path: 'beneficiaire-me/:pmo', component: FormMicroEntrepreneursComponent, canActivate: [AuthGuardService], data: {roles: [Role.SUPERVISEUR_PMO, Role.AGENT_PMO,Role.AGENT_INITIATEUR]}},
  { path: 'edit-pme/:personne', component: FormEntrepriseComponent, canActivate: [AuthGuardService], data: {roles: [Role.AGENT_INITIATEUR]}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SwitchRoutingModule{ }
