import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApropossecteurComponent } from './apropossecteur.component';

describe('ApropossecteurComponent', () => {
  let component: ApropossecteurComponent;
  let fixture: ComponentFixture<ApropossecteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApropossecteurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApropossecteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
