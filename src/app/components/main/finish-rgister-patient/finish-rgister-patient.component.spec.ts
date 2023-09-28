import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishRgisterPatientComponent } from './finish-rgister-patient.component';

describe('FinishRgisterPatientComponent', () => {
  let component: FinishRgisterPatientComponent;
  let fixture: ComponentFixture<FinishRgisterPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishRgisterPatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishRgisterPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
