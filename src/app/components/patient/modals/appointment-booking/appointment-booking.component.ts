import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { Appointment } from 'src/app/models/appointment';
import { taskAppointmentSvg } from 'src/assets/svg/task-appointment';
@Component({
  selector: 'app-appointment-booking',
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css']
})
export class AppointmentBookingComponent implements OnInit{
  appointmentForm: FormGroup;
  selected! : Date | null;
  selectedTime: Date = new Date();
  isMeridian = true;
  loading= false;
  constructor(
    private authservice: SpringAuthService,
    private toasterService: ToastrService,
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AppointmentBookingComponent>
  ){
    console.log('Received AppointmentData:', data); 
    this.appointmentForm = this.fb.group({
      date: [null, Validators.required],
      time: [null, Validators.required],
      reason : [null, Validators.required],
      patientId : [this.data.patientId, Validators.required], // Set initial value
      doctorId : [this.data.doctorId, Validators.required] 
    });
  }

  onSubmit() {
    this.loading = true; // Set loading to true when the request starts
  
    const selectedDate = this.appointmentForm.get('date')?.value;
    const selectedTime = this.appointmentForm.get('time')?.value;
    const patientId = this.appointmentForm.get('patientId')?.value;
    const doctorId = this.appointmentForm.get('doctorId')?.value;
    const selectedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );
    const appointmentData: Appointment = {
      date: selectedDateTime,
      reason: this.appointmentForm.get('reason')?.value,
      doctor: { id: doctorId },
      patient: { id: patientId }
    };
  
    this.appointmentService.saveAppointment(appointmentData).subscribe(
      (response) => {
        // Successful response
        this.toasterService.success('Appointment saved successfully', 'Success');
        console.log('Appointment Data:', response);
        this.loading = false; // Set loading to false when the request is successful
        this.closeDialog(); // Close the dialog after the request is successful
      },
      (error) => {
        // Error handling
        this.toasterService.error('Error saving appointment', 'Error');
        console.error('Error saving appointment:', error);
        this.loading = false; // Set loading to false when there's an error
        this.closeDialog();
      }
    );
  }
  ngOnInit(): void {
      
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

}
