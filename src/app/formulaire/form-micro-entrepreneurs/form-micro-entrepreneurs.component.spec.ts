import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMicroEntrepreneursComponent } from './form-micro-entrepreneurs.component';

describe('FormMicroEntrepreneursComponent', () => {
  let component: FormMicroEntrepreneursComponent;
  let fixture: ComponentFixture<FormMicroEntrepreneursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMicroEntrepreneursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMicroEntrepreneursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
