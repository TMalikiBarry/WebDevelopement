import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormEntrepriseComponent } from './form-entreprise/form-entreprise.component';
import { FormMicroEntrepreneursComponent } from './form-micro-entrepreneurs/form-micro-entrepreneurs.component';
import {FormGieComponent} from "./form-gie/form-gie.component";
import {FormAnalystePmeGieComponent} from "./form-analyste-pme-gie/form-analyste-pme-gie.component";
import {FormDemandeComponent} from "./form-demande/form-demande.component";



const routes: Routes = [
  {path:"microentreprise" , component:FormMicroEntrepreneursComponent},
  {path:"entreprise", component:FormEntrepriseComponent},
  {path:"gie", component:FormGieComponent},
  {path:"temp-gie-pme", component:FormAnalystePmeGieComponent},
  {path:"demande", component:FormDemandeComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormulaireRoutingModule { }
