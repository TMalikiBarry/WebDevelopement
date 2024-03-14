import {Component, Input, OnInit} from '@angular/core';
import {Demande} from "../../model/demande";
import {TemplateAF} from "../../model/templateAF";
import {TouchPointService} from "../../services/touch-point/touch-point.service";
import {environment} from "../../../environments/environment";
import {ZoneGeographique} from "../../model/zone-geographique";

@Component({
  selector: 'app-description-template',
  templateUrl: './description-template.component.html',
  styleUrls: ['./description-template.component.scss']
})
export class DescriptionTemplateComponent implements OnInit {

  constructor(private touchPointService: TouchPointService) { }

  @Input() templateEx !: TemplateAF

  key1= true;
  key2= false;
  key3= false;
  key4= false;
  key5= false;
  key6= true;
  demande: any;
  beneficiaire: any;
  template?: TemplateAF | null;
  typeBeneficiaire: string | undefined='';
  listTemplate:any;
  baseUrlFile = environment.baseUrlFile;
  region: ZoneGeographique = new ZoneGeographique();

  ngOnInit(): void {
    if(this.templateEx){
      this.touchPointService.getAllTemplate().subscribe(data => {
        this.listTemplate = data as TemplateAF[]
        this.getTemplate(this.templateEx.demande)
      })
        this.demande = this.templateEx.demande
        this.beneficiaire = this.templateEx.demande?.beneficiaire;
        this.typeBeneficiaire = this.templateEx.demande?.beneficiaire?.typeBeneficiaire
    }
  }

  getTemplate(data: Demande | undefined) {
    for (const tem of this.listTemplate) {
      if(data?.id === tem.demande?.id) {
        console.log(tem)
        this.template = tem
        return true;
      }
    }
    return false;
  }
}
