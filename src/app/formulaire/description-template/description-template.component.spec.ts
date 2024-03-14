import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionTemplateComponent } from './description-template.component';

describe('DecriptionTemplateComponent', () => {
  let component: DescriptionTemplateComponent;
  let fixture: ComponentFixture<DescriptionTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
