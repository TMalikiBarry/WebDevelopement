import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EbGieComponent} from "../eb-gie.component";
import {TypeFinancementService} from "../../../../../services/configuration/type-financement/type-financement.service";
import {GarantieService} from "../../../../../services/configuration/garanties/garantie.service";
import {TypeFinancement} from "../../../../../model/type-financement";
import {Garantie} from "../../../../../model/garantie";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {maxValidator, minValidator, pasteDateValidator} from "../../../../../core/customValidators/past-date-validator";
import {FileService} from "../../../../../services/file/file.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {CurrencyPipe} from "@angular/common";
import {DataService} from 'src/app/services/data_service/data_service';
import {Subscription} from 'rxjs';
import {environment} from 'src/environments/environment';
import {CheckFileSize} from "../../../../../core/utils/checker/checkFileSize";

@Component({
  selector: 'app-demande-financement-gie',
  templateUrl: './demande-financement-gie.component.html',
  styleUrls: ['./demande-financement-gie.component.scss']
})
export class DemandeFinancementGieComponent implements OnInit {
  date: any;
  @Input() financementInfo: any;
  @Input() demande: any;
  financementTemp: any;
  @Output() financementInfoChange = new EventEmitter<any>();
  @Input() showSucces : boolean = false;
  @Input() demandeFin : boolean = true;
  listeFinancement : any[] = [];
  financementValidity = false ;
  submitted: boolean = false;
  checkFinFileSize: boolean = true;
  baseUrlFile = environment.baseUrlFile;
  submitted2: boolean = false;
  submitted3: boolean = false;
  radioValue: string='non' ;
  isRequired: boolean = false;
  tableauFinancementNom: any;
  listefinancements : any[] = [];
  currentIdFinancement = 0;
  show: boolean = false;
  duree: number = 0;
  key1= true;
  subscription: Subscription = new Subscription;
  key2= false;
  key3 = false;
  nombreEntree: number = 0;
  libelleDuree: string = 'Durée souhaitée en nombre de mois';
  // libelleMontant: string = 'Montant demandé en Francs CFA';
  libelleMontant: string = 'Montant demandé en Francs CFA [Minimum: 500 000 - Maximum: 50 000 000]';
  nombrecollapse: number = 3;
  @Input() stepname: any;
  @Input() showModel: any;
  checkFile: boolean = false;
  dateMaxCreation = new Date();
  dateMaxCreationString = this.dateMaxCreation.getFullYear() + '-' + (this.dateMaxCreation.getMonth() + 1) + '-' + (this.dateMaxCreation.getDate() >= 10 ? this.dateMaxCreation.getDate() : '0' + this.dateMaxCreation.getDate());
  demandeFinancementForm1 = this.fb.group({
    typefinancement: ['', Validators.required],
    montantdemande: ['', [Validators.required, Validators.pattern('^[0-9\\s]*$'), minValidator("500 000"), maxValidator("50 000 000")]],
    nombreMembresConcernes: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    montantDemandeParMembre: ['', Validators.pattern('[0-9]+')],
    coutProjet: ['', [Validators.required, Validators.pattern('^[0-9\\s]*$'), minValidator("3000")]],
    //apport  : ['' , [Validators.required,Validators.pattern('[0-9]+')]],
    duree: ['', [Validators.required, Validators.pattern('[0-9]+')]],
  })

  constructor(private eb: EbGieComponent,
              private typefinancementservice: TypeFinancementService,
              private garantiService: GarantieService,
              private fb: UntypedFormBuilder,
              private data: DataService,
              private changeDetector: ChangeDetectorRef,
              private router: Router,
              private fileService: FileService,
              private checkFileSize: CheckFileSize,
              private notificationService: NzNotificationService,
              private currencyPipe: CurrencyPipe) { }
  demandeFinancementForm2 = this.fb.group({

    //garantie  : ['' , Validators.required],
    //valeurGaranties  : ['' , [Validators.required,Validators.pattern('^[0-9\\s]*$')]],
    tauxInteret  : ['' , [Validators.required,Validators.pattern('[0-9]*.[0-9]*')]],
  })
  financementForm = this.fb.group({
    institutionFinanciere  : [''],
    autreInstitution  : [''],
    typeCredit  : [''],
    montant  : ['',Validators.pattern('^[0-9\\s]*$')],
    tauxInteretHT  : ['',Validators.pattern('[0-9]+')],
    datemepFinancement  : ['',pasteDateValidator],
    statutFinancement  : ['' ],
    tableauFinancement  : [''],
    dateRemboursement  : ['',pasteDateValidator],

  })

  SuccesForm = this.fb.group({

  })

  typefinancement?: TypeFinancement;
  typefinancements?: TypeFinancement[];
  garantie?: Garantie;
  garanties?: Garantie[];

  ngOnInit(): void {
    this.subscription=this.data.message.subscribe((data: string) => {
      console.log('Babs message',data);
      let message: string = data;
      if(message.trim().length!=0){
        this.stepname = data;
        this.showModel = true;
      }
      this.financementForm.controls.autreInstitution.disable();
    });

    console.log(this.demande);
    //let garantie = JSON.stringify(this.demande.garantie);
    //let valeurGarantie = JSON.stringify(this.demande.valeurGarantie);
    this.demandeFinancementForm1.controls.typefinancement.setValue(this.demande.typeDemande);
    this.demandeFinancementForm1.controls.montantdemande.setValue(''+this.demande.montant);
    this.demandeFinancementForm1.controls.nombreMembresConcernes.setValue(this.demande.nombreMembresConcernes);
    this.demandeFinancementForm1.controls.montantDemandeParMembre.setValue(this.demande.montantDemandeParMembre);
    //this.demandeFinancementForm1.controls.apport.setValue(this.demande.apport);
    this.demandeFinancementForm1.controls.duree.setValue(this.demande.duree);

    //this.demandeFinancementForm2.controls.garantie.setValue(garantie);
    //this.demandeFinancementForm2.controls.valeurGaranties.setValue(valeurGarantie);
    this.demandeFinancementForm2.controls.tauxInteret.setValue(this.demande.tauxInteretAnnuelleSouhaite);
    this.demandeFinancementForm1.controls.duree.setValue(this.demande.duree);
    this.demandeFinancementForm1.controls.montantdemande.setValue(''+this.demande.montant);
    this.demandeFinancementForm1.controls.coutProjet.setValue(this.demande.projets[0]?.cout);

    // this.listefinancements = this.demande.financementObtenus;
    for (let i = 0; i < this.demande.financementObtenus.length; i++) {
      const financement = this.demande.financementObtenus[i];
      let obj = {autreInstitution:financement.autreInstitutionFinanciere, datemepFinancement:financement.dateFinancement, dateRemboursement:financement.dateRemboursement,
                 institutionFinanciere:financement.institutionFinanciere, montant:financement.montant, statutFinancement:financement.statusFinancement,
                 tableauFinancementNom:financement.tableauAmortissement, tauxInteretHT:financement.tauxInteretAnnuelHT, typeCredit:financement.typeCredit};

      this.listefinancements.push(obj);
    }

    if(this.demande?.financementObtenus?.length>0){
      this.radioValue = "oui"
      this.show = true;
      this.currentIdFinancement = this.demande?.financementObtenus?.length;
      // this.nombreEntree ++;
    }
    else{
      this.show = false;
      this.radioValue = "non"
    }

    // this.gestionDuree();
    // this.gestionGrilleMontant();
    this.demandeFinancementForm1.updateValueAndValidity();
    this.changeDetector.markForCheck();

    this.onGetTypeFinancement()
    this.onGetGaranties()

    // console.log(this.typefinancements);
    if (this.financementInfo) {
      this.demandeFinancementForm1.patchValue({
          ...this.financementInfo
        }
      );
    }
    this.demandeFinancementForm1.controls.montantDemandeParMembre.disable();
    if (this.financementInfo) {
      this.demandeFinancementForm2.patchValue({
          ...this.financementInfo
        }
      );


    }
    this.showModel = false;

    this.checkFinFileSize = true;
    this.formatNumber();
  }

  onChange($event: any) {

  }
  currentStepPosition: number = this.eb.currentStepPosition;


  onGetTypeFinancement(){
    this.typefinancementservice.getAll().subscribe((response) =>{
      this.typefinancements = response.filter(item => item.typeBeneficiaires?.indexOf("GIE")!== -1);
      this.changeDetector.markForCheck();
    });

  }

  onGetGaranties(){
    this.garantiService.getAll().subscribe((response) =>{
      this.garanties = response;
      this.changeDetector.markForCheck();
    });
  }


  pre() {
    this.eb.pre()
  }

  next() {
    this.submitted = true;
    this.submitted2 = false;
    this.submitted3 = false;
    let listefinancementsTmp = this.listefinancements;

    if (this.demandeFinancementForm1.valid && this.demandeFinancementForm2.valid && this.nombreEntree === this.nombrecollapse-1){

      if((this.listefinancements.length === 0 && this.radioValue == "non") ||  (this.listefinancements.length !== 0 && this.radioValue == "oui" )) {

        this.financementInfoChange.emit({listeFinancement:listefinancementsTmp ,...this.demandeFinancementForm1.getRawValue(),...this.demandeFinancementForm2.getRawValue()})
        this.eb.next()
      }else if (this.radioValue == "oui"){
        this.notificationService.error('Attention', " Veuillez ajouter au moins un financement");
        return;
      }
      // else {
      else if(this.listefinancements.length > 0 && this.radioValue == "non") {


        listefinancementsTmp = [];
        this.financementInfoChange.emit({listeFinancement:listefinancementsTmp ,...this.demandeFinancementForm1.getRawValue(),...this.demandeFinancementForm2.getRawValue()})
        this.eb.next();
      }
    }else {
      if(this.nombreEntree === this.nombrecollapse -3) {

        if (this.demandeFinancementForm1.invalid) {
          this.submitted = true;
          this.notificationService.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
          return;
        }
        this.key1 = false;
        this.key2 = true;
        this.key3 = false;
      }
      if(this.nombreEntree ===this.nombrecollapse -2) {


        if (this.demandeFinancementForm2.invalid) {
          this.submitted2 = true;
          this.notificationService.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
          return;
        }else {
          if (this.radioValue == "non") {

            listefinancementsTmp = [];
            this.financementInfoChange.emit({listeFinancement:listefinancementsTmp ,...this.demandeFinancementForm1.getRawValue(),...this.demandeFinancementForm2.getRawValue()})
            this.eb.next();
          }
        }
        if(this.radioValue == 'oui') {
          this.key1 = false;
          this.key2 = false;
          this.key3 = true;
        }
      }

    }
    this.nombreEntree ++;
  }

  done() {
    this.eb.done()
  }

  convertObject(value: any) {
    return JSON.stringify(value);
  }
  redirectionAcceuil() {
    this.router.navigate(["/beneficiaire"])
  }

  calculPourcentageMontantMembre(){
    if(this.demandeFinancementForm1.controls.nombreMembresConcernes.valid && this.demandeFinancementForm1.controls.montantdemande.valid ){
      let result =((this.demandeFinancementForm1.controls.montantdemande.value)?.replace(/\s/g, "")  /this.demandeFinancementForm1.controls.nombreMembresConcernes.value);
      this.demandeFinancementForm1.controls.montantDemandeParMembre.setValue(result.toFixed(2));
    }
    else{
      this.demandeFinancementForm1.controls.montantDemandeParMembre.setValue('');
    }
  }
  choose() {
    if(this.radioValue == "oui"){
      this.isRequired = true;
      this.financementForm.controls.institutionFinanciere.addValidators(Validators.required);
      this.financementForm.controls.institutionFinanciere.updateValueAndValidity()
      this.financementForm.controls.montant.addValidators([Validators.required,Validators.pattern('^[0-9\\s]*$')]);
      this.financementForm.controls.montant.updateValueAndValidity()
      this.financementForm.controls.statutFinancement.addValidators(Validators.required);
      this.financementForm.controls.statutFinancement.updateValueAndValidity()
      console.log(this.financementForm);
      this.show = true;
    }else{
      this.show = false;
      console.log(this.radioValue);
    }

  }
  controlLabel(){
    let etatlabel: boolean = false;
    if(this.radioValue == "oui"){
      etatlabel = true;
    }
    return etatlabel;

  }

  tableauFinancementLoad(event: any) {
    let tableau: string[] = ['pdf','doc','docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    this.checkFile = false;
    if(this.checkTypeFile(tableau,event.target.files[0].name.split('.').pop())) {
    // check if file exist
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      this.checkFinFileSize = this.checkFileSize.checkSize(file.size, 'notSelfie');

      if (this.checkFinFileSize) {
        let formData = new FormData();

        formData.append('file', file);
        console.log(file)


        // set the name form the database
        this.fileService.save(formData, 'tableauFinancement').subscribe(
          response => {

            this.tableauFinancementNom = response.reponse;
            console.log(this.tableauFinancementNom);
            this.financementForm.patchValue({
              tableauxFinancement: this.tableauFinancementNom
            })
          }
          , error => {
            console.log(error);
          }
        )
      } else {
        this.financementForm.controls.tableauFinancement.setValue('');
      }


    } this.checkFile = false;
    }else{
      this.checkFile = true;
      this.financementForm.controls.tableauFinancement.setValue('');
    }

  }
  modifierFinancement(id : number){
    let financement = this.listefinancements.find(s => s.id == id );
    this.financementTemp = financement;
    console.log(financement)
    // this.financementForm.patchValue({...financement});
    let dateRemboursement;
    let dateFinancement;

    dateRemboursement = new Date(financement.dateRemboursement);
    dateFinancement = new Date(financement.datemepFinancement);

    let dateFinancementMonth = '';
    let dateFinancementDay = '';
    if(dateFinancement.getMonth()<9){
      dateFinancementMonth = '0'+(dateFinancement.getMonth()+1);
    }
    else{
      dateFinancementMonth = (dateFinancement.getMonth()+1)+'';
    }

    if(dateFinancement.getDate()<10){
      dateFinancementDay = '0'+dateFinancement.getDate();
    }
    else{
      dateFinancementDay = dateFinancement.getDate()+'';
    }

    let dateRemboursementMonth = '';
    let dateRemboursementDay = '';
    if(dateRemboursement.getMonth()<9){
      dateRemboursementMonth = '0'+(dateRemboursement.getMonth()+1);
    }
    else{
      dateRemboursementMonth = (dateRemboursement.getMonth()+1)+'';
    }

    if(dateRemboursement.getDate()<10){
      dateRemboursementDay = '0'+dateRemboursement.getDate();
    }
    else{
      dateRemboursementDay = dateRemboursement.getDate()+'';
    }

    let strDateFinancement = dateFinancement.getFullYear() + '-' +dateFinancementMonth+'-'+dateFinancementDay;
    let strDateRemboursement = dateRemboursement.getFullYear() + '-' +dateRemboursementMonth+'-'+dateRemboursementDay;

    // this.financementForm.patchValue({...financement});
    this.tableauFinancementNom = financement.tableauFinancementNom;
    this.financementForm.controls.institutionFinanciere.setValue(financement.institutionFinanciere);
    this.gestionInstitution();
    this.financementForm.controls.autreInstitution.setValue(financement.autreInstitution);
    this.financementForm.controls.typeCredit.setValue(financement.typeCredit);
    // this.financementForm.controls.tableauxFinancement.setValue(financement.tableauxFinancement);
    this.financementForm.controls.montant.setValue(financement.montant);
    this.financementForm.controls.tauxInteretHT.setValue(financement.tauxInteretHT);
    this.financementForm.controls.datemepFinancement.setValue(strDateFinancement);
    this.financementForm.controls.statutFinancement.setValue(financement.statutFinancement);
    this.financementForm.controls.dateRemboursement.setValue(strDateRemboursement);
    this.currentIdFinancement--;
    if(this.currentIdFinancement == 0){
      this.financementValidity = false;
    }
    this.listefinancements = this.listefinancements.filter(s => s.id !== id)



  }

  confirmSuppressionFinancement(id : number ){
    console.log(this.listefinancements);
    this.listefinancements =  this.listefinancements.filter(
      s => {
        console.log(id);
        return  s.id !== id ;
      }
    );
    console.log(this.listefinancements)
  }

  ajouterFinancement() {
    this.submitted3=true;
    if(this.financementForm.valid){
      console.log(this.financementForm);
      this.listefinancements.push({id: this.currentIdFinancement ,tableauFinancementNom :this.tableauFinancementNom, ...this.financementForm.getRawValue()})
      console.log(this.listefinancements);
      this.currentIdFinancement++;
      this.financementValidity = true;
      this.notificationService.success('Succés','Vous avez bien ajouté une demande de financement antérieure de  ' + this.financementForm.controls.montant.value );
      this.financementForm.reset();
      this.submitted3  = false;
    }else{
      this.submitted3 =  true;
      this.notificationService.error('Attention'," Veuillez vérifier si tous les champs obligatoires d'ajout de financement sont remplis ");
    }
  }

  controlLabelInstitution(){
    let etat: boolean = false;

    if(this.radioValue == "oui" &&  this.financementForm.controls.institutionFinanciere.value == 'Autre institution'){
      etat = true;
    }
    return etat;
  }
  gestionInstitution() {
    console.log(this.financementForm.controls.institutionFinanciere.value);
    if( this.financementForm.controls.institutionFinanciere.value == 'Autre institution') {
      this.financementForm.controls.autreInstitution.enable();
      this.financementForm.controls.autreInstitution.addValidators(Validators.required);
      this.financementForm.controls.autreInstitution.updateValueAndValidity();
    } else {
      this.financementForm.controls.autreInstitution.disable();
      this.financementForm.controls.autreInstitution.setValue('');
    }
  }

  onChangeCoutProjetValidators() {
    this.demandeFinancementForm1.controls.coutProjet.clearValidators();
    this.demandeFinancementForm1.controls.coutProjet.addValidators([Validators.required, Validators.pattern('^[0-9\\s]*$'), minValidator(this.demandeFinancementForm1.controls.montantdemande.value)]);
    this.demandeFinancementForm1.controls.coutProjet.updateValueAndValidity();
  }

  gestionGrilleMontant() {

    var limitAmount: string[] = [];
    this.demandeFinancementForm1.controls.montantdemande.clearValidators();
    this.demandeFinancementForm1.controls.montantdemande.addValidators([Validators.required, Validators.pattern('^[0-9\\s]*$')]);
    this.demandeFinancementForm1.controls.montantdemande.updateValueAndValidity();
    if (this.demandeFinancementForm1.controls.typefinancement.value == 'Crédit d\'urgence COVID 19') {
      limitAmount.push("150 000");
      limitAmount.push("400 000");
      console.log('Montant demandé en Francs CFA [Minimum ' + limitAmount[0] + ' - Maximum ' + limitAmount[1] + ']');
      this.libelleMontant = 'Montant demandé en Francs CFA [Minimum '+ limitAmount[0]+' - Maximum '+limitAmount[1]+']';
      this.demandeFinancementForm1.controls.montantdemande.addValidators(minValidator(limitAmount[0]));
      this.demandeFinancementForm1.controls.montantdemande.updateValueAndValidity();
      this.demandeFinancementForm1.controls.montantdemande.addValidators(maxValidator(limitAmount[1]));
      this.demandeFinancementForm1.controls.montantdemande.updateValueAndValidity();


    }else if(this.demandeFinancementForm1.controls.typefinancement.value == 'Crédit court terme, moins à égal à 12 mois'){
      limitAmount.push("100 000");
      limitAmount.push("650 000");
      console.log(limitAmount);
      this.libelleMontant = 'Montant demandé en Francs CFA [Minimum '+ limitAmount[0]+' - Maximum '+limitAmount[1]+']';
      this.demandeFinancementForm1.controls.montantdemande.addValidators(minValidator(limitAmount[0]));
      this.demandeFinancementForm1.controls.montantdemande.updateValueAndValidity();
      this.demandeFinancementForm1.controls.montantdemande.addValidators(maxValidator(limitAmount[1]));
      this.demandeFinancementForm1.controls.montantdemande.updateValueAndValidity();

    }else if(this.demandeFinancementForm1.controls.typefinancement.value =='Crédit moyen terme, supérieur à 12 mois'){
      if( this.demandeFinancementForm1.controls.duree.value <= 15) {
        limitAmount.push("250 000");
        limitAmount.push("650 000");
      }else {
        limitAmount.push("300 000");
        limitAmount.push("700 000");
      }
      this.libelleMontant = 'Montant demandé en Francs CFA [Minimum '+ limitAmount[0]+' - Maximum '+limitAmount[1]+']';
      this.demandeFinancementForm1.controls.montantdemande.addValidators(minValidator(limitAmount[0]));
      this.demandeFinancementForm1.controls.montantdemande.updateValueAndValidity();
      this.demandeFinancementForm1.controls.montantdemande.addValidators(maxValidator(limitAmount[1]));
      this.demandeFinancementForm1.controls.montantdemande.updateValueAndValidity();

    }
  }

  gestionDuree(){
    this.duree =0;
    // this.demandeFinancementForm1.controls.duree.reset(null);
    // this.demandeFinancementForm1.controls.montantdemande.reset(null);
    // this.libelleDuree = 'Durée souhaitée en nombre de mois';
    // this.libelleMontant = 'Montant demandé en Francs CFA ';
    this.demandeFinancementForm1.controls.duree.clearValidators();
    this.demandeFinancementForm1.controls.duree.addValidators([Validators.required,Validators.pattern('^[0-9\\s]*$')])

    if(this.demandeFinancementForm1.controls.typefinancement.value == 'Crédit d\'urgence COVID 19'){
      this.duree = 18;
      this.libelleDuree = 'Durée souhaitée en nombre de mois [Maximum: '+ this.duree+']';
      this.demandeFinancementForm1.controls.duree.addValidators(Validators.max(this.duree));
    }else if(this.demandeFinancementForm1.controls.typefinancement.value == 'Crédit court terme, moins à égal à 12 mois'){
      this.duree = 12;
      this.libelleDuree = 'Durée souhaitée en nombre de mois [Maximum: '+ this.duree+']';
      this.demandeFinancementForm1.controls.duree.addValidators(Validators.max(this.duree));
    }else if(this.demandeFinancementForm1.controls.typefinancement.value == 'Crédit moyen terme, supérieur à 12 mois'){
      this.duree = 24;
      this.libelleDuree = 'Durée souhaitée en nombre de mois [Maximum: '+ this.duree+']';
      this.demandeFinancementForm1.controls.duree.addValidators(Validators.max(this.duree));
    }

    this.demandeFinancementForm1.controls.duree.markAsTouched();
    this.demandeFinancementForm1.controls.duree.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    this.demandeFinancementForm1.updateValueAndValidity();
    this.demandeFinancementForm1.updateValueAndValidity();

  }

  handleStepOk(): void {
    if(this.stepname === "la description du projet"){
      this.eb.currentStepPosition =0;

    }
    this.showModel = false;
  }

  handleStepCancel(): void {
    this.showModel = false;
  }
  checkTypeFile(tableau: string[],extension: string ){
    return tableau?.indexOf(extension) !== -1;
  }

  formatNumber() {
    let amount = this.currencyPipe.transform((this.demandeFinancementForm1.controls.montantdemande.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.demandeFinancementForm1.controls.montantdemande.setValue(amount)

    /*let amountGaranty = this.currencyPipe.transform((this.demandeFinancementForm2.controls.valeurGaranties.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.demandeFinancementForm2.controls.valeurGaranties.setValue(amountGaranty)*/

    let amount2 = this.currencyPipe.transform((this.financementForm.controls.montant.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.financementForm.controls.montant.setValue(amount2)

    let amount3 = this.currencyPipe.transform((this.demandeFinancementForm1.controls?.coutProjet?.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.demandeFinancementForm1.controls?.coutProjet?.setValue(amount3)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
