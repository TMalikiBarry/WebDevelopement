import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitesMicroEntrepreneurComponent } from './activites-micro-entrepreneur.component';

describe('ActivitesMicroEntrepreneurComponent', () => {
  let component: ActivitesMicroEntrepreneurComponent;
  let fixture: ComponentFixture<ActivitesMicroEntrepreneurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitesMicroEntrepreneurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitesMicroEntrepreneurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
