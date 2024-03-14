import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Genre } from 'src/app/model/genre';
import { GenreService } from 'src/app/services/configuration/genre/genre.service';
import { DataService } from 'src/app/services/data_service/data_service';
import { PmoService } from 'src/app/services/pmo/pmo.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profil-user',
  templateUrl: './profil-user.component.html',
  styleUrls: ['./profil-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilUserComponent implements OnInit, OnChanges {

  roles: any[] = [
    {
      libelle: 'Superviseur',
      value: 'superviseur_pmo',

    },
    {
      libelle: 'Agent',
      value: 'agent_pmo',

    },
    {
      libelle: 'Itinérant',
      value: 'itinerant',

    },
  ];

  constructor(private data: DataService,
    private pmoService:PmoService,
    private fb : UntypedFormBuilder,
    private notification : NzNotificationService,
    private genreService: GenreService,
    private changeDetectorRef : ChangeDetectorRef) { }

  //somme offre
  user: any;
  personnePMO: any;
  titres:any;
  baseUrlFile = environment.baseUrlFile;
  genres?: Genre[];
  isSpinning = false;
  dateMaxCreation = new Date();
  dateMaxCreationString = this.dateMaxCreation.getFullYear() + '-' + (this.dateMaxCreation.getMonth()+1)+'-'+(this.dateMaxCreation.getDate()>=10 ? this.dateMaxCreation.getDate() : '0'+this.dateMaxCreation.getDate());

  personneForm = this.fb.group({
    prenom : ['' , [Validators.required,Validators.pattern('[a-zA-Z ]*')]],
    nom : ['' , [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    genre : ['' , Validators.required],
    numeroMobile : ['' , [Validators.required, Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}') ]],
    email : ['' ,  [Validators.required, Validators.pattern('^((?!^[0-9]+$)[a-zA-Z0-9\\._-]+)@[a-zA-Z]+\\.[a-zA-Z]{2,}$')]],
    adressePhysique : ['' , [Validators.required, Validators.pattern('^(?![0-9]*$)[a-zA-Z0-9\\._\\s-\\/]*')]],
    numeroFixe : ['' , [Validators.required, Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}') ]],
    titre : ['' , [Validators.required]],
    dateNaissance : [ '' ,  [Validators.required] ],
    role : [ '' ,  [Validators.required] ]
  }

);

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    //console.log('local user', this.user.personne);
    this.onGetGenre();
    this.onGetTitreInfo();

    this.personnePMO = this.user.personne;
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
      this.personneForm.controls.role.setValue(this.personnePMO.acces?.profil?.code?.toLowerCase());


      this.personneForm.updateValueAndValidity();

  }

  ngOnChanges(changes: SimpleChanges): void {

    // udpate the form


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
    this.personnePMO.role = this.personneForm?.controls.role.value;
    this.personnePMO.dateNaissance = new Date(this.personneForm?.controls.dateNaissance.value).toISOString();

    // //console.log(this.personnePMO);
    // setTimeout(() => {
    //   this.isSpinning = false;
    // }, 2000);
    this.pmoService.update(this.personnePMO).subscribe((response:any) => {
      this.isSpinning = false;
      //console.log(response);
      this.changeDetectorRef.markForCheck();
      this.notification.success('Succès', 'Profil modifié avec succès');
      this.user.personne = this.personnePMO;
      //console.log('new user', this.user);
      // localStorage.removeItem('currentUser');
      localStorage.setItem('currentUser', JSON.stringify(this.user));
      // this.regionEntreprise = response;
      // this.offers = response?.offres;
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

}
