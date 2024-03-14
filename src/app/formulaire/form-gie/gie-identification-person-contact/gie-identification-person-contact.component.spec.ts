import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GieIdentificationPersonContactComponent } from './gie-identification-person-contact.component';

describe('GieIdentificationPersonContactComponent', () => {
  let component: GieIdentificationPersonContactComponent;
  let fixture: ComponentFixture<GieIdentificationPersonContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GieIdentificationPersonContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GieIdentificationPersonContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
