import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ConnexionComponent} from "./connexion/connexion.component";
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {PersonnePMO} from 'src/app/model/personnePMO';
import {PmoService} from 'src/app/services/pmo/pmo.service';
import {AddUserComponent} from './ajout-user/ajout-user.component';
import {DataService} from 'src/app/services/data_service/data_service';
import {StorageService} from "../../../services/Storage/storage.service";

@Component({
  selector: 'app-form-ajout-user',
  templateUrl: './form-ajout-user.component.html',
  styleUrls: ['./form-ajout-user.component.scss']
})
export class FormAjoutUserPMOComponent implements OnInit {

  apiResponse : any;

  @ViewChild(AddUserComponent) addUserComponent! : AddUserComponent;

  @ViewChild(ConnexionComponent) connexionComponent! : ConnexionComponent;

  // set info persone received
  personnePmo : any ;
  user:any;
  // step info for register
  connexionInfo : any ;
  stepname: string =  '';
  showModel:boolean  = false;
  isSpinning: boolean = false;

  constructor(private router: Router, private pmoService: PmoService, private data: DataService, private notification: NzNotificationService, private storage: StorageService) {
  }

  currentStepPosition : number = 0 ;

  numeroTelephone : any ;


  ngOnInit(): void {
    this.user = JSON.parse(this.storage.getItem('currentUser') || '{}');
      //console.log('local user', this.user);
  }

  pre(){
    if (this.currentStepPosition == 2 && this.personnePmo.radioValue == 'oui'){
      this.currentStepPosition -= 2;
      return;
    }
    this.currentStepPosition-= 1 ;
  }

  next(){
    // this.showModel  = false;
    switch (this.currentStepPosition) {
      case 0: console.log(this.personnePmo); break;
      case 1: console.log(this.connexionInfo);

      // //console.log(this.personnePmo);
      if(!this.personnePmo){
        // //console.log('here');
        this.stepname = "la personne";
        this.showModel = true;
        return;
      }

      this.sendMeInfo();
      return;
    }

    this.currentStepPosition+= 1 ;
  }

  done(){
    this.router.navigateByUrl('/beneficiaire')
  }

  sendMeInfo() {
    // this.isSpinning = true;
    let personne = new PersonnePMO();
    personne.pmoID = this.user.idParent;
    personne.prenom = this.personnePmo.prenom;
    personne.nom = this.personnePmo.nom;
    personne.numeroMobile = this.personnePmo.numeroMobile;
    personne.numeroFixe = this.personnePmo.numeroFixe;
    personne.email = this.personnePmo.email;
    personne.adresse = this.personnePmo.adressePhysique;
    if(this.personnePmo.titre)
      personne.titre = JSON.parse(this.personnePmo.titre);
    personne.role = this.connexionInfo.role;
    personne.username = this.connexionInfo.username;
    personne.password = this.connexionInfo.password;
    personne.genre = JSON.parse(this.personnePmo.genre);
      if(this.personnePmo.dateNaissance)
    personne.dateNaissance = new Date(this.personnePmo.dateNaissance).toISOString();
    this.pmoService.savePMO(personne).subscribe((response:any) => {
      this.isSpinning = false;
      //console.log(response);
      this.apiResponse = response ;
      // this.notification.error('Attention','Ok');
      this.data.changeMessagePMO('ok');
      // this.regionEntreprise = response;
      // this.offers = response?.offres;
    },
    (error:any)=>{
      //console.log(error);
      this.isSpinning = false;
      this.apiResponse = error ;
      if(error.error.message){
        this.notification.error('Attention', error.error.message);
      }
      else{
        this.notification.error('Erreur', 'Une erreur est survenue, veuillez reesayer plus tard');
      }
      // this.data.changeMessagePMO(JSON.stringify(error));
    })

  }

  nextWithoutAgent() {

    switch (this.currentStepPosition){
      case 0: //console.log(this.personnePmo); break;
      case 1: //console.log(this.connexionInfo);
        this.sendMeInfo();
        return;
    }

    this.currentStepPosition+= 2 ;
  }
  onIndexChange(index: number): void {
    this.currentStepPosition = index;
  }

}
