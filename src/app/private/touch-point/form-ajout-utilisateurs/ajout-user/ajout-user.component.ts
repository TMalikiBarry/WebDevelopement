import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { Beneficiaire } from 'src/app/model/beneficiaire';
import { Demande } from 'src/app/model/demande';
import { Genre } from 'src/app/model/genre';
import { InfoSelection } from 'src/app/model/info-selection';
import { Offre } from 'src/app/model/offre';
import { PersonnePMO } from 'src/app/model/personnePMO';
import { ZoneGeographique } from 'src/app/model/zone-geographique';
import { GenreService } from 'src/app/services/configuration/genre/genre.service';
import { DataService } from 'src/app/services/data_service/data_service';
import { PmoService } from 'src/app/services/pmo/pmo.service';
import { environment } from 'src/environments/environment';
import { FormAjoutUserPMOComponent } from '../form-ajout-user.component';

@Component({
  selector: 'app-ajout-user',
  templateUrl: './ajout-user.component.html',
  styleUrls: ['./ajout-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddUserComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription;

  constructor(private data: DataService, private pmoService:PmoService, private fb : UntypedFormBuilder, private formAjoutUserPMOComponent: FormAjoutUserPMOComponent, private genreService: GenreService) { }

  //somme offre
  infoDemande : any;
  demande: any;
  beneficiaire: any;
  typeBeneficiaire: string='';
  contactAgent: any;
  personneContact: any;
  titres:any;
  baseUrlFile = environment.baseUrlFile;
  passwordVisible = false ;
  confirmPasswordVisible = false ;
  genres?: Genre[];
  dateMaxCreation = new Date();
  dateMaxCreationString = this.dateMaxCreation.getFullYear() + '-' + (this.dateMaxCreation.getMonth()+1)+'-'+(this.dateMaxCreation.getDate()>=10 ? this.dateMaxCreation.getDate() : '0'+this.dateMaxCreation.getDate());

  currentStepPosition: number = this.formAjoutUserPMOComponent.currentStepPosition;
  submitted: boolean = false;
  submitted2: boolean = false;
  key1= true;
  key2= false;
  nombreEntree: number = 0;
  // checkFile: boolean = false;

  @Input() personneContactPmo : any ;
  @Output() personneContactPmoChange = new EventEmitter<any>();

  personneForm = this.fb.group({
    prenom : ['' , [Validators.required,Validators.pattern('[a-zA-Z ]*')]],
    nom : ['' , [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    genre : ['' , Validators.required],
    numeroMobile : ['' , [Validators.required, Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}') ]],
    email : ['' ,  [Validators.required, Validators.pattern('^((?!^[0-9]+$)[a-zA-Z0-9\\._-]+)@[a-zA-Z]+\\.[a-zA-Z]{2,}$')]],
    adressePhysique : [''],
    numeroFixe : ['' , [Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}') ]],
    titre : [''],
    dateNaissance : [ '' ]
  }

);

  ngOnInit(): void {
    this.onGetGenre();
    if(this.personneContactPmo){
      this.personneForm.patchValue({
        ...this.personneContactPmo
      })

    }
    this.onGetTitreInfo();
    this.subscription=this.data.currentMessage.subscribe((data: InfoSelection) => {
      console.log(data);
      this.infoDemande = data ;
      this.demande = data.demande || new Demande();
      this.beneficiaire = data.demande?.beneficiaire || new Beneficiaire();
      // if(this.beneficiaire.personnes.length>1){ // A revoir le moyen de recuperer le type contact
      //   this.contactAgent = this.beneficiaire.personnes[1];
      // }
      // else{
      //   this.contactAgent = this.beneficiaire.personnes[0];
      // }
    });

  }

  // savePersonne(){
  //   let personne = new PersonnePMO();
  //   personne.prenom = this.personneForm.controls.prenom.value;
  //   personne.nom = this.personneForm.controls.nom.value;
  //   personne.numeroMobile = this.personneForm.controls.numeroMobile.value;
  //   personne.numeroFixe = this.personneForm.controls.numeroFixe.value;
  //   personne.email = this.personneForm.controls.email.value;
  //   personne.adresse = this.personneForm.controls.adresse.value;
  //   personne.titre = JSON.parse(this.personneForm.controls.titre.value);
  //   personne.role = this.personneForm.controls.role.value;
  //   personne.username = this.personneForm.controls.username.value;
  //   personne.password = this.personneForm.controls.password.value;
  //   // personne. = this.personneForm.controls..value;
  //   this.pmoService.save(personne).subscribe((response:any) => {
  //     console.log(response);
  //     // this.regionEntreprise = response;
  //     // this.offers = response?.offres;
  //   })
  // }

  onGetTitreInfo(){
    this.pmoService.getTitre().subscribe((response:any) => {
      console.log(response);
      this.titres = response;
      // this.offers = response?.offres;
    })
  }

  pre() {
    this.formAjoutUserPMOComponent.pre()
  }

  next() {

    if (this.personneForm.valid){
      this.personneContactPmoChange.emit({...this.personneForm.getRawValue()});

      this.formAjoutUserPMOComponent.next();

    }else {
      // for (let control of this.lotEtape1) {
      //   if (this.personContactForm.controls[control].invalid) {
      //     this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
      //     return;

      //   }

      // }

      this.key1 = false;
      this.key2 = true;
      if (this.nombreEntree !== 0) {

        // for (let control of this.lotEtape2) {
        //   if (this.personContactForm.controls[control].invalid) {
        //     this.submitted2 = true;
        //     this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");

        //     return;
        //   }
        // }
      }
    }
    this.nombreEntree ++;
  }

  done() {
    this.formAjoutUserPMOComponent.done()
  }

  validator() : boolean{

    if(this.personneForm.valid){
      this.personneContactPmo.emit(this.personneForm.getRawValue());
      return true ;
    }

    return false ;
  }

  onGetGenre(){
    this.genreService.getAll().subscribe(
      (response) => {
        this.genres = response;
      }
    );
  }

  convertObject(value: any){
    return JSON.stringify(value)
  }

  convertToString(value: any) {
    return JSON.stringify(value)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
