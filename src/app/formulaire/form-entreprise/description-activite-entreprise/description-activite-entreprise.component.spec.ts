import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DescriptionActiviteEntrepriseComponent} from './description-activite-entreprise.component';

describe('DescriptionActiviteEntrepriseComponent', () => {
  let component: DescriptionActiviteEntrepriseComponent;
  let fixture: ComponentFixture<DescriptionActiviteEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DescriptionActiviteEntrepriseComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionActiviteEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
