import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Observable, Subject} from 'rxjs';
import {CheckFileSize} from 'src/app/core/utils/checker/checkFileSize';
import {VerifyValidateService} from 'src/app/services/face-rekognition/verify-validate/verify-validate.service';
import {FileService} from 'src/app/services/file/file.service';
import {environment} from 'src/environments/environment';
import {FormGieComponent} from '../form-gie.component';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../services/security/auth/auth.service";
import {Beneficiaire} from "../../../model/beneficiaire";

@Component({
  selector: 'app-gie-selphie',
  templateUrl: './gie-selphie.component.html',
  styleUrls: ['./gie-selphie.component.scss']
})
export class GieSelphieComponent implements OnInit {
  beneficiaireId: any;

  constructor(private fb :UntypedFormBuilder,
              private fileService : FileService ,
              private notificationService : NzNotificationService,
              private formGie : FormGieComponent,
              private checkFileSize : CheckFileSize,
              private modalService : NzModalService,
              private faceService : VerifyValidateService,
              public auth :AuthService,
              private activatedRoute: ActivatedRoute) {
    this.beneficiaireId = activatedRoute.snapshot.params.beneficiaire
  }

  @Input() beneficiairetp !: Beneficiaire
  @Input() selphieInfo : any ;
  @Output() selphieInfoChange = new EventEmitter<any>();

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

  checkFaceRunning = false ;
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
  fallback ='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==';

// img variables

  selphieCaptured = false ;
  srcValidation : any ;
  savedImages : any[] =[];
  fileRecto : any ;
  fileVerso : any ;

  imageSelphie : any;
  imageRecto : any ;
  imageVerso : any ;

  currentStepPosition: number = this.formGie.currentStepPosition;

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
    console.log(this.beneficiairetp)
    if (this.beneficiairetp?.id){
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
    this.checkFaceOk = false ;
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
//this.formGie.next();

      if ((this.auth.getRole()=='AGENT_INITIATEUR')){
          this.formGie.sendGieInfoUpdate();
        return;
      }

      if (this.beneficiaireId === undefined){
        this.formGie.next();
      }else {
        console.log("=== MAJ ===")
        this.formGie.sendGieInfoUpdate();
      }
  }
  else
{

  this.notificationService.error('Erreur' , 'Merci de charger toutes les piéces demandées sur la page ')
}

}

pre(){
  this.formGie.pre()
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
      this.checkFaceRunning = true ;
      this.faceService.verifyValidate(formData).subscribe(
        response => {

          // send notification to user
          this.checkFaceOk = true ;


          // save image to the TouchFinance db
          this.fileService.save(formData, 'SELPHIE').subscribe(
            response => {
              //console.log(response);
              this.nomDocumentSelphie= response.reponse;
              this.checkFaceRunning = false ;

            }
            ,
            error=>{
              //console.log(error);
              this.checkFaceRunning = false ;

            }
          )

        },
        error =>{
          this.modalService.error({
              nzTitle: "Reconnaissance Faciale ",
              nzContent: error.error.errorMessage
            }
          );
          this.checkFaceRunning = false ;

        }
      );
    }
    else{
      this.checkFaceRunning = true ;

      this.fileService.save(formData, 'SELPHIE').subscribe(
        response => {
          //console.log(response);
          this.nomDocumentSelphie= response.reponse;
          this.checkFaceRunning = false ;

        }
        ,
        error=>{
          //console.log(error);
          this.checkFaceRunning =false ;

        }
      )
    }


  }
}


}
