import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeFinancementComponent } from './demande-financement.component';

describe('DemandeFinancementComponent', () => {
  let component: DemandeFinancementComponent;
  let fixture: ComponentFixture<DemandeFinancementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeFinancementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeFinancementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
