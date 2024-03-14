import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { throws } from 'assert';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
import { Genre } from 'src/app/model/genre';
import { PersonnePMO } from 'src/app/model/personnePMO';
import { GenreService } from 'src/app/services/configuration/genre/genre.service';
import { DataService } from 'src/app/services/data_service/data_service';
import { PmoService } from 'src/app/services/pmo/pmo.service';
import { environment } from 'src/environments/environment';
import { runInThisContext } from 'vm';
import { GestionUsersComponent } from '../gestion-user/gestion-user.component';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModifyUserComponent implements OnInit , OnChanges, OnDestroy {
  subscription: Subscription = new Subscription;
  isSpinning = false;
  showSuccess = false;

  roles: any[] = [
    {
      libelle: 'Superviseur',
      value: 'SUPERVISEUR_PMO',

    },
    {
      libelle: 'Agent',
      value: 'AGENT_PMO',

    },
    {
      libelle: 'Itinérant',
      value: 'AGENT_ITINERANT_PMO',

    },
  ];

  rolesTouch : any[] = [
    {
      libelle: 'Agent Initiateur',
      value: 'AGENT_INITIATEUR',

    },
    {
      libelle: 'Agent Validateur',
      value: 'AGENT_VALIDATEUR',

    },
    {
      libelle: 'Analyste Financier',
      value: 'ANALYSTE_FINANCIER',

    },
  ]


  constructor(private data: DataService,
     private pmoService:PmoService,
     private fb : UntypedFormBuilder,
     private genreService: GenreService,
     private gestionUsersComponent: GestionUsersComponent,
     private notification : NzNotificationService,
     private changeDetectorRef : ChangeDetectorRef   ) { }


  ngOnChanges(changes: SimpleChanges): void {

    // udpate the form


  }

  //somme offre
  personneForm = this.fb.group({
    prenom : ['' , [Validators.required,Validators.pattern('[a-zA-Z ]*')]],
    nom : ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    genre : ['' , Validators.required],
    numeroMobile : ['' , [Validators.required, Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}') ]],
    email : ['' ,  [Validators.required, Validators.pattern('^((?!^[0-9]+$)[a-zA-Z0-9\\._-]+)@[a-zA-Z]+\\.[a-zA-Z]{2,}$')]],
    // adressePhysique : ['' , [Validators.required, Validators.pattern('^(?![0-9]*$)[a-zA-Z0-9\\._\\s-\\/]*')]],
    adressePhysique : ['' , [Validators.required]],
    numeroFixe : ['' , [Validators.required, Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}') ]],
    titre : ['' , [Validators.required]],
    dateNaissance : [ '' ,  [Validators.required] ],
    role : [ '' ,  [Validators.required] ]

  });
  personnePMO: any = {};
  titres:any;
  baseUrlFile = environment.baseUrlFile;
  genres?: Genre[];
  dateMaxCreation = new Date();
  dateMaxCreationString = this.dateMaxCreation.getFullYear() + '-' + (this.dateMaxCreation.getMonth()+1)+'-'+(this.dateMaxCreation.getDate()>=10 ? this.dateMaxCreation.getDate() : '0'+this.dateMaxCreation.getDate());

  ngOnInit(): void {

    this.onGetGenre();
    this.onGetTitreInfo();

    this.subscription=this.data.updatePersonne.subscribe((data: any) => {

      // //console.log('users' , data);
      this.personnePMO = data;
      let dateNaissance = new Date(this.personnePMO.dateNaissance);
      let naissanceMonth = '';
      let naissanceDay = '';
      if(dateNaissance.getMonth()<9){
        naissanceMonth = '0'+(dateNaissance.getMonth()+1);
      }
      else{
        naissanceMonth = (dateNaissance.getMonth()+1)+'';
      }

      if(dateNaissance.getDate()<10){
        naissanceDay = '0'+dateNaissance.getDate();
      }
      else{
        naissanceDay = dateNaissance.getDate()+'';
      }
      let strDateNaissance = dateNaissance.getFullYear() + '-' +naissanceMonth+'-'+naissanceDay;
      //console.log(strDateNaissance);
      let genre = JSON.stringify(this.personnePMO.genre);
      let titre = JSON.stringify(this.personnePMO.titre);

      this.personneForm.controls.prenom.setValue(this.personnePMO.prenom );
      this.personneForm.controls.nom.setValue(this.personnePMO.nom);
      this.personneForm.controls.genre.setValue(genre);
      this.personneForm.controls.numeroMobile.setValue(this.personnePMO.numeroMobile);
      this.personneForm.controls.email.setValue(this.personnePMO.email);
      this.personneForm.controls.adressePhysique.setValue(this.personnePMO.adresse);
      this.personneForm.controls.numeroFixe.setValue(this.personnePMO.numeroFixe);
      this.personneForm.controls.titre.setValue(titre);
      this.personneForm.controls.dateNaissance.setValue(strDateNaissance);
      this.personneForm.controls.role.setValue(this.personnePMO.acces?.profil?.code);


      this.personneForm.updateValueAndValidity();


    });

    // this.personneForm.controls.genre.updateValue(genre);
  }


  updatePersonne(){
    this.isSpinning = true;
    this.personnePMO.prenom = this.personneForm?.controls.prenom.value;
    this.personnePMO.nom = this.personneForm?.controls.nom.value;
    this.personnePMO.numeroMobile = this.personneForm?.controls.numeroMobile.value;
    this.personnePMO.numeroFixe = this.personneForm?.controls.numeroFixe.value;
    this.personnePMO.email = this.personneForm?.controls.email.value;
    this.personnePMO.adresse = this.personneForm?.controls.adressePhysique.value;
    this.personnePMO.titre = JSON.parse(this.personneForm?.controls.titre.value);
    this.personnePMO.genre = JSON.parse(this.personneForm?.controls.genre.value);
    this.personnePMO.acces.profil.code = this.personneForm?.controls.role.value;
    this.personnePMO.dateNaissance = new Date(this.personneForm?.controls.dateNaissance.value).toISOString();

    console.log(this.personnePMO);
    // setTimeout(() => {
    //   this.isSpinning = false;
    // }, 2000);
    this.pmoService.update(this.personnePMO).subscribe((response:any) => {
      this.isSpinning = false;
      console.log(response);
      this.showSuccess = true;
      // this.changeDetectorRef.markForCheck();
      this.data.changeMessagePMO('ok');
      this.changeDetectorRef.markForCheck();
    },
    (error)=>{
      this.isSpinning = false;
      if(error.error.message){
        this.notification.error('Attention', error.error.message);
      }
      else{
        this.notification.error('Erreur', 'Une erreur est survenue, veuillez reesayer plus tard');
      }
      this.changeDetectorRef.markForCheck();
    });
  }



  onGetTitreInfo(){
    this.pmoService.getTitre().subscribe((response:any) => {
      //console.log(response);
      this.titres = response;
      this.changeDetectorRef.markForCheck();
      // this.offers = response?.offres;
    })
  }

  onGetGenre(){
    this.genreService.getAll().subscribe(
      (response) => {
        //console.log('genres' , response)
        this.genres = response;
        this.changeDetectorRef.markForCheck();
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
