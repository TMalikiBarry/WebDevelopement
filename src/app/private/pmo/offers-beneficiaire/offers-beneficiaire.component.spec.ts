import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffresBeneficiaireComponent } from './offers-beneficiaire.component';

describe('OffresBeneficiaireComponent', () => {
  let component: OffresBeneficiaireComponent;
  let fixture: ComponentFixture<OffresBeneficiaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffresBeneficiaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffresBeneficiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
