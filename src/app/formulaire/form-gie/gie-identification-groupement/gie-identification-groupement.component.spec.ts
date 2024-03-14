import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GieIdentificationGroupementComponent } from './gie-identification-groupement.component';

describe('GieIdentificationGroupementComponent', () => {
  let component: GieIdentificationGroupementComponent;
  let fixture: ComponentFixture<GieIdentificationGroupementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GieIdentificationGroupementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GieIdentificationGroupementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
