import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersBeneficiaireComponent } from './beneficiaire-users.component';

describe('UsersBeneficiaireComponent', () => {
  let component: UsersBeneficiaireComponent;
  let fixture: ComponentFixture<UsersBeneficiaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersBeneficiaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersBeneficiaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
