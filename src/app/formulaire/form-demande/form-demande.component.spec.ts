import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDemandeComponent } from './form-demande.component';

describe('EbMicroEntrepriseComponent', () => {
  let component: FormDemandeComponent;
  let fixture: ComponentFixture<FormDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDemandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

