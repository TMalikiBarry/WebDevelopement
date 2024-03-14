import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RegisterFormEntrepriseComponent} from './register-form-entreprise.component';

describe('RegisterFormEntrepriseComponent', () => {
  let component: RegisterFormEntrepriseComponent;
  let fixture: ComponentFixture<RegisterFormEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterFormEntrepriseComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
