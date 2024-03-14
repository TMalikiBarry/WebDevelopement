import {ChangeDetectorRef, Component, Injectable, OnInit, OnDestroy} from '@angular/core';
import {Demande} from "../../../model/demande";
import {ChartComponent} from "ng-apexcharts";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {AuthService} from "../../../services/security/auth/auth.service";
import {PmoService} from "../../../services/pmo/pmo.service";
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import {ChartOptions} from "../layout/layout.component";
import { InfoSelection } from 'src/app/model/info-selection';
import { UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { Commentaire } from 'src/app/model/commentaire';
import { FileService } from 'src/app/services/file/file.service';
import { DescriptionDemandeComponent } from '../description-demande/description-demande.component';
import { DataService } from 'src/app/services/data_service/data_service';
import { PersonnePMO } from 'src/app/model/personnePMO';
import { FormAjoutUserPMOComponent } from '../form-ajout-utilisateurs/form-ajout-user.component';
import { ModifyUserComponent } from '../modify-user/modify-user.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
// import { AddUserComponent } from '../ajout-user/ajout-user.component';

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<PersonnePMO> | null;
  sortDirections: NzTableSortOrder[];
}

@Component({
  selector: 'app-gestion-user',
  templateUrl: './gestion-user.component.html',
  styleUrls: ['./gestion-user.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class GestionUsersComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription;
  searchValue = '';
  modal: NzModalRef | undefined;
  typeCalled: string='';
  montantOctroye: any;
  visible = false;
  isSpinning = false;
  idPmo: number=0;
  isVisible = false;
  isVisibleError = false;
  nomDocument: any= '';
  currentInfo: InfoSelection= new InfoSelection;
  map = new Map();
  mapBis = new Map();
  listeUsersPMO : any;
  listOfDisplayData:any;
  listOfColumns: ColumnItem[] = [
    {
      name: 'Prénom',
      sortOrder: 'descend',
      sortFn: (a: any, b: any) => a.prenom?.localeCompare(b.prenom || '') || 1,
      // sortFn: null,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Nom',
      sortOrder: 'descend',
      sortFn: (a: any, b: any) => a.nom?.localeCompare(b.nom || '') || 1,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Numéro de téléphone',
      sortOrder: 'descend',
      sortFn: (a: any, b: any) => a.numeroMobile?.localeCompare(b.numeroMobile || '') || 1,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Identifiant',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: any, b: any) => a.acces?.login?.localeCompare(b.acces?.login || '') || 1,
    },
    {
      name: 'Profil',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: any, b: any) => a.acces?.profil?.libelle.localeCompare(b.acces?.profil?.libelle || '') || 1,
    }
  ];

  constructor(private modalService : NzModalService, private data: DataService, private notification : NzNotificationService,
              private authService : AuthService, private fb: UntypedFormBuilder, private fileService : FileService, private changeDetectorRef : ChangeDetectorRef,
              private pmoService:PmoService) {


          if (localStorage.getItem('currentUser')) {
            let user = this.authService.currentUserValue;
            this.idPmo = user.idParent;
            console.log(this.idPmo);
            this.onGetAllUsersPMO();
          }
  }

  ngOnInit(): void {
    this.subscription=this.data.apiResponse.subscribe((data: any) => {
      console.log(data);
      if(data?.trim()=='ok'){
        this.onGetAllUsersPMO();
      }
    });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    //console.log('call babs');
    this.visible = false;
    this.listOfDisplayData = this.listeUsersPMO.filter((item: InfoSelection) => {
      let value = item.demande?.beneficiaire?.id+'';
      return value.indexOf(this.searchValue) !== -1
    });
  }

  expandSet = new Set<string>();
  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  showModalDescriptionDemande(data:InfoSelection): void {
    // this.currentInfo = data;
    this.data.changeMessage(data);
    this.modalService.create({
      nzCancelText: null,
      nzTitle: 'Description demande',
      nzContent: DescriptionDemandeComponent,
      nzWidth: 1000
    });
  }

  addUser(): void {
    this.modalService.create({
      nzCancelText: null,
      nzOkText: null,
      nzTitle: 'Ajout utilisateur',
      nzContent: FormAjoutUserPMOComponent,
      nzWidth: 1000
    });
  }

  modifier(personne: PersonnePMO){
    this.data.updatePersonnePMO(personne);
    this.modal = this.modalService.create({
      nzCancelText: null,
      nzOkText: null,
      nzTitle: 'Modifier utilisateur',
      nzContent: ModifyUserComponent,
      nzWidth: 1000
    });

  }

  closeModal(){
    //console.log(this.modal);
    this.modal?.destroy();
  }

  supprimer(personne:any){
    //console.log(personne);
    this.modalService.confirm({
      nzTitle: 'Suppression utilisateur',
      nzOkText: 'Supprimer',
      nzContent: 'Voulez-vous supprimer cet utilisateur ?',
      nzOnOk: () => {
        personne.supprime = true;
        personne.acces.status = 'INACTIF';
        this.updatePersonne(personne);
      }
    });
  }

  updatePersonne(personne:any){
    //console.log(personne);
    this.isSpinning = true;
    this.pmoService.update(personne).subscribe((response:any) => {
      this.isSpinning = false;
      //console.log(response);
      this.notification.success('Succès', 'Utilisateur supprimé avec succès');
      this.onGetAllUsersPMO();
    },
    (error)=>{
      this.isSpinning = false;
      if(error.error.message){
        this.notification.error('Attention', error.error.message);
      }
      else{
        this.notification.error('Erreur', 'Une erreur est survenue, veuillez reesayer plus tard');
      }
    });
  }

  onGetAllUsersPMO(){
    this.isSpinning = true;
    this.pmoService.getAllUsers(this.idPmo).subscribe((response) => {
      this.isSpinning = false;
      console.log(response);
      this.listeUsersPMO = response;
      this.listOfDisplayData = response;
      this.changeDetectorRef.markForCheck();
      // const demandes: any = [];
      // this.listeDemande.forEach( (item: { demande: any; }) => {
      //   demandes.push(item.demande);
      // })
    },
    (error)=>{
      this.isSpinning = false;
      //console.log(error);
    })
  }

  handleOkError(): void {
    // //console.log('Button ok clicked!');
    this.isVisibleError = false;
  }

  handleCancelError(): void {
    // //console.log('Button cancel clicked!');
    this.isVisibleError = false;
  }

  showModalError(){
    this.isVisibleError = true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
