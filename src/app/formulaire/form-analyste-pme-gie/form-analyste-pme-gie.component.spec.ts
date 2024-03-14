import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAnalystePmeGieComponent } from './form-analyste-pme-gie.component';

describe('FormAnalystePmeGieComponent', () => {
  let component: FormAnalystePmeGieComponent;
  let fixture: ComponentFixture<FormAnalystePmeGieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAnalystePmeGieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAnalystePmeGieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
