import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAnalysteMeComponent } from './form-analyste-me.component';

describe('FormAnalysteMeComponent', () => {
  let component: FormAnalysteMeComponent;
  let fixture: ComponentFixture<FormAnalysteMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAnalysteMeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAnalysteMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
