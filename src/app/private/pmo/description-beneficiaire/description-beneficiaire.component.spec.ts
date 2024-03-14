import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionBeneficiaireComponent } from './description-beneficiaire.component';

describe('DescriptionBeneficiaireComponent', () => {
  let component: DescriptionBeneficiaireComponent;
  let fixture: ComponentFixture<DescriptionBeneficiaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionBeneficiaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionBeneficiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
