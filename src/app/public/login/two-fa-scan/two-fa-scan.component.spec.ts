import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TwoFaScanComponent} from './two-fa-scan.component';

describe('TwoFaScanComponent', () => {
  let component: TwoFaScanComponent;
  let fixture: ComponentFixture<TwoFaScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TwoFaScanComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TwoFaScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
