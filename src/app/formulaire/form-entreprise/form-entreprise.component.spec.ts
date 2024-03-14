import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormEntrepriseComponent} from './form-entreprise.component';

describe('FormEntrepriseComponent', () => {
  let component: FormEntrepriseComponent;
  let fixture: ComponentFixture<FormEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormEntrepriseComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
