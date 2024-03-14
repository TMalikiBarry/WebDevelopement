import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GieIdentificationActiviteGroupementComponent } from './gie-identification-activite-groupement.component';

describe('GieIdentificationActiviteGroupementComponent', () => {
  let component: GieIdentificationActiviteGroupementComponent;
  let fixture: ComponentFixture<GieIdentificationActiviteGroupementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GieIdentificationActiviteGroupementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GieIdentificationActiviteGroupementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
