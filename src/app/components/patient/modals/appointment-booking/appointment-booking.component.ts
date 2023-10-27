import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
@Component({
  selector: 'app-appointment-booking',
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css']
})
export class AppointmentBookingComponent implements OnInit{

  selected! : Date | null;
  constructor(
    private authservice: SpringAuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AppointmentBookingComponent>
  ){

  }
  ngOnInit(): void {
      
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

}
