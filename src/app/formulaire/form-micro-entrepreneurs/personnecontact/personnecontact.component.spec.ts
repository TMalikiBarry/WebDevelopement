import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnecontactComponent } from './personnecontact.component';

describe('PersonnecontactComponent', () => {
  let component: PersonnecontactComponent;
  let fixture: ComponentFixture<PersonnecontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonnecontactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnecontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
