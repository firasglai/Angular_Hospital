import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishRgisterDoctorComponent } from './finish-rgister-doctor.component';

describe('FinishRgisterDoctorComponent', () => {
  let component: FinishRgisterDoctorComponent;
  let fixture: ComponentFixture<FinishRgisterDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishRgisterDoctorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishRgisterDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
