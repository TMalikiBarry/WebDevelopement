import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressionBesoinComponent } from './expression-besoin.component';

describe('ExpressionBesoinComponent', () => {
  let component: ExpressionBesoinComponent;
  let fixture: ComponentFixture<ExpressionBesoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpressionBesoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressionBesoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
