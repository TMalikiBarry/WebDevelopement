import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IdentificationPersonContactComponent} from './identification-person-contact.component';

describe('IdentificationPersonContactComponent', () => {
  let component: IdentificationPersonContactComponent;
  let fixture: ComponentFixture<IdentificationPersonContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IdentificationPersonContactComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificationPersonContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
