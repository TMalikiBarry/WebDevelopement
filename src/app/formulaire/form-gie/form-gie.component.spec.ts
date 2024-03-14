import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGieComponent } from './form-gie.component';

describe('FormGieComponent', () => {
  let component: FormGieComponent;
  let fixture: ComponentFixture<FormGieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormGieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
