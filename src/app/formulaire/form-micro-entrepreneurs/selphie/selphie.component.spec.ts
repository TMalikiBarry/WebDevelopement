import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelphieComponent } from './selphie.component';

describe('SelphieComponent', () => {
  let component: SelphieComponent;
  let fixture: ComponentFixture<SelphieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelphieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelphieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
