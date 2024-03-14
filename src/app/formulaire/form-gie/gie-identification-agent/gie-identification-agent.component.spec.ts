import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GieIdentificationAgentComponent } from './gie-identification-agent.component';

describe('GieIdentificationAgentComponent', () => {
  let component: GieIdentificationAgentComponent;
  let fixture: ComponentFixture<GieIdentificationAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GieIdentificationAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GieIdentificationAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
