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
import {FileService} from 'src/app/services/file/file.service';
import {FormEntrepriseComponent} from "../form-entreprise.component";
import {IndicatifPaysService} from "../../../services/configuration/indicatif-pays/indicatif-pays.service";
import {environment} from "../../../../environments/environment.dev";
import {ActivatedRoute} from "@angular/router";
import {CheckFileSize} from "../../../core/utils/checker/checkFileSize";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-identification-agent',
  templateUrl: './identification-agent.component.html',
  styleUrls: ['./identification-agent.component.scss']
})
export class IdentificationAgentComponent implements OnInit, OnChanges {
  currentStepPosition: number = this.formEntrepriseComponent.currentStepPosition;

  @Input() agent: any;
  @Output() agentChange = new EventEmitter<any>();

  submitted: boolean = false;
  checkFile: boolean = false;
  checkCNIFileSize: boolean = true;

  typePieces: string = '';

  // intialize the FormGroup
  agentContactForm = this.fb.group({
    prenom: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    nom: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    numeroMobile: ['', [Validators.required, Validators.pattern('((\\+|00)?[0-9]{3})?[0-9]{2}[0-9]{7}')]],
    email: ['', Validators.pattern('^((?!^[0-9]+$)[a-zA-Z0-9\\._-]+)@[a-zA-Z]+\\.[a-zA-Z]{2,}$')],
    adressePhysique: ['', Validators.required],
    // age : [''],
    numeroCNI: ['', [Validators.required, Validators.pattern('(([12][0-9]{12,13})|([aA][0-9]{8}))')]],
    documentCNI: ['', Validators.required],
    countryIndicatif: [''],
    // niveauInstruction : ['']
  });

  nomDocumentCNI: any;
  countries: any | null = null;
  baseUrlFile = environment.baseUrlFile;
  beneficiaireId: any;

  ValidatorsFront = Validators;


  constructor(private formEntrepriseComponent: FormEntrepriseComponent,
              private fb: UntypedFormBuilder,
              private changeDetector: ChangeDetectorRef,
              private fileService: FileService,
              private checkFileSize: CheckFileSize,
              private modalService: NzModalService,
              private countriesService: IndicatifPaysService,
              private activateRoute: ActivatedRoute) {
    this.beneficiaireId = this.activateRoute.snapshot.params.beneficiaire;
  }

  ngOnInit(): void {
    this.OnGetCountries();

    if (this.agent) {

      this.agentContactForm.patchValue({
        ...this.agent
      });
      this.nomDocumentCNI = this.agent.nomDocumentCNI;
    } else {

    }

    // manage requirement

    if (
      (localStorage.getItem("radioValue") && localStorage.getItem("radioValue") == "non")
      ||
      (this.agent && this.agent.personAgentSame && this.agent.personAgentSame == false)
    ) {

      console.log('Obligatoire Agent', localStorage.getItem('radioValue'));

      this.agentContactForm.updateValueAndValidity();

      console.log('agent form after update ', this.agentContactForm);

    }
    this.agentContactForm.controls["numeroCNI"].disable();
    this.checkCNIFileSize = true;
  }

  onClikTypePieces($event: any) {
    console.log("Type de event est :" + typeof $event)
    console.log("type de piece choisi : " + $event)
    this.agentContactForm.controls["numeroCNI"].enable();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.agent) {

      this.agentContactForm.patchValue({
        ...this.agent
      });
      this.nomDocumentCNI = this.agent.nomDocumentCNI;
    }
  }

  pre() {
    this.formEntrepriseComponent.pre();
  }

  next() {
    this.submitted = true;
    ////console.log(this.agentContactForm);
    if (this.agentContactForm.valid && this.typePieces != '') {

      this.agentChange.emit({nomDocumentCNI: this.nomDocumentCNI, ...this.agentContactForm.getRawValue()});
      this.formEntrepriseComponent.next();
    }

  }

  convertToString(value: any) {
    return JSON.stringify(value);
  }

  done() {
    this.formEntrepriseComponent.done()
  }

  documentCniLoad(event: any) {
    let tableau: string[] = ['\'image/jpeg\'', 'pdf', 'png', 'jpg', 'jpeg'];
    this.checkFile = false;
    if (this.checkTypeFile(tableau, event.target.files[0].name.split('.').pop())) {
      // check if file exist
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;

        //   this.agentContactForm.patchValue({
        //     documentCNI: file
        //  });


        //   // need to run CD since file load runs outside of zone
        //   this.changeDetector.markForCheck();
        this.checkCNIFileSize = this.checkFileSize.checkSize(file.size, 'notSelfie');
        if (this.checkCNIFileSize) {
          let formData = new FormData();
          formData.append('file', file);
          this.fileService.save(formData, 'cni ').subscribe(
            response => {
              this.nomDocumentCNI = response.reponse;
            }
            ,
            () => {
              ////console.log(error);
              this.agentContactForm.controls.documentCNI.setValue('');
              this.modalService.error({
                nzTitle: 'Erreur de chargement',
                nzContent: 'Veuillez revoir votre connexion'
              });

            }
          )

        } else {
          console.log("Fichier trop lourd !!!!!");
          this.agentContactForm.controls.documentCNI.setValue('');
        }


      }
      this.checkFile = false;
    } else {
      this.checkFile = true;
      this.agentContactForm.controls.documentCNI.setValue('');
    }
  }

  checkTypeFile(tableau: string[], extension: string) {
    return tableau?.indexOf(extension) !== -1;
    ////console.log(verity);
  }

  OnGetCountries() {
    this.countriesService.getCountries().subscribe((response) => {
      this.countries = response.countryPrefix;
    })
  }
}
