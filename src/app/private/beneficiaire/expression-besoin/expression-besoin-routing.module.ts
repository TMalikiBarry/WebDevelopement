import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EbMicroEntrepriseComponent} from "./eb-micro-entreprise/eb-micro-entreprise.component";
import {EbEntrepriseComponent} from "./eb-entreprise/eb-entreprise.component";
import {EbGieComponent} from "./eb-gie/eb-gie.component";
import {AuthGuardService} from "../../../services/security/auth-guard/auth-guard.service";
import {Role} from "../../../model/user";


const routes: Routes = [
  {
    path:"microentreprise" ,
    component:EbMicroEntrepriseComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [Role.SUPERVISEUR_BE, Role.SUPERVISEUR_PMO]
    }
    },
  {
    path:"entreprise" ,
    component:EbEntrepriseComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [Role.SUPERVISEUR_BE, Role.SUPERVISEUR_PMO]
    }
    },
  {
    path:"gie" ,
    component:EbGieComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: [Role.SUPERVISEUR_BE, Role.SUPERVISEUR_PMO]
    }
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpressionBesoinRoutingModule { }
