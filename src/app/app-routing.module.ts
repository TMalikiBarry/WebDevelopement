import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './public/login/login.component';
import {SwitchComponent} from "./switch/switch.component";
import {ResetPasswordComponent} from './public/reset-password/reset-password.component';
import {LayoutComponent} from "./private/pmo/layout/layout.component";
import {SetNewPasswordComponent} from './public/set-new-password/set-new-password.component';
import {Homev2Component} from './public/homev2/homev2.component';
import {AproposComponent} from './public/apropos/apropos.component';
import {TouchComponent} from "./private/touch-point/touch/touch.component";


const routes: Routes = [

  { path: 'formulaire', loadChildren: () => import('./formulaire/formulaire.module').then(m => m.FormulaireModule) },
  {
    path: 'beneficiaire',
    loadChildren: () => import('./private/beneficiaire/beneficiaire.module').then(m => m.BeneficiaireModule)
  },
  {
    path: 'expression-besoin',
    loadChildren: () => import('./expression-besoin/expression-besoin.module').then(m => m.ExpressionBesoinModule)
  },
  { path: '', component: Homev2Component, pathMatch: 'full' },
  { path: 'home', component: Homev2Component },
  { path: 'apropos', component: AproposComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset_password', component: ResetPasswordComponent },
  { path: 'newpassword' , component: SetNewPasswordComponent },
  { path: 'switch',component: SwitchComponent, loadChildren: () => import('./switch/switch.module').then(m => m.SwitchModule) },
  { path: 'pmo',component: LayoutComponent, loadChildren: () => import('./private/pmo/pmo.module').then(m => m.PmoModule) },

  { path: 'touch_point',component: TouchComponent, loadChildren: () => import('./private/touch-point/touch-point.module').then(m => m.TouchPointModule) },
  { path: '**', redirectTo:'', component:Homev2Component },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
