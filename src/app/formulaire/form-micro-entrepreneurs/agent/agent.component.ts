import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormMicroEntrepreneursComponent} from "../form-micro-entrepreneurs.component";
import {Genre} from "../../../model/genre";
import {GenreService} from "../../../services/configuration/genre/genre.service";
import {NiveauInstructionService} from "../../../services/configuration/niveau-instruction.service";
import {NiveauInstruction} from "../../../model/niveau-instruction";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {TranchePersonneService} from "../../../services/configuration/tranche-personne/tranche-personne.service";
import {TrancheNombrePersonne} from "../../../model/tranche-nombre-personne";
import {TrancheAge} from "../../../model/tranche-age";
import {TrancheAgeService} from "../../../services/configuration/tranche-age/tranche-age.service";
import {FileService} from 'src/app/services/file/file.service';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {IndicatifPaysService} from "../../../services/configuration/indicatif-pays/indicatif-pays.service";
import {environment} from "../../../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import {CheckFileSize} from "../../../core/utils/checker/checkFileSize";

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit, OnChanges {
  currentStepPosition: number = this.formMicroEntrepreneur.currentStepPosition;
  genres?: Genre[];
  niveauInstructions?: NiveauInstruction[];
  niveauInstruction?: NiveauInstruction;
  trancheNombrePersonnes?: TrancheNombrePersonne[];
  ages?: TrancheAge[];
  age?: TrancheAge;

  @Input() agentContact : any ;
  @Output() agentContactChange = new EventEmitter<any>();
  submitted: boolean = false;
  submitted2: boolean = false;
  key1= true;
  key2 = false;
  checkCNIFileSize: boolean = true;
  nombreEntree: number = 0;
  checkFile: boolean = false;

  ValidatorsFront = Validators ;

  // intialize the FormGroup
  agentForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      nom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      genre: ['', Validators.required],
      numeroMobile: ['', [Validators.required, Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}')]],
      email: ['', Validators.pattern('^((?!^[0-9]+$)[a-zA-Z0-9\\._-]+)@[a-zA-Z]+\\.[a-zA-Z]{2,}$')],
      adressePhysique: ['', Validators.required],
      age: ['', Validators.required],
      typePiece: ['', Validators.required],
      numeroCNI: ['', [Validators.required, Validators.pattern('(([12][0-9]{12,13})|([aA][0-9]{8}))')]],
      documentCNI: ['', Validators.required],
      niveauInstruction: ['', Validators.required],
      nombrePersonCharge: [''],
      countryIndicatif: [''],
    }
  );
  lotEtape1: string[] = ["age", "prenom", "nom", "genre", "numeroMobile", "email", "adressePhysique"];
  lotEtape2: string[] = ["typePiece", "numeroCNI", "documentCNI", "niveauInstruction"];
  documentCNINom: any;
  countries: any | null = null;
  baseUrlFile = environment.baseUrlFile;
  beneficiaireId: any;

  constructor(private formMicroEntrepreneur: FormMicroEntrepreneursComponent,
              private genreService: GenreService,
              private niveauInstructionService: NiveauInstructionService,
              private fb: UntypedFormBuilder,
              private changeDetector: ChangeDetectorRef,
              private tranchePersonneService: TranchePersonneService,
              private trancheAgeService: TrancheAgeService,
              private fileService: FileService,
              private checkFileSize: CheckFileSize,
              private notification: NzNotificationService,
              private countriesService: IndicatifPaysService,
              private activatedRoute: ActivatedRoute
  ) {
    this.beneficiaireId = activatedRoute.snapshot.params.beneficiaire
  }

  ngOnInit(): void {

    this.onGetGenre();
    this.onGetNiveauInstruction();
    this.onGetTrancheNombrePersonne();
    this.onGetTrancheAge();
    this.OnGetCountries();

    if(this.agentContact){
      this.agentForm.patchValue({
        ...this.agentContact
      })
      this.documentCNINom= this.agentContact.documentCNINom ;
    }



    // first condition is for subscription
    // second condition for update
    if( (localStorage.getItem("radioValue") &&  localStorage.getItem("radioValue") =="non")
        ||
        (this.agentContact && this.agentContact.personAgentSame && this.agentContact.personAgentSame == false ) ){

      console.log('Obligatoire Agent' , localStorage.getItem('radioValue'));

      this.agentForm.controls.prenom.addValidators(Validators.required);
      this.agentForm.controls.prenom.updateValueAndValidity();

      this.agentForm.controls.nom.addValidators(Validators.required);
      this.agentForm.controls.nom.updateValueAndValidity();

      this.agentForm.controls.genre.addValidators(Validators.required);
      this.agentForm.controls.genre.updateValueAndValidity();

      this.agentForm.controls.numeroMobile.addValidators(Validators.required);
      this.agentForm.controls.numeroMobile.updateValueAndValidity();

     // this.agentForm.controls.email.addValidators(Validators.required);
      this.agentForm.controls.adressePhysique.addValidators(Validators.required);
      this.agentForm.controls.adressePhysique.updateValueAndValidity();

      this.agentForm.controls.age.addValidators(Validators.required);
      this.agentForm.controls.age.updateValueAndValidity();

      this.agentForm.controls.numeroCNI.addValidators(Validators.required);
      this.agentForm.controls.numeroCNI.updateValueAndValidity();

      this.agentForm.controls.niveauInstruction.addValidators(Validators.required);
      this.agentForm.controls.niveauInstruction.updateValueAndValidity();

  /*    this.agentForm.controls.nombrePersonCharge.addValidators(Validators.required);
      this.agentForm.controls.nombrePersonCharge.updateValueAndValidity();*/

      this.agentForm.controls.documentCNI.addValidators(Validators.required);
      this.agentForm.controls.documentCNI.updateValueAndValidity();

      this.agentForm.updateValueAndValidity();

      console.log('agent form after update ' , this.agentForm);
    }

    this.agentForm.controls["numeroCNI"].disable();
    this.checkCNIFileSize = true;

  }

  onClikTypePieces($event: any){
    console.log("type de piece choisi : " + $event)
    this.agentForm.controls["numeroCNI"].enable();


  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.agentContact)
    if(this.agentContact){

      this.agentForm.patchValue({
        ...this.agentContact
      });
      console.log(this.agentContact.documentCNINom)
      this.documentCNINom = this.agentContact.documentCNINom;
    }
  }

  pre() {
    this.formMicroEntrepreneur.pre()
  }

  next() {
    this.submitted = true;
    this.submitted2 = false;
    if (this.agentForm.valid && this.nombreEntree !==0){
      this.agentContactChange.emit({   documentCNINom: this.documentCNINom,
        ...this.agentForm.getRawValue()});

      this.formMicroEntrepreneur.next();

    }else {
      for (let control of this.lotEtape1) {
        if (this.agentForm.controls[control].invalid) {
          this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
          return;

        }

      }
      this.key1 = false;
      this.key2 = true;
      if (this.nombreEntree !== 0) {

        for (let control of this.lotEtape2) {
          if (this.agentForm.controls[control].invalid) {
            this.submitted2 = true;
            this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement ");

            return;
          }
        }
      }


    }
    this.nombreEntree ++;
  }
  documentCniLoad(event:any){

    let tableau: string[] = ['\'image/jpeg\'','pdf','png','jpg'];
    this.checkFile = false;
    if(this.checkTypeFile(tableau,event.target.files[0].name.split('.').pop())) {
      // check if file exist
      if(event.target.files && event.target.files.length) {
        const [file] = event.target.files;

        this.checkCNIFileSize = this.checkFileSize.checkSize(file.size, 'notSelfie');
        if (this.checkCNIFileSize) {
          const formData = new FormData();
          formData.append('file', file);

          this.fileService.save(formData, 'CNI').subscribe(
            response => {
              //console.log(response);
              this.documentCNINom = response.reponse;
              this.agentForm.patchValue({
                documentCNI: this.documentCNINom
              })
            }
            ,
            () => {
              //console.log(error);
            }
          );
        } else {
          console.log("Fichier trop lourd !!!!!");
          this.agentForm.controls.documentCNI.setValue('');
        }


      } this.checkFile = false;
    }else{
      this.checkFile = true;
      this.agentForm.controls.documentCNI.setValue('');
    }
  }

  validator() : boolean{

    if(this.agentForm.valid){
      this.agentContactChange.emit(this.agentForm.getRawValue());
      return true ;
    }

    return false ;
  }

  done() {
    this.formMicroEntrepreneur.done()
  }

  onGetGenre(){
    this.genreService.getAll().subscribe(
      (response) => {
        this.genres = response;
      }
    );
  }

  onGetNiveauInstruction() {
    this.niveauInstructionService.getAll().subscribe((response) => {
      this.niveauInstructions = response;
    })
  }

  onGetTrancheNombrePersonne() {
    this.tranchePersonneService.getAll().subscribe((response) =>{
      this.trancheNombrePersonnes = response;
    })
  }

  convertObject(value: any){
    return JSON.stringify(value)
  }

  onGetTrancheAge(){
    this.trancheAgeService.getAll().subscribe((response) =>{
      this.ages = response;
    })
  }
  checkTypeFile(tableau: string[],extension: string ){
    return tableau?.indexOf(extension) !== -1;
  }

  OnGetCountries(){
    this.countriesService.getCountries().subscribe((response) =>{
      this.countries = response.countryPrefix;
    })
  }
}
