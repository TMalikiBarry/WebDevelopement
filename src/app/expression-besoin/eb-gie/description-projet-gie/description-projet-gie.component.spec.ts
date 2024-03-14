import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionProjetGieComponent } from './description-projet-gie.component';

describe('DescriptionProjetGieComponent', () => {
  let component: DescriptionProjetGieComponent;
  let fixture: ComponentFixture<DescriptionProjetGieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionProjetGieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionProjetGieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
