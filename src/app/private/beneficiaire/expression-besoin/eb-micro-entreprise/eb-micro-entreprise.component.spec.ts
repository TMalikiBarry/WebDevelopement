import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbMicroEntrepriseComponent } from './eb-micro-entreprise.component';

describe('EbMicroEntrepriseComponent', () => {
  let component: EbMicroEntrepriseComponent;
  let fixture: ComponentFixture<EbMicroEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EbMicroEntrepriseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EbMicroEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

