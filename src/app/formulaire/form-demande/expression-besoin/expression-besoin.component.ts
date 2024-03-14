import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormDemandeComponent} from "../form-demande.component";
import {TypeFinancement} from "../../../model/type-financement";
import {TypeFinancementService} from "../../../services/configuration/type-financement/type-financement.service";
import {GarantieService} from "../../../services/configuration/garanties/garantie.service";
import {Garantie} from "../../../model/garantie";
import {StatutService} from "../../../services/configuration/statut-financement/statut.service";
import {InstitutionService} from "../../../services/configuration/institution-financiere/institution.service";
import {CreditService} from "../../../services/configuration/type-credit/credit.service";
import {Statut} from "../../../model/Statut";
import {Institution} from "../../../model/Institution";
import {TypeCredit} from "../../../model/TypeCredit";
import {UntypedFormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {maxValidator, minValidator, pasteDateValidator} from "../../../core/customValidators/past-date-validator";
import {FileService} from "../../../services/file/file.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {CurrencyPipe} from "@angular/common";
import {environment} from "../../../../environments/environment";
import {CheckFileSize} from "../../../core/utils/checker/checkFileSize";
import {AuthService} from "../../../services/security/auth/auth.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {upperCase} from "@rxweb/reactive-form-validators";

@Component({
  selector: 'app-expression-besoin',
  templateUrl: './expression-besoin.component.html',
  styleUrls: ['./expression-besoin.component.scss']
})
export class ExpressionBesoinComponent implements OnInit, OnChanges {

  @Input() financementInfo : any ;
  @Output() financementInfoChange = new EventEmitter<any>();

  @Input() showSucces : boolean = false;
  @Input() demandeFin : boolean = true;
  duree: number = 0;
  @Input() stepname : any;
  @Input() showModel: any;
  checkFinFileSize: boolean = true;
  baseUrlFile = environment.baseUrlFile;
  checkFile: boolean = false;
  dateMaxCreation = new Date();
  dateMaxCreationString = this.dateMaxCreation.getFullYear() + '-' + (this.dateMaxCreation.getMonth()+1)+'-'+(this.dateMaxCreation.getDate()>=10 ? this.dateMaxCreation.getDate() : '0'+this.dateMaxCreation.getDate());
  valeurGaranties: string='';
  montantValue!: string;


  libelleDuree: string = 'Durée souhaitée en nombre de mois';
  libelleMontant: string = 'Montant demandé en Francs CFA [Minimum: 50 000 - Maximum: 5 000 000]';
  alert : string = 'Le montant minimum dans ce champ est de 50 mille FCFA, le montant maximum est de 5 millions FCFA. Ces fourchettes sont à titre illustratif pour vous guider. La structure qui recevra votre demande confirmera le montant à vous octroyer selon votre besoin de financement .'
  typebenef ?: string
  constructor(private eb: FormDemandeComponent,
              private typefinancementservice: TypeFinancementService,
              private garantiService: GarantieService,
              private statutservice: StatutService,
              private institutionService: InstitutionService,
              private typeCreditService: CreditService,
              private fb: UntypedFormBuilder,
              public authService: AuthService,
              private modal: NzModalService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private fileService: FileService,
              private checkFileSize: CheckFileSize,
              private notificationService: NzNotificationService,
              private currencyPipe: CurrencyPipe) { }
  typefinancement?: TypeFinancement;
  typefinancements?: TypeFinancement[];
  garantie?: Garantie;
  garanties?: Garantie[];
  statut?: Statut;
  statuts?: Statut[];
  institution?: Institution;
  institutions?: Institution[];
  typeCredit?: TypeCredit;
  typeCredits?: TypeCredit[];
  listefinancements : any[] = [];
  user = null;
  date = null;
  radioValu: string='non' ;
  isRequired: boolean = false;
  submitted: boolean = false;
  submitted2: boolean = false;
  checkCoutProjet: boolean = false;
  tableauFinancementNom: any;
  currentIdFinancement = 0;
  financementValidity = false ;
  show: boolean = false;
  idPmo: any;
  idBeneficiaire: any;
  key1= true;
  key2= false;
  nombreEntree: number = 0;
  readonly coutProjetValidator = this.fb.control(
    '', [Validators.required,Validators.pattern('^[0-9\\s]*$')]
  )

  demandeFinancementForm = this.fb.group({
    typefinancement  : ['', Validators.required],
    montantdemande  : ['' , [Validators.required,Validators.pattern('^[0-9\\s]*$'),minValidator("50000"),maxValidator("5 000 000")]],
    coutProjet: ['', [Validators.required,Validators.pattern('^[0-9\\s]*$'), minValidator(this.montantValue)]],
    //apport  : ['' , [Validators.required,Validators.pattern('[0-9]*.[0-9]*')]],
    garanties  : [''],
    valeurGaranties  : ['' , [Validators.pattern('^[0-9\\s]*$')]],
    tauxInteret  : ['' , [Validators.required,Validators.pattern('[0-9]*.[0-9]*')]],
    duree  : ['' , [Validators.required,Validators.pattern('[0-9]+')]],


  })

  financementForm = this.fb.group({
    institutionFinanciere  : ['' ],
    autreInstitution  : [''],
    typeCredit  : ['' ],
    montant  : ['' ,[Validators.required,Validators.pattern('^[0-9\\s]*$')]],
    tauxInteretHT  : ['' , Validators.pattern('[0-9]*.[0-9]*')],
    datemepFinancement  : ['' ,pasteDateValidator ],
    statutFinancement  : [''],
    tableauFinancement  : [''],
    dateRemboursement  : ['' ,pasteDateValidator ],
  })

  ngOnInit(): void {
    let type = localStorage.getItem('typeBenef')
    if(type){
      console.log('typebenef '+type)
      this.typebenef = type;
      switch (this.typebenef.toUpperCase()){
        case "ME" :
          this.libelleMontant = 'Montant demandé en Francs CFA [Minimum: 50 000 - Maximum: 5 000 000]';
          this.demandeFinancementForm.controls.montantdemande.clearValidators()
          this.demandeFinancementForm.controls.montantdemande.addValidators([
            Validators.required,Validators.pattern('^[0-9\\s]*$'),
            minValidator("50000"),maxValidator("5 000 000")
          ])
          this.alert = 'Le montant minimum dans ce champ est de 50 mille FCFA, le montant maximum est de 5 millions FCFA. Ces fourchettes sont à titre illustratif pour vous guider. La structure qui recevra votre demande confirmera le montant à vous octroyer selon votre besoin de financement .'
          break;
        case "PME" :
          this.libelleMontant = 'Montant demandé en Francs CFA [Minimum: 500 000 - Maximum: 50 000 000]';
          this.demandeFinancementForm.controls.montantdemande.clearValidators()
          this.demandeFinancementForm.controls.montantdemande.addValidators([
            Validators.required,Validators.pattern('^[0-9\\s]*$'),
            minValidator("500000"),maxValidator("50 000 000")
          ])
          this.alert = 'Le montant minimum dans ce champ est de 500 mille FCFA, le montant maximum est de 50 millions FCFA. Ces fourchettes sont à titre illustratif pour vous guider. La structure qui recevra votre demande confirmera le montant à vous octroyer selon votre besoin de financement .'
          break;
        case "GIE" :
          this.libelleMontant = 'Montant demandé en Francs CFA [Minimum: 500 000 - Maximum: 50 000 000]';
          this.demandeFinancementForm.controls.montantdemande.clearValidators()
          this.demandeFinancementForm.controls.montantdemande.addValidators([
            Validators.required,Validators.pattern('^[0-9\\s]*$'),
            minValidator("500000"),maxValidator("50 000 000")
          ])
          this.alert = 'Le montant minimum dans ce champ est de 500 mille FCFA, le montant maximum est de 50 millions FCFA. Ces fourchettes sont à titre illustratif pour vous guider. La structure qui recevra votre demande confirmera le montant à vous octroyer selon votre besoin de financement .'
          break;
      }
    }
    // this.showSucces = true;
    this.idPmo = this.activatedRoute.snapshot.params.pmo;
    this.idBeneficiaire = this.activatedRoute.snapshot.params.idBenef;
    // console.log('idpmo recu', this.idPmo);
    // console.log('idbenef recu', this.idBeneficiaire);

    this.onGetTypeFinancement()
    this.onGetGaranties()
    if(this.financementInfo){
      this.demandeFinancementForm.patchValue({
          ...this.financementInfo
        }
      );
      this.tableauFinancementNom = this.financementInfo.tableauFinancementNom;

    }
    this.showModel = false;

    this.financementForm.controls.autreInstitution.disable();

    this.checkFinFileSize = true;

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.idPmo && this.idBeneficiaire && this.showSucces){
      this.showSucces = false;
      this.router.navigate(['/pmo/offres-beneficiaire/'+this.idBeneficiaire]);
    }
  }

  log(): void {
    //console.log('click dropdown button');
  }
  onChange(result: Date): void {
    //console.log('onChange: ', result);
  }
  deleteUser(){

  }

  onGetTypeFinancement(){
    this.typefinancementservice.getAll().subscribe((response) =>{
      this.typefinancements = response.filter(item => item.typeBeneficiaires?.indexOf("ME")!== -1);

    });
  }

  onGetGaranties(){
    this.garantiService.getAll().subscribe((response) =>{
      this.garanties = response;
    });
  }



  currentStepPosition: number = this.eb.currentStepPosition;

  pre() {
    this.eb.pre()
  }

  next() {
    this.submitted = true;
    this.submitted2 = false;
    if (this.demandeFinancementForm.valid &&  this.nombreEntree !==0){
      if((this.listefinancements.length === 0 && this.radioValu == "non") ||  (this.listefinancements.length !== 0 && this.radioValu == "oui" )) {
        this.financementInfoChange.emit({listeFinancement: this.listefinancements, ...this.demandeFinancementForm.getRawValue()})
        this.eb.next()
      }
      else if (this.radioValu == "oui"){
        this.notificationService.error('Attention', " Veuillez ajouter au moins un financement");
        return;
      }
    }else {
      if(this.nombreEntree ===0) {
        if (this.demandeFinancementForm.invalid) {
          this.notificationService.error('Attention', " Veuillez vérifier si tous les champs obligatoires sont remplis correctement");
          return;
        }else{
          if(this.radioValu == "non"){
            this.financementInfoChange.emit({listeFinancement: this.listefinancements, ...this.demandeFinancementForm.getRawValue()})
            this.eb.next()
          }
        }
        if(this.radioValu == "oui") {
          this.key1 = false;
          this.key2 = true;
        }
      }else if(this.nombreEntree !==0){
        if(this.listefinancements.length === 0 && this.radioValu == "oui"){
          this.notificationService.error('Attention', " Veuillez ajouter au moins un financement");
          return;
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
    // if(this.authService.getRole() === "AGENT_INITIATEUR"){
    //   console.log("Close")
    //   this.modal.closeAll()
    // }
    if(this.idBeneficiaire && this.authService.getRole() !== "AGENT_INITIATEUR"){
      this.router.navigate(["/pmo"]);
    }
    else{
      this.router.navigate(["/beneficiaire"]);
    }
  }
  redirection(){
    this.modal.closeAll();
  }

  choose() {
    if(this.radioValu == "oui"){
        this.isRequired = true;
      this.financementForm.controls.institutionFinanciere.addValidators(Validators.required);
      this.financementForm.controls.institutionFinanciere.updateValueAndValidity()
      this.financementForm.controls.montant.addValidators([Validators.required,Validators.pattern('^[0-9\\s]*$')]);
      this.financementForm.controls.montant.updateValueAndValidity();
      this.financementForm.controls.statutFinancement.addValidators(Validators.required);
      this.financementForm.controls.statutFinancement.updateValueAndValidity();
      //console.log(this.financementForm);
      this.show = true;
    }else{
      this.show = false;
    }
  }

  tableauFinancementLoad(event: any) {
    let tableau: string[] = ['pdf','doc','docx','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    this.checkFile = false;
    if(this.checkTypeFile(tableau,event.target.files[0].name.split('.').pop())) {
    // check if file exist
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      console.log(file.size);

      this.checkFinFileSize = this.checkFileSize.checkSize(file.size, 'notSelfie');

      if (this.checkFinFileSize) {
        let formData = new FormData();

        formData.append('file', file);
        //console.log(file)


        // set the name form the database
        this.fileService.save(formData, 'tableauFinancement').subscribe(
          response => {

            this.tableauFinancementNom = response.reponse ;
            //console.log(this.tableauFinancementNom);
          }
          ,error=>{
            console.log(error);
          }
        )
      } else {
        console.log("Fichier trop lourd !!!!!");
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
    //console.log(financement)
    this.financementForm.patchValue({...financement});
    this.currentIdFinancement--;
    if(this.currentIdFinancement == 0){
      this.financementValidity = false;
    }
    this.listefinancements = this.listefinancements.filter(s => s.id !== id)

  }

  confirmSuppressionFinancement(id : number ){
    //console.log(this.listefinancements);
    this.listefinancements =  this.listefinancements.filter(
      s => {
        //console.log(id);
        return  s.id !== id ;
      }
    );
    //console.log(this.listefinancements)
  }

  checkProjectCost() {
    this.checkCoutProjet = false;
    if (this.demandeFinancementForm.controls.coutProjet.value.length === 0) {
      this.checkCoutProjet = true;
    }
  }

  ajouterFinancement() {

    this.submitted2 =  true;
  if(this.financementForm.valid){

    //console.log(this.financementForm);
    this.listefinancements.push({id: this.currentIdFinancement ,tableauFinancementNom :this.tableauFinancementNom, ...this.financementForm.getRawValue()})
    //console.log(this.listefinancements);
    this.currentIdFinancement++;
    this.financementValidity = true;
    this.notificationService.success('Succés','Vous avez bien ajouté une demande de financement antérieure de  ' + this.financementForm.controls.montant.value );

    this.financementForm.reset();
    this.submitted2 =  false;

  }else{
    this.submitted2 =  true;
      this.notificationService.error('Attention'," Veuillez vérifier si tous les champs obligatoires d'ajout de financement sont remplis ");
  }
  }

  controlLabel(){
    let etatlabel: boolean = false;
    if(this.radioValu == "oui"){
      etatlabel = true;
    }
    return etatlabel;

  }
  controlLabelInstitution(){
    let etat: boolean = false;
    //console.log(this.financementForm.controls.institutionFinanciere.value);
    if(this.radioValu == "oui" &&  this.financementForm.controls.institutionFinanciere.value == 'Autre institution'){
      etat = true;
    }
    return etat;

  }
  gestionInstitution() {
    //console.log(this.financementForm.controls.institutionFinanciere.value);

    if( this.financementForm.controls.institutionFinanciere.value == 'Autre institution') {
      this.financementForm.controls.autreInstitution.enable();
      this.financementForm.controls.autreInstitution.addValidators(Validators.required);
      this.financementForm.controls.autreInstitution.updateValueAndValidity();
    }
    else {
      this.financementForm.controls.autreInstitution.disable();
      this.financementForm.controls.autreInstitution.setValue('');
    }

  }

 /* gestionGrilleMontant(){

    var  limitAmount : string[] = [];
    this.demandeFinancementForm.controls.montantdemande.clearValidators();
    this.demandeFinancementForm.controls.montantdemande.addValidators([Validators.required,Validators.pattern('^[0-9\\s]*$')])
    this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();
    if(this.demandeFinancementForm.controls.typefinancement.value == 'Crédit d\'urgence COVID 19'){
      limitAmount.push("150 000");
      limitAmount.push("400 000");
      this.libelleMontant = 'Montant demandé en Francs CFA [Minimum '+ limitAmount[0]+' - Maximum '+limitAmount[1]+']';
      this.demandeFinancementForm.controls.montantdemande.addValidators(minValidator(limitAmount[0]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();
      this.demandeFinancementForm.controls.montantdemande.addValidators(maxValidator(limitAmount[1]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();


    }else if(this.demandeFinancementForm.controls.typefinancement.value == 'Crédit court terme, moins à égal à 12 mois'){
      limitAmount.push("100 000");
      limitAmount.push("700 000");
      //console.log(limitAmount);
      this.libelleMontant = 'Montant demandé en Francs CFA [Minimum '+ limitAmount[0]+' - Maximum '+limitAmount[1]+']';
      this.demandeFinancementForm.controls.montantdemande.addValidators(minValidator(limitAmount[0]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();
      this.demandeFinancementForm.controls.montantdemande.addValidators(maxValidator(limitAmount[1]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();

    }else if(this.demandeFinancementForm.controls.typefinancement.value =='Crédit moyen terme, supérieur à 12 mois'){
        limitAmount.push("100 000");
        limitAmount.push("650 000");

      this.libelleMontant = 'Montant demandé en Francs CFA [Minimum '+ limitAmount[0]+' - Maximum '+limitAmount[1]+']';
      this.demandeFinancementForm.controls.montantdemande.addValidators(minValidator(limitAmount[0]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();
      this.demandeFinancementForm.controls.montantdemande.addValidators(maxValidator(limitAmount[1]));
      this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();

    }
  }*/

  gestionDuree(){
    this.duree =0;
    this.demandeFinancementForm.controls.duree.reset(null);

    this.demandeFinancementForm.controls.duree.clearValidators();
    this.demandeFinancementForm.controls.duree.addValidators([Validators.min(2),Validators.required,Validators.pattern('[0-9]+')])

    this.demandeFinancementForm.controls.duree.updateValueAndValidity();

    if(this.demandeFinancementForm.controls.typefinancement.value == 'Crédit d\'urgence COVID 19'){

      this.duree = 18;
      this.libelleDuree = 'Durée souhaitée en nombre de mois [Maximum: '+ this.duree+']';
      this.demandeFinancementForm.controls.duree.addValidators(Validators.max(this.duree));
      this.demandeFinancementForm.controls.duree.updateValueAndValidity();

    }else if(this.demandeFinancementForm.controls.typefinancement.value == 'Crédit court terme, moins à égal à 12 mois'){
      this.duree = 12;
      this.libelleDuree = 'Durée souhaitée en nombre de mois [Maximum: '+ this.duree+']';
      this.demandeFinancementForm.controls.duree.addValidators(Validators.max(this.duree));
      this.demandeFinancementForm.controls.duree.updateValueAndValidity();

    }else if(this.demandeFinancementForm.controls.typefinancement.value == 'Crédit moyen terme, supérieur à 12 mois'){
      this.duree = 24;
      this.libelleDuree = 'Durée souhaitée en nombre de mois [Maximum: '+ this.duree+']';
      this.demandeFinancementForm.controls.duree.addValidators(Validators.max(this.duree));
      this.demandeFinancementForm.controls.duree.updateValueAndValidity();

    }

  }
  handleStepOk(): void {
    if(this.stepname === "la description du projet"){
      this.eb.currentStepPosition =0;

    }
    this.showModel = false;
    this.checkFinFileSize = true;
  }

  handleStepCancel(): void {
    this.showModel = false;
  }
  checkTypeFile(tableau: string[],extension: string ){
    return tableau?.indexOf(extension) !== -1;
  }

  // coutProjet: ['', [Validators.required,Validators.pattern('^[0-9\\s]*$'), minValidator(this.montantValue)]],

  checkLimitInputMontant() {
    this.checkCoutProjet = false;
    this.demandeFinancementForm.controls.montantdemande.clearValidators();
    this.demandeFinancementForm.controls.montantdemande.addValidators([Validators.min(50000), Validators.max(this.demandeFinancementForm.controls.coutProjet.value), Validators.required, Validators.pattern('[0-9]+')]);
    this.demandeFinancementForm.controls.montantdemande.updateValueAndValidity();
  }

  onChangeCoutProjetValidators(){
    this.montantValue = this.demandeFinancementForm.controls.montantdemande.value;
    this.demandeFinancementForm.controls.coutProjet.clearValidators();
    this.demandeFinancementForm.controls.coutProjet.addValidators([Validators.required,Validators.pattern('^[0-9\\s]*$'), minValidator(this.montantValue)]);
    this.demandeFinancementForm.controls.coutProjet.updateValueAndValidity();

  }

  formatNumber() {

    let amount = this.currencyPipe.transform((this.demandeFinancementForm.controls.montantdemande.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.demandeFinancementForm.controls.montantdemande.setValue(amount)

    let amount1 = this.currencyPipe.transform((this.demandeFinancementForm.controls.valeurGaranties.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.demandeFinancementForm.controls.valeurGaranties.setValue(amount1)

    let amount2 = this.currencyPipe?.transform((this.financementForm.controls.montant.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.financementForm.controls.montant.setValue(amount2)

    let amount3 = this.currencyPipe.transform((this.demandeFinancementForm.controls.coutProjet.value)?.replace(/\s/g, ""), 'XOF', '', '3.0-3', 'fr')
    this.demandeFinancementForm.controls.coutProjet.setValue(amount3)
  }


  controlLabelGarante(){
    if(JSON.parse(this.demandeFinancementForm.controls['garanties'].value).libelle == 'Sans garantie' ){
      this.demandeFinancementForm.controls["valeurGaranties"].setValue('');
        this.demandeFinancementForm.controls["valeurGaranties"].disable();
      }
    else{
      this.demandeFinancementForm.controls["valeurGaranties"].enable();
    }
  }

}
