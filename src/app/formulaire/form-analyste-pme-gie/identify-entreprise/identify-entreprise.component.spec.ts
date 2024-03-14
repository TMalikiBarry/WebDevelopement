import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifyEntrepriseComponent } from './identify-entreprise.component';

describe('IdentifyEntrepriseComponent', () => {
  let component: IdentifyEntrepriseComponent;
  let fixture: ComponentFixture<IdentifyEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentifyEntrepriseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifyEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
