import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbEntrepriseComponent } from './eb-entreprise.component';

describe('EbEntrepriseComponent', () => {
  let component: EbEntrepriseComponent;
  let fixture: ComponentFixture<EbEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EbEntrepriseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EbEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
