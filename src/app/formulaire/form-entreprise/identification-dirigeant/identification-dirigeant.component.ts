import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {FormEntrepriseComponent} from "../form-entreprise.component";
import {GenreService} from "../../../services/configuration/genre/genre.service";
import {Genre} from "../../../model/genre";
import {NiveauInstructionService} from "../../../services/configuration/niveau-instruction.service";
import {NiveauInstruction} from "../../../model/niveau-instruction";
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {TrancheAge} from "../../../model/tranche-age";
import {TrancheAgeService} from "../../../services/configuration/tranche-age/tranche-age.service";
import {TrancheNombrePersonne} from "../../../model/tranche-nombre-personne";
import {TranchePersonneService} from "../../../services/configuration/tranche-personne/tranche-personne.service";
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {TitreService} from "../../../services/configuration/titre/titre.service";
import {Titre} from "../../../model/titre";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-identification-dirigeant',
  templateUrl: './identification-dirigeant.component.html',
  styleUrls: ['./identification-dirigeant.component.scss']
})
export class IdentificationDirigeantComponent implements OnInit {
  currentStepPosition: number = this.formEntrepriseComponent.currentStepPosition;
  genre?: Genre;
  genres?: Genre[];
  niveauInstructions?: NiveauInstruction[];
  niveauInstruction?: NiveauInstruction;
  ages?: TrancheAge[];
  age?: TrancheAge;
  trancheNombrePersonnes?: TrancheNombrePersonne[];
  currentIdAssocie = 0;
  currentIdDirigeant = 0;
  submitted: boolean = false;
  submitted2: boolean = false;
  key1 = true;
  key2 = false;
  nombreEntree: number = 0;
  nombrecollapses = 2;
  radioValue: string = 'oui';
  show: boolean = false;

  @Input() dirigeantsAssocies: any;
  @Output() dirigeantsAssociesChange = new EventEmitter<any>();

  dirigeantValidity = false;

  associeValidity = false;


  // list dirigeatns
  listeDirigeants: any[] = [];

  // list Associe
  listeAssocie: any[] = [];

  // intialize the FormGroup dirigeant
  dirigeantForm = this.fb.group({
    prenom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    nom: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    genre: ['', Validators.required],
    age: ['', Validators.required],
    numeroCNIPasseport: ['', [Validators.required, Validators.pattern('(([12][0-9]{12,})|([0-9a-zA-Z]{9,}))')]],
    titre: ['', Validators.required],
    niveauInstruction: ['', Validators.required],
    nombrePersonneACharge: ['', Validators.required],
    pourcentageDetenueCapital: ['', [Validators.required, Validators.max(100), Validators.pattern('[0-9]*.[0-9]*')]],
  });

  // intialize the FormGroup dirigeant
  associeForm = this.fb.group({
    prenom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    nom: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    genre_associe: ['', Validators.required],
    age_associe: ['', Validators.required],
    numeroCNI: ['', [Validators.required, Validators.pattern('(([12][0-9]{12,})|([0-9a-zA-Z]{9,}))')]],
    pourcentageDetention: ['', [Validators.required, Validators.pattern('[0-9]*.[0-9]*')]]
  });
  titres?: Titre[];
  beneficiaireId: any;
  est_dirigeant: boolean = false;

  constructor(private formEntrepriseComponent: FormEntrepriseComponent,
              private fb: UntypedFormBuilder,
              private genreService: GenreService,
              private niveauInstructionService: NiveauInstructionService,
              private trancheAgeService: TrancheAgeService,
              private tranchePersonneService: TranchePersonneService,
              private notificationService: NzNotificationService,
              private titreService: TitreService,
              private changeDetector: ChangeDetectorRef,
              private activatedRoute: ActivatedRoute) {
    this.beneficiaireId = this.activatedRoute.snapshot.params.beneficiaire
  }

  ngOnInit(): void {
    this.onGetAllTitre()
    this.onGetGenre()
    this.onGetNiveauInstruction()
    this.onGetTrancheNombrePersonne()
    this.onGetTrancheAge()
    if (this.dirigeantsAssocies) {

      if (this.dirigeantsAssocies) {
        for (let i = 0; i < this.dirigeantsAssocies.dirigeants.length; i++) {
          const dirigeant = this.dirigeantsAssocies.dirigeants[i];
          let obj = {
            id: dirigeant.id,
            prenom: dirigeant.prenom,
            nom: dirigeant.nom,
            genre: dirigeant.genre,
            age: dirigeant.age,
            numeroCNIPasseport: dirigeant.numeroCNI,
            titre: dirigeant.titre,
            niveauInstruction: dirigeant.niveauInstruction,
            nombrePersonneACharge: dirigeant.nombrePersonneACharge
          };

          this.listeDirigeants.push(obj);
        }

        for (let i = 0; i < this.dirigeantsAssocies?.associes.length; i++) {
          const associe = this.dirigeantsAssocies?.associes[i];
          let obj = {
            id: associe.id,
            prenom: associe.prenom,
            nom: associe.nom,
            genre_associe: associe.genre,
            age_associe: associe.age,
            numeroCNI: associe.numeroCNI,
            pourcentageDetention: associe.pourcentageDetenueCapital
          };

          this.listeAssocie.push(obj);
        }
        console.log(this.listeDirigeants)
        console.log(this.listeAssocie)
      }

      if (this.listeAssocie.length == 0) {
        this.radioValue = 'oui';
      } else {
        this.radioValue = 'non';
      }
      this.choose(this.radioValue);

    }
  }

  pre() {
    this.formEntrepriseComponent.pre();
  }


  next() {
    this.submitted2 = false;
    this.dirigeantValidity = this.listeDirigeants.length != 0;

    if (this.radioValue == 'non') {
      this.associeValidity = this.listeAssocie.length != 0;
    } else {
      this.associeValidity = true;
    }
    if (this.dirigeantValidity && this.associeValidity) {
      this.dirigeantsAssociesChange.emit({dirigeants: this.listeDirigeants, associes: this.listeAssocie});
      localStorage.setItem('RadioValueDirigeant', this.radioValue);
      this.formEntrepriseComponent.next();
    } else {
      if (!this.dirigeantValidity && !this.associeValidity) {
        this.notificationService.error("Attention", "Merci de remplir au moins un(e) dirigeant(e), un(e) associé(e) et de valider ");

        return;
      }
      if (this.nombreEntree === this.nombrecollapses - 2) {

        if (!this.dirigeantValidity) {
          this.submitted = true;
          this.notificationService.error("Attention", "Merci de remplir au moins  un(e) dirigeant(e) et de valider ");
          return;
        }

      }
      this.key1 = false;
      this.key2 = true;
      if (this.nombreEntree === this.nombrecollapses - 1) {

        if (!this.associeValidity) {
          this.submitted2 = true;
          this.notificationService.error("Attention", "Merci de remplir au moins un(e) associé(e) et de valider ");
          return;
        }
      }
    }
    this.nombreEntree++;
  }

  done() {
    this.formEntrepriseComponent.done()
  }

  convertToString(value: any) {
    return JSON.stringify(value);
  }

  ajouterAssocie() {
    this.submitted2 = true;
    ////console.log(this.associeForm)
    if (this.associeForm.controls.prenom.invalid || this.associeForm.controls.nom.invalid
      || this.associeForm.controls.genre_associe.invalid || this.associeForm.controls.age_associe.invalid
      || this.associeForm.controls.numeroCNI.invalid || this.associeForm.controls.pourcentageDetention.invalid) {
      this.notificationService.error('Attention', " Veuillez vérifier si tous les champs obligatoires d'ajout d'associé sont remplis ");
    }
    if (this.associeForm.valid) {
      this.submitted2 = true;
      this.associeValidity = true;
      this.listeAssocie.push({id: this.currentIdAssocie, ...this.associeForm.getRawValue()});
      this.currentIdAssocie++;
      console.log(this.listeAssocie)
      this.notificationService.success('Succés', 'Vous avez bien ajouté l\'Associé ' + this.associeForm.controls.prenom.value + ' ' + this.associeForm.controls.nom.value);
      this.associeForm.reset();
      this.submitted2 = false;
    }
  }

  modifierAsscoie(id: number) {
    let associe = this.listeAssocie.find(s => s.id == id);
    console.log(associe);
    if (this.beneficiaireId === undefined) {
      this.associeForm.patchValue(
        {
          prenom: associe.prenom,
          nom: associe.nom,
          genre_associe: associe.genre_associe,
          age: associe.age_associe,
          numeroCNI: associe.numeroCNI,
          pourcentageDetention: associe.pourcentageDetention
        }
      );
    } else {

      try {
        associe.genre_associe = JSON.parse(associe.genre_associe);
        associe.age_associe = JSON.parse(associe.age_associe);
      } catch (error) {
        // console.log('error parsing', error);
      }
      console.log(associe);
      this.associeForm.patchValue(
        {
          prenom: associe.prenom,
          nom: associe.nom,
          genre_associe: JSON.stringify(associe.genre_associe),
          age_associe: JSON.stringify(associe.age_associe),
          numeroCNI: associe.numeroCNI,
          pourcentageDetention: associe.pourcentageDetention
        }
      );
      this.associeForm.updateValueAndValidity();

      this.changeDetector.markForCheck();
    }
    this.listeAssocie = this.listeAssocie.filter(s => s.id !== id)
    this.currentIdAssocie--;
  }

  ajouterDirigeant() {
    ////console.log(this.dirigeantForm)
    this.submitted = true;
    if (this.dirigeantForm.controls.prenom.invalid || this.dirigeantForm.controls.nom.invalid
      || this.dirigeantForm.controls.genre.invalid || this.dirigeantForm.controls.age.invalid
      || this.dirigeantForm.controls.numeroCNIPasseport.invalid || this.dirigeantForm.controls.titre.invalid
      || this.dirigeantForm.controls.niveauInstruction.invalid || this.dirigeantForm.controls.nombrePersonneACharge.invalid
      || this.dirigeantForm.controls.pourcentageDetenueCapital.invalid) {
      this.notificationService.error('Attention', " Veuillez vérifier si tous les champs obligatoires d'ajout de dirigeant sont remplis ");
    }
    if (this.dirigeantForm.valid) {
      this.dirigeantValidity = true;
      this.listeDirigeants.push({id: this.currentIdDirigeant, ...this.dirigeantForm.getRawValue()});
      this.currentIdDirigeant++
      // console.log(this.listeDirigeants);
      this.currentIdDirigeant++;
      this.notificationService.success('Succés', 'Vous avez bien ajouté le Dirigeant ' + this.dirigeantForm.controls.prenom.value + ' ' + this.dirigeantForm.controls.nom.value);
      this.dirigeantForm.reset();
      this.submitted = false;
    }
  }


  modifierDirigeant(id: number) {
    let dirigeant = this.listeDirigeants.find(s => s.id == id);
    console.log(dirigeant)
    this.listeDirigeants = this.listeDirigeants.filter(s => s.id !== id)
    this.currentIdDirigeant--;
    if (this.beneficiaireId == undefined) {
      this.dirigeantForm.patchValue(
        {
          prenom: dirigeant.prenom,
          nom: dirigeant.nom,
          genre: dirigeant.genre,
          age: dirigeant.age,
          numeroCNIPasseport: dirigeant.numeroCNIPasseport,
          titre: dirigeant.titre,
          niveauInstruction: dirigeant.niveauInstruction,
          nombrePersonneACharge: dirigeant.nombrePersonneACharge,
          pourcentageDetenueCapital: dirigeant.pourcentageDetenueCapital
        }
      );
    } else {

      try {
        dirigeant.genre = JSON.parse(dirigeant.genre);
        dirigeant.age = JSON.parse(dirigeant.age);
        dirigeant.titre = JSON.parse(dirigeant.titre);
        dirigeant.niveauInstruction = JSON.parse(dirigeant.niveauInstruction);
        dirigeant.nombrePersonneACharge = JSON.parse(dirigeant.nombrePersonneACharge);
      } catch (error) {
        // console.log('error parsing', error);
      }

      this.dirigeantForm.patchValue(
        {
          prenom: dirigeant.prenom,
          nom: dirigeant.nom,
          genre: JSON.stringify(dirigeant.genre),
          age: JSON.stringify(dirigeant.age),
          numeroCNIPasseport: dirigeant.numeroCNIPasseport,
          titre: JSON.stringify(dirigeant.titre),
          niveauInstruction: JSON.stringify(dirigeant.niveauInstruction),
          nombrePersonneACharge: JSON.stringify(dirigeant.nombrePersonneACharge)
        }
      );

      this.dirigeantForm.updateValueAndValidity();

      this.changeDetector.markForCheck();
    }
  }

  confirmSuppressionDirigeant(id: number) {
    this.listeDirigeants = this.listeDirigeants.filter(
      s => {
        return s.id !== id;
      }
    );
  }

  confirmSuppressionAssocie(id: number) {
    this.listeAssocie = this.listeAssocie.filter(
      s => {
        return s.id !== id;
      }
    );
  }

  onGetGenre() {
    this.genreService.getAll().subscribe(
      (response) => {
        this.genres = response;
        this.changeDetector.markForCheck()
      }
    );
  }

  onGetNiveauInstruction() {
    this.niveauInstructionService.getAll().subscribe(
      (response) => {
        this.niveauInstructions = response;
        this.changeDetector.markForCheck()
      }
    );
  }

  onGetTrancheAge() {
    this.trancheAgeService.getAll().subscribe((response) => {
      this.ages = response;
      this.changeDetector.markForCheck()
    })
  }

  onGetTrancheNombrePersonne() {
    this.tranchePersonneService.getAll().subscribe((response) => {
      this.trancheNombrePersonnes = response;
      this.changeDetector.markForCheck()
    })
  }

  onGetAllTitre() {
    this.titreService.getAll().subscribe(response => {
      this.titres = response;
      this.changeDetector.markForCheck()
    })
  }

  choose($event: any) {
    if ($event === 'oui') {
      this.associeForm.controls.prenom.clearValidators();
      this.associeForm.controls.prenom.updateValueAndValidity();
      this.associeForm.controls.nom.clearValidators();
      this.associeForm.controls.nom.updateValueAndValidity();
      this.associeForm.controls.age_associe.clearValidators();
      this.associeForm.controls.age_associe.updateValueAndValidity();
      this.associeForm.controls.numeroCNI.clearValidators();
      this.associeForm.controls.numeroCNI.updateValueAndValidity();
      this.associeForm.controls.pourcentageDetention.clearValidators();
      this.associeForm.controls.pourcentageDetention.updateValueAndValidity();
      this.dirigeantForm.controls.pourcentageDetenueCapital.addValidators(Validators.required);
      this.dirigeantForm.controls.pourcentageDetenueCapital.updateValueAndValidity();
      this.show = false;

    } else {
      this.associeForm.controls.prenom.addValidators([Validators.required, Validators.pattern('[a-zA-Z ]*')]);
      this.associeForm.controls.prenom.updateValueAndValidity();
      this.associeForm.controls.nom.addValidators([Validators.required, Validators.pattern('[a-zA-Z]*')]);
      this.associeForm.controls.nom.updateValueAndValidity();

      this.associeForm.controls.age_associe.addValidators(Validators.required);
      this.associeForm.controls.age_associe.updateValueAndValidity();
      this.associeForm.controls.genre_associe.addValidators(Validators.required);
      this.associeForm.controls.genre_associe.updateValueAndValidity();
      this.associeForm.controls.numeroCNI.addValidators([Validators.required, Validators.pattern('(([12][0-9]{12,})|([0-9a-zA-Z]{9,}))')]);
      this.associeForm.controls.numeroCNI.updateValueAndValidity();
      this.associeForm.controls.pourcentageDetention.addValidators([Validators.required, Validators.pattern('[0-9]*')]);
      this.associeForm.controls.pourcentageDetention.updateValueAndValidity();
      this.dirigeantForm.controls.pourcentageDetenueCapital.clearValidators();
      this.dirigeantForm.controls.pourcentageDetenueCapital.updateValueAndValidity();
      this.show = true;
    }
  }

  controlLabel() {
    return this.radioValue == 'non';
  }

  chargerDirigeant($event: any) {
    if ($event === true) {
      const per: any | null = JSON.parse(localStorage.getItem('personContact') || '{}')
      this.dirigeantForm.controls.prenom.setValue(per.prenom)
      this.dirigeantForm.controls.nom.setValue(per.nom)
      this.dirigeantForm.controls.numeroCNIPasseport.setValue(per.numeroCNI)
      this.dirigeantForm.controls.prenom.disable()
      this.dirigeantForm.controls.nom.disable()
      this.dirigeantForm.controls.numeroCNIPasseport.disable()
    } else {
      this.dirigeantForm.controls.prenom.setValue('')
      this.dirigeantForm.controls.nom.setValue('')
      this.dirigeantForm.controls.numeroCNIPasseport.setValue('')
      this.dirigeantForm.controls.prenom.enable()
      this.dirigeantForm.controls.nom.enable()
      this.dirigeantForm.controls.numeroCNIPasseport.enable()
    }
  }
}
