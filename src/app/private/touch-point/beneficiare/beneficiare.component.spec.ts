import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiareComponent } from './beneficiare.component';

describe('BeneficiareComponent', () => {
  let component: BeneficiareComponent;
  let fixture: ComponentFixture<BeneficiareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
