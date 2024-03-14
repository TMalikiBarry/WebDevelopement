import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EbMicroEntrepriseComponent} from "./eb-micro-entreprise/eb-micro-entreprise.component";
import {EbEntrepriseComponent} from "./eb-entreprise/eb-entreprise.component";
import {EbGieComponent} from "./eb-gie/eb-gie.component";
import {AuthGuardService} from "../services/security/auth-guard/auth-guard.service";
import { Role } from '../model/user';


const routes: Routes = [
  {path: "microentreprise" , component:EbMicroEntrepriseComponent},
  {path: 'expression-me/:pmo/:idBenef', component: EbMicroEntrepriseComponent, canActivate: [AuthGuardService], data: {roles: [Role.SUPERVISEUR_PMO, Role.AGENT_PMO, Role.AGENT_INITIATEUR]}},
  {path: "entreprise" , component:EbEntrepriseComponent},
  {path: 'expression-pme/:pmo/:idBenef', component: EbEntrepriseComponent, canActivate: [AuthGuardService], data: {roles: [Role.SUPERVISEUR_PMO, Role.AGENT_PMO]}},
  {path: "gie" , component:EbGieComponent},
  {path: 'expression-gie/:pmo/:idBenef', component: EbGieComponent, canActivate: [AuthGuardService], data: {roles: [Role.SUPERVISEUR_PMO, Role.AGENT_PMO]}}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpressionBesoinRoutingModule { }
