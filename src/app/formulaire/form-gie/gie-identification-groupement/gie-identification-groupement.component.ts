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
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {FormGieComponent} from "../form-gie.component";
import {ZoneGeographiqueService} from "../../../services/configuration/zone-geographique/zone-geographique.service";
import {pasteDateValidator} from "../../../core/customValidators/past-date-validator";
import {FileService} from "../../../services/file/file.service";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {CheckFileSize} from "../../../core/utils/checker/checkFileSize";

@Component({
  selector: 'app-gie-identification-groupement',
  templateUrl: './gie-identification-groupement.component.html',
  styleUrls: ['./gie-identification-groupement.component.scss']
})
export class GieIdentificationGroupementComponent implements OnInit, OnChanges {
  currentStepPosition: number = this.formGieComponent.currentStepPosition;
  departements: any[] = [];
  regions: any[] = [];
  listeZoneGographique: any [] = [];
  region: string ="";
  @Input() groupementInfo : any ;
  @Output() groupementInfoChange = new EventEmitter<any>();
  dateMaxCreation = new Date();
  checkCNIFileSize: boolean = true;
  dateMaxCreationString = this.dateMaxCreation.getFullYear() + '-' + (this.dateMaxCreation.getMonth() + 1) + '-' + (this.dateMaxCreation.getDate() >= 10 ? this.dateMaxCreation.getDate() : '0' + this.dateMaxCreation.getDate());
  checkFile: boolean = false;

  groupementForm = this.fb.group({
      nomGroupement : ['' , Validators.required ],
      adresseEmail : ['' , Validators.pattern('^((?![0-9]+)[a-zA-Z0-9\\._-]+)@[a-zA-Z]+\\.[a-zA-Z]{2,}$') ],
      statusJuridique : ['' , Validators.required ],
      dateCreation : ['' , [Validators.required , pasteDateValidator ] ],
      adresse : ['' , [Validators.required,Validators.pattern('^(?![0-9]*$)[a-zA-Z0-9\\-\\/ ]*')] ],
      departement : ['' , Validators.required ],
     //region : ['' , Validators.required ],
      centreUrbain : [ '' , Validators.required],
      documentConstitution : ['']
    }
  );
  this: any;
  submitted: boolean = false;
  documentConstitutionNom: any;
  beneficiaireId: number = 0;
  baseUrlFile = environment.baseUrlFile;

  constructor(private formGieComponent: FormGieComponent,
              private fb: UntypedFormBuilder,
              private changeDetector: ChangeDetectorRef,
              private zoneGeographiqueService: ZoneGeographiqueService,
              private fileService: FileService,
              private checkFileSize: CheckFileSize,
              private activateRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef) {
    this.beneficiaireId = this.activateRoute.snapshot.params.beneficiaire;
  }

  ngOnInit(): void {
    this.onGetZoneGeographique();
    if (this.groupementInfo){
      if(this.groupementInfo.departement === 'null')
        this.groupementInfo.departement = null

      this.region = this.groupementInfo.region
      this.groupementForm.patchValue(
        {
          ...this.groupementInfo
        }
      )
      if(this.groupementInfo.region){
        this.chargeDepartements(this.groupementInfo.region)
      }
      this.region = this.groupementInfo.region
      // this.documentConstitutionNom = this.documentConstitutionNom;

    }
    this.checkCNIFileSize = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("GROUPEMENT ", this.groupementInfo)
    if (this.groupementInfo){
      this.region = this.groupementInfo.region
      this.groupementForm.patchValue({
        ...this.groupementInfo
      })

      this.documentConstitutionNom = this.groupementInfo.documentConstitutionNom;
    }
  }

  pre() {
    this.formGieComponent.pre();
  }

  next() {
    this.submitted = true;
    //console.log(this.groupementForm)
    if(this.groupementForm.valid){
      this.groupementInfoChange.emit({...this.groupementForm.getRawValue(), documentConstitutionNom: this.documentConstitutionNom});
      this.formGieComponent.next();
    }
  }

  done() {
    this.formGieComponent.done()
  }

  validator(): boolean {
    if( this.groupementForm.valid){
      return true ;
    }

    return false ;
  }

  convertToString(value : any ){
    return JSON.stringify(value);
  }


  documentCniLoad(event:any){
    let tableau: string[] = ['\'image/jpeg\'','pdf','png','docx','doc','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','jpg','jpeg'];
    this.checkFile = false;
    if(this.checkTypeFile(tableau,event.target.files[0].name.split('.').pop())) {
    // check if file exist
    const [file] = event.target.files;
    if (event.target.files && event.target.files.length) {
      this.checkCNIFileSize = this.checkFileSize.checkSize(file.size, 'notSelfie');
      if (this.checkCNIFileSize) {
        this.groupementForm.patchValue({
          documentConstitutionNom: file,
        })
        // need to run CD since file load runs outside of zone
        this.changeDetector.markForCheck();
        const formData = new FormData();
        formData.append('file', file);
        this.fileService.save(formData, 'CNI').subscribe(
          response => {
            //console.log(response);
            this.documentConstitutionNom = response.reponse
          },
          error => {
            //console.log(error)
          }
        )
      } else {
        console.log("Fichier trop lourd !!!!!");
        this.groupementForm.controls.documentConstitution.setValue('');
      }

    }this.checkFile = false;
    }else{
      this.checkFile = true;
      this.groupementForm.controls.documentConstitution.setValue('');
    }
  }

  onGetZoneGeographique(){
    this.zoneGeographiqueService.getAll().subscribe(
      (response) => {
        this.listeZoneGographique = response;
        response.forEach(value => {
          if (value.typeZone != null) {
            switch (value.typeZone){
              case 'DEPARTEMENT':
                 this.departements.push(value);
                break;
              case 'REGION':this.regions.push(value);
                break
            }
          }
        })
        if(this.groupementInfo){
          if(this.groupementInfo.departement != null){
            console.log(this.groupementInfo.departement)
            this.chargeDepartements(this.groupementInfo.departement);
            this.region = JSON.stringify(this.listeZoneGographique.filter(
              element =>
                element.id == JSON.parse(this.groupementInfo.departement).idParent)[0]);
            this.chargeDepartements(this.region ) ;
          }
        }
      }
    );
  }

  chargeDepartements($event:any){

    let reg = JSON.parse($event);
    if(reg)
    this.departements = this.listeZoneGographique.filter( it => it.idParent == reg.id && it.typeZone =='DEPARTEMENT');

  }
  checkTypeFile(tableau: string[],extension: string ){
    let verity = tableau?.indexOf(extension) !== -1;
    //console.log(verity);
    return verity;
  }
}

