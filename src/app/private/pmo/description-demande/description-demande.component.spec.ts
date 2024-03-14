import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionDemandeComponent } from './description-demande.component';

describe('DescriptionDemandeComponent', () => {
  let component: DescriptionDemandeComponent;
  let fixture: ComponentFixture<DescriptionDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionDemandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
