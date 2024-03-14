import {Component, OnChanges, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {FormAnalysteMeComponent} from "../form-analyste-me.component";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {TypeFinancement} from "../../../model/type-financement";
import {TypeFinancementService} from "../../../services/configuration/type-financement/type-financement.service";
import {Demande} from "../../../model/demande";



@Component({
  selector: 'app-identification',
  templateUrl: './identification.component.html',
  styleUrls: ['./identification.component.scss']
})
export class IdentificationComponent implements OnInit {

  @Input() demande !: Demande;
  @Input() identification: any;
  @Output() identificationChange =  new EventEmitter<any>();

 currentStepPosition: number = this.formAnalysteMeComponent.currentStepPosition;
  typePieces: string='';
  lotEtape1: string[] = ["nom","datelieu","numeroMobile","situation","typepiece","numeroCNI","adressePhysique","reperes"];
  lotEtape2: string[] = ["statutdomicile","referencecontact","nomconjoint","numeroconjoint","departement","localisation"];
  lotEtape3: string[] = ["datecredit","montantcredit","typecredit","remboursement","remboursementavecretard","institution"];
  submitted: boolean = false;
  submitted2: boolean = false;
  submitted3: boolean = false;
  nombreEntree: number = 0;
  nombrecollapes = 3;
  key1 = true;
  key2 = false;
  key3 = false;
  departements: any[] = [];
  @Input() stepname: any;
  typefinancements?: TypeFinancement[];

  listeZoneGographique: any [] = [];
  identificationForm = this.fb.group({
    nom: [''],
    datelieu: [''],
    numeroMobile: ['',[Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}')]],
    situation: [''],
    typepiece: [''],
    numeroCNI: ['',[Validators.pattern('(([12][0-9]{12,13})|([aA][0-9]{8}))')]],
    adressePhysique: [''],
    reperes: [''],
    statutdomicile: [''],
    referencecontact: [''],
    nomconjoint: [''],
    numeroconjoint: ['', [Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}')]],
    departement: [''],
    localisation: [''],
    datecredit: [''],
    montantcredit: ['', [Validators.pattern('[0-9]+')]],
    typecredit: [''],
    remboursement: ['', [Validators.pattern('[0-9]+')]],
    remboursementavecretard  : ['' , [Validators.pattern('[0-9]+')]],
    institution  : ['']

  });
  ValidatorsFront = Validators ;
  dateMaxCreation = new Date();
  dateMaxCreationString = this.dateMaxCreation.getFullYear() + '-' + (this.dateMaxCreation.getMonth() + 1) + '-' + (this.dateMaxCreation.getDate() >= 10 ? this.dateMaxCreation.getDate() : '0' + this.dateMaxCreation.getDate());
  constructor(private fb: UntypedFormBuilder, private formAnalysteMeComponent: FormAnalysteMeComponent,  private notification: NzNotificationService,
              private typefinancementservice: TypeFinancementService) { }

  ngOnInit(): void {

    console.log('identification ' +this.demande)

    if (this.identification) {
      console.log(this.identification)
      this.identificationForm.patchValue({
          ...this.identification
        }
      );
      this.identificationForm.controls.nom.disable()
      this.identificationForm.controls.datelieu.disable()
      this.identificationForm.controls.numeroMobile.disable()
      this.identificationForm.controls.numeroCNI.disable()
      this.identificationForm.controls.adressePhysique.disable()
      this.identificationForm.controls.departement.disable()
      this.identificationForm.controls.montantcredit.disable()
    }
    this.onGetTypeFinancement();
  }


  pre() {

  }

  next() {
    this.submitted = true;
    this.submitted2 = false;
    this.submitted3 = false;
    if (this.identificationForm.valid && (this.nombreEntree === this.nombrecollapes -1)){
      this.identificationChange.emit({...this.identificationForm.getRawValue()});
      //this.formEntrepriseComponent.next();

      this.formAnalysteMeComponent.next();


    }else {
      if (this.nombreEntree === this.nombrecollapes -3) {
        console.log(this.identificationForm)
        for (let control of this.lotEtape1) {
          if (this.identificationForm.controls[control].invalid) {
            this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
            return;

          }

        }
        this.key1 = false;
        this.key2 = true;
        this.key3 = false;
      }
      if (this.nombreEntree === this.nombrecollapes -2) {

        for (let control of this.lotEtape2) {
          if (this.identificationForm.controls[control].invalid) {
            this.submitted2 = true;
            this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");

            return;
          }
        }
        this.key1 = false;
        this.key2 = false;
        this.key3 = true;
      }
      if (this.nombreEntree === this.nombrecollapes -1) {

        for (let control of this.lotEtape3) {
          if (this.identificationForm.controls[control].invalid) {
            this.submitted3 = true;
            this.notification.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");

            return;
          }
        }

      }
    }
    this.nombreEntree ++;
  }

  done() {
this.formAnalysteMeComponent.done()
  }
  onClikTypePieces($event: any){
    console.log("Type de event est :" + typeof $event)
    console.log("type de piece choisi : " + $event)
    this.identificationForm.controls["numeroCNI"].enable();

  }

  convertToString(value: any) {
    return JSON.stringify(value);
  }


  onGetTypeFinancement(){
    this.typefinancementservice.getAll().subscribe((response) =>{
      this.typefinancements = response.filter(item => item.typeBeneficiaires?.indexOf("ME")!== -1);

    });
  }

}
