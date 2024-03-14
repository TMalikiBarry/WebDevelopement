import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GieSelphieComponent } from './gie-selphie.component';

describe('GieSelphieComponent', () => {
  let component: GieSelphieComponent;
  let fixture: ComponentFixture<GieSelphieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GieSelphieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GieSelphieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
