import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PmeSelphieComponent} from './pme-selphie.component';

describe('PmeSelphieComponent', () => {
  let component: PmeSelphieComponent;
  let fixture: ComponentFixture<PmeSelphieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PmeSelphieComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmeSelphieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
