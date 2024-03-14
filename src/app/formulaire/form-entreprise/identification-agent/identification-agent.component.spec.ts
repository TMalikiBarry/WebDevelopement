import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IdentificationAgentComponent} from './identification-agent.component';

describe('IdentificationAgentComponent', () => {
  let component: IdentificationAgentComponent;
  let fixture: ComponentFixture<IdentificationAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IdentificationAgentComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificationAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
