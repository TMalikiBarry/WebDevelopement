import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IdentificationDirigeantComponent} from './identification-dirigeant.component';

describe('IdentificationDirigeantComponent', () => {
  let component: IdentificationDirigeantComponent;
  let fixture: ComponentFixture<IdentificationDirigeantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IdentificationDirigeantComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificationDirigeantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
