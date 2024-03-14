import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapaciteRemboursementComponent } from './capacite-remboursement.component';

describe('CapaciteRemboursementComponent', () => {
  let component: CapaciteRemboursementComponent;
  let fixture: ComponentFixture<CapaciteRemboursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapaciteRemboursementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapaciteRemboursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
