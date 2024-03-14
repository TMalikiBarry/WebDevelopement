import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifyEntrepreneurComponent } from './identify-entrepreneur.component';

describe('IdentifyEntrepreneurComponent', () => {
  let component: IdentifyEntrepreneurComponent;
  let fixture: ComponentFixture<IdentifyEntrepreneurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentifyEntrepreneurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifyEntrepreneurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
