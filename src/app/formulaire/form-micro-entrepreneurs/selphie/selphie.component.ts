import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Observable, Subject} from 'rxjs';
import {CheckFileSize} from 'src/app/core/utils/checker/checkFileSize';
import {VerifyValidateService} from 'src/app/services/face-rekognition/verify-validate/verify-validate.service';
import {FileService} from 'src/app/services/file/file.service';
import {environment} from 'src/environments/environment';
import {FormMicroEntrepreneursComponent} from '../form-micro-entrepreneurs.component';
import {AuthService} from "../../../services/security/auth/auth.service";
import {Beneficiaire} from "../../../model/beneficiaire";

@Component({
  selector: 'app-selphie',
  templateUrl: './selphie.component.html',
  styleUrls: ['./selphie.component.scss']
})

export class SelphieComponent implements OnInit {

  constructor(private fb: UntypedFormBuilder,
              private formMicroEntrepreneur: FormMicroEntrepreneursComponent,
              private fileService : FileService ,
              private notificationService : NzNotificationService ,
              private checkFileSize : CheckFileSize,
              private modalService : NzModalService,
              private faceRekognition : VerifyValidateService,
              public auth :AuthService,
              private activatedRoute : ActivatedRoute ) {
                this.beneficiaireId = activatedRoute.snapshot.params.beneficiaire

               }

  @Input() selphieInfo : any ;
  @Output() selphieInfoChange = new EventEmitter<any>();
  @Input() beneficiairetp !: Beneficiaire
  //@Input() beneTP !: Beneficiaire

  beneficiaireId : any ;
  selphieForm = this.fb.group({
    cniRecto : ['',Validators.required ],
    cniVerso:  ['',Validators.required ],
    selphie  : ['',Validators.required ]
  });

  nomDocumentCNIRecto : any ;
  nomDocumentCNIVerso : any ;
  nomDocumentSelphie  : any ;

  fileListRecto: NzUploadFile[] = [];
  fileListVerso: NzUploadFile[] = [];

  listStatusFichier = ['recto' , 'verso' , 'selphie'];
  currentStatusFichier = 'recto' ;

  faceCheckRunning = false ;
  checkFaceOk = false ;

  // treatement function before updating
  beforeUploadRecto = (file: NzUploadFile): boolean => {
    this.fileRecto = file ;
    //console.log(file.originFileObj);
    //console.log(file)
    if (!this.checkFileSize.checkSize(file.size!, 'selfieIdentity')) {
      this.modalService.error({
        nzTitle: 'Erreur sur la taille ',
        nzContent: 'Merci de recharger un fichier de taille inferieure à 10MB'
      });

      return false;
    }
    this.getBase64(this.fileRecto)
    .then(
      (value)=>{
        //console.log(value)
          this.imageRecto = value ;
      }
    )


    this.documentRectoLoad(file);

    return false;
  };

  beforeUploadVerso = (file: NzUploadFile): boolean => {
    this.fileVerso = file ;
    //console.log(file.originFileObj);
    //console.log(file)
    if (!this.checkFileSize.checkSize(file.size!, 'selfieIdentity')) {
      this.modalService.error({
        nzTitle: 'Erreur sur la taille ',
        nzContent: 'Merci de recharger un fichier de taille inferieure à 10MB'
      });

      return false;
    }
    this.getBase64(this.fileVerso)
    .then(
      (value)=>{
          //console.log(value)
          this.imageVerso = value ;
      }
    )

    this.documentVersoLoad(file)
    return false;
  };


  async getImageByIndex(index : any ){

    let value = await this.getBase64(this.savedImages[index])

    return value  ;
  }

  // modal variable
  modalVisible = false
  // modal variable


  // img variables

  // img variables

  selphieCaptured = false ;
  srcValidation : any ;
  savedImages : any[] =[];
  fileRecto : any ;
  fileVerso : any ;

  imageSelphie : any;
  imageRecto : any ;
  imageVerso : any ;

  currentStepPosition: number = this.formMicroEntrepreneur.currentStepPosition;

  // toggle webcam on/off
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId?: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage?: WebcamImage ;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();


  public ngOnInit(): void {

    if (this.beneficiairetp?.id) {
      this.beneficiaireId = this.beneficiairetp.id
    }

    if(this.selphieInfo){

      ({nomDocumentCNIRecto : this.nomDocumentCNIRecto ,
        nomDocumentCNIVerso : this.nomDocumentCNIVerso ,
        nomDocumentSelphie : this.nomDocumentSelphie   ,
        imageRecto : this.imageRecto,
        imageVerso : this.imageVerso,
        imageSelphie : this.imageSelphie} = this.selphieInfo) ;

        //console.log(this.imageRecto)
    }
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    this.selphieCaptured = true ;
    this.showWebcam = !this.showWebcam ;
  }

  public toggleWebcam(): void {
    this.modalVisible = true ;
    this.showWebcam = true ;

  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.srcValidation = this.webcamImage.imageAsDataUrl ;
    //console.log(this.webcamImage.imageAsDataUrl)
    //console.log()
    //console.log(webcamImage);


  }

  validateCapture(){
    // save image
    this.checkFaceOk =false ;
    //console.log(this.dataURItoBlob(this.webcamImage?.imageAsDataUrl , 'test'))
    this.savedImages[0] = this.dataURItoBlob(this.webcamImage?.imageAsDataUrl , 'test');
    //console.log(this.savedImages)

    if (!this.checkFileSize.checkSize(this.savedImages[0].size!, 'selfieIdentity')) {
      this.modalService.error({
        nzTitle: 'Erreur sur la taille ',
        nzContent: 'Merci de recharger un fichier de taille inferieure à 10MB'
      });

      return;
    }


    this.documentSelphieLoad(this.savedImages[0]);
    // save image
    this.showWebcam = false ;
    this.modalVisible = false ;
    this.selphieCaptured = false ;

    this.getBase64(this.savedImages[0])
    .then(
      (value)=>{
          this.imageSelphie = value ;
      }
    )

  }

  cancelCapture(){

    this.showWebcam = true ;
    this.selphieCaptured = false ;

  }

  public cameraWasSwitched(deviceId: string): void {
    //console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }


  // modal function

  handleOk(): void {
    //console.log('Button ok clicked!');
    this.modalVisible = false;
    this.showWebcam = false ;

    this.formMicroEntrepreneur.next();

  }

  handleCancel(): void {
    //console.log('Button cancel clicked!');
    this.modalVisible = false;
    this.showWebcam = false ;

  }

  // navigation function

  next(){
    // temporary
    if(this.nomDocumentCNIRecto && this.nomDocumentSelphie && this.nomDocumentCNIVerso){

      this.selphieInfoChange.emit({nomDocumentCNIRecto : this.nomDocumentCNIRecto ,
                                   nomDocumentCNIVerso : this.nomDocumentCNIVerso ,
                                   nomDocumentSelphie : this.nomDocumentSelphie   ,
                                   imageRecto : this.imageRecto,
                                   imageVerso : this.imageVerso,
                                   imageSelphie : this.imageSelphie})


      if ((this.auth.getRole()=='AGENT_INITIATEUR')){
          this.formMicroEntrepreneur.sendMeInfoUpdate();
        return;
      }

      if ((this.beneficiaireId === undefined)){
        this.formMicroEntrepreneur.next();
      }else {
        console.log("=== MAJ ===")
        this.formMicroEntrepreneur.sendMeInfoUpdate();
        //this.notificationService.success('Succés' , 'Vos informations personnelles ont été mis à jour avec succés')
      }


     // this.formMicroEntrepreneur.next();

    }

    else
    {

      this.notificationService.error('Erreur' , 'Merci de charger toutes les piéces demandées sur la page ')
    }

  }

  pre(){
    this.formMicroEntrepreneur.pre()
  }

  done(){}


  // method for transformation of url image to FIle



   dataURLtoFile(dataurl : any , filename : string ) {
    let arr : any[] = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length ;
    let u8arr = new Uint8Array(n);
    let completeFilename =filename+"."+(mime.slice(mime.indexOf('/')+1))

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], completeFilename, {type:mime});
  }

   dataURItoBlob(dataURI : any , filename : string ) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new File([ab], filename ,  {type: mimeString});


  }

  // method for transformation of url image to FIle



  getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  documentRectoLoad(event:any){


    // check if file exist
    if(event) {
      const file = event

      //console.log(file.size)
      // this.personContactForm.patchValue({
      //   documentCNI: file
      // });

      // // need to run CD since file load runs outside of zone
      // this.changeDetector.markForCheck();
      const formData = new FormData();
      formData.append('file' , file );

      this.fileService.save(formData, 'RECTO').subscribe(
        response => {
          //console.log(response);
          this.nomDocumentCNIRecto = response.reponse;
        }
        ,
        error=>{
          //console.log(error);
        }
      )
    }
  }

  // verso

  documentVersoLoad(event:any){


    // check if file exist
    if(event) {
      const file = event
      //console.log(file.size)
      //console.log( file.size * 0.000001)
      // this.personContactForm.patchValue({
      //   documentCNI: file
      // });

      // // need to run CD since file load runs outside of zone
      // this.changeDetector.markForCheck();
      const formData = new FormData();
      formData.append('file' , file );

      this.fileService.save(formData, 'VERSO').subscribe(
        response => {
          //console.log(response);
          this.nomDocumentCNIVerso = response.reponse;
        }
        ,
        error=>{
          //console.log(error);
        }
      )
    }
  }

  // selphie

  documentSelphieLoad(event:any){


    // check if file exist
    if(event) {
      const file = event

      // this.personContactForm.patchValue({
      //   documentCNI: file
      // });

      // // need to run CD since file load runs outside of zone
      // this.changeDetector.markForCheck();
      const formData = new FormData();
      formData.append('file' , file );

      if(environment.faceRekognition){
        this.faceCheckRunning =true ;

        this.faceRekognition.verifyValidate(formData).subscribe(
          response => {

            // send notification to user
            this.checkFaceOk = true ;




            // save image to the suqali db
            this.fileService.save(formData, 'SELPHIE').subscribe(
              response => {
                //console.log(response);
                this.nomDocumentSelphie= response.reponse;
                this.faceCheckRunning =false ;
              }
              ,
              error=>{
                //console.log(error);
              }
            )

          },
          error =>{
            this.modalService.error({
              nzTitle: "Reconnaissance Faciale ",
              nzContent: error.error.errorMessage
            }
            );
            this.faceCheckRunning =false ;
          }
        );
      }
      else{
        this.faceCheckRunning =true ;
        this.fileService.save(formData, 'SELPHIE').subscribe(
          response => {
            //console.log(response);
            this.nomDocumentSelphie= response.reponse;
            this.faceCheckRunning =false ;
          }
          ,
          error=>{
            //console.log(error);
            this.faceCheckRunning =false ;
          }
        )
      }


    }
  }
}
