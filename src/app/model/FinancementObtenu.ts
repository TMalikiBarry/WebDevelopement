export class FinancementObtenu{
  id?: number;
  montant?:  number ;
   apport?:  number;

    institutionFinanciere?:string;
 autreInstitutionFinanciere?: string;
   typeCredit?: string;
   dateFinancement ?:  Date;
    tableauAmortissement?: string;
    dateRemboursement ?:  Date;
   statusFinancement?: string;

    tauxInteretAnnuelHT?: number;
    supprime ?: Boolean;
   dateCreation ?:  Date;
  dateModification ?:  Date;
}
