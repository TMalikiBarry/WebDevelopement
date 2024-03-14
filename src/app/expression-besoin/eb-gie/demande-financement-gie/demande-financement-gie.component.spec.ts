import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeFinancementGieComponent } from './demande-financement-gie.component';

describe('DemandeFinancementGieComponent', () => {
  let component: DemandeFinancementGieComponent;
  let fixture: ComponentFixture<DemandeFinancementGieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeFinancementGieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeFinancementGieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
