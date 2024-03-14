import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbGieComponent } from './eb-gie.component';

describe('EbGieComponent', () => {
  let component: EbGieComponent;
  let fixture: ComponentFixture<EbGieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EbGieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EbGieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
