import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionProjetEntrepriseComponent } from './description-projet-entreprise.component';

describe('DescriptionProjetEntrepriseComponent', () => {
  let component: DescriptionProjetEntrepriseComponent;
  let fixture: ComponentFixture<DescriptionProjetEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionProjetEntrepriseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionProjetEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
