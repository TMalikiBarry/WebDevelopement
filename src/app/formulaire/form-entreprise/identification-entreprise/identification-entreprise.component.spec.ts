import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IdentificationEntrepriseComponent} from './identification-entreprise.component';

describe('IdentificationEntrepriseComponent', () => {
  let component: IdentificationEntrepriseComponent;
  let fixture: ComponentFixture<IdentificationEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IdentificationEntrepriseComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificationEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
