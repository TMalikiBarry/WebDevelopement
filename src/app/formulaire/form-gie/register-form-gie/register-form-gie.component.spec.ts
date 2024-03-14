import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormGieComponent } from './register-form-gie.component';

describe('RegisterFormGieComponent', () => {
  let component: RegisterFormGieComponent;
  let fixture: ComponentFixture<RegisterFormGieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterFormGieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormGieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
