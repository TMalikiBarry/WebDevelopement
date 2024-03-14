import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Observable, of} from "rxjs";
import {TemplateAF} from "../../../model/templateAF";
import {Demande} from "../../../model/demande";
import {FormAnalystePmeGieComponent} from "../form-analyste-pme-gie.component";

@Component({
  selector: 'app-identify-entrepreneur',
  templateUrl: './identify-entrepreneur.component.html',
  styleUrls: ['./identify-entrepreneur.component.scss']
})
export class IdentifyEntrepreneurComponent implements OnInit {

  @Input() demande !: Demande;
  @Input() identifyEntrepreneur : any;
  @Output() identifyEntrepreneurChange = new EventEmitter<any>();
  firstCollapseFields: string[] = ['fullName', 'lieuNaissance', 'dateNaissance', 'situationMatrimoniale',
    'nIdentification', 'nbPersonnesCharge', 'adresse', 'statutDomicile', 'habiteDepuis', 'domicileFamilial'];
  entrepreneurForm = this.fb.group({
    fullName : ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
    lieuNaissance: ['', Validators.required],
    dateNaissance: [null, Validators.required],
    situationMatrimoniale: ['celibataire', Validators.required],
    nIdentification: ['', [Validators.required, Validators.pattern('(([12][0-9]{12,13})|([aA][0-9]{8}))')]],
    nbPersonnesCharge: ['', Validators.required],
    adresse: ['', Validators.required],
    statutDomicile: ['proprietaire', Validators.required],
    habiteDepuis: ['', Validators.required],
    domicileFamilial: ['', Validators.required],
    personneReference: ['', Validators.required],
    telPrincipal: ['', Validators.required],
    telSecondaire: [''],
    nomConjoint: [''],
    telConjoint: [''],
    capaciteManag: [''],
    regimeMatrimonial: [''],
    patrimoinePersonnel: [''],
    patrimoineCommun: [''],
  })
  openCollapse: boolean= true;
  openCollapse$: Observable<boolean> = of(true);

  constructor(private fb: UntypedFormBuilder,
              private tp: FormAnalystePmeGieComponent,
              private notifService: NzNotificationService) { }

  ngOnInit(): void {
    if (this.identifyEntrepreneur) {
      console.log(this.identifyEntrepreneur)
      this.entrepreneurForm.patchValue({
          ...this.identifyEntrepreneur
        }
      );
    }

    this.entrepreneurForm.controls.fullName.disable()
    this.entrepreneurForm.controls.lieuNaissance.disable()
    this.entrepreneurForm.controls.nIdentification.disable()
    this.entrepreneurForm.controls.nbPersonnesCharge.disable()
    this.entrepreneurForm.controls.adresse.disable()
    this.entrepreneurForm.controls.telPrincipal.disable()
  }

  showSelected() {
    console.log('VALEUR selected', this.entrepreneurForm.controls['situationMatrimoniale'].value)
  }

  toSecondCollapse(where: 'in'| 'out') {
    if (where === 'out') {
      /*if (this.firstCollapseFields.some( control => this.entrepreneurForm.controls[control].invalid)) {
  this.notifService.error('Attention', "Il y a des champs qui ne sont pas valides",
    {
      nzDuration: 4000,
    });
  return;
}*/
    }

    this.openCollapse$ = of(false);
  }

  validateFirstForm() {
    if (this.entrepreneurForm.invalid) {
      this.notifService.error('Attention', "Il y a des champs qui ne sont pas valides, veuillez revoir votre formulaire",
        {
          nzDuration: 4000,
        });
      return;
    }else {
      this.identifyEntrepreneurChange.emit({
        ...this.entrepreneurForm.getRawValue()
      })
    }
    let template = new TemplateAF();

    template.prenom_nom_conjointe = this.entrepreneurForm.controls.nomConjoint.value
    template.numero_telephone_conjointe = this.entrepreneurForm.controls.telConjoint.value
    template.capacite_manageriale = this.entrepreneurForm.controls.capaciteManag.value
    template.regime_matrimonial = this.entrepreneurForm.controls.regimeMatrimonial.value
    template.patrimoine_personnel = this.entrepreneurForm.controls.patrimoinePersonnel.value
    template.patrimoine_commun = this.entrepreneurForm.controls.patrimoineCommun.value
    template.demande = this.demande

    console.log("template" + JSON.stringify(template))
    this.tp.next();
  }

  toFirstCollapse() {
    this.openCollapse$ = of(true);
  }
}
