import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { Router } from '@angular/router';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
import { StatusAPT } from 'src/app/enum/status-apt';
import { Profile } from 'src/app/models/profile';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent  implements OnInit{
  appointments: Appointment[] = [];
  userProfile: Profile | null = {};
  private unsubscribe$ = new Subject<void>();
  
  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private authService: SpringAuthService,
  ){

  }
  ngOnInit(): void {
    this.authService.getActiveUser()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
      ({ currentUser, userDetails }) => {
        if (currentUser) {
          this.userProfile = currentUser;
          console.log("this is the user id: " + this.userProfile.id);
    
          if (userDetails) {
            // Handle userDetails if needed
          }
        }
      },
      (error) => {
        console.error('Error getting active user', error);
      }
    );
    const userId = this.userProfile?.id ;
    this.getAppoitnments(userId!);
  }

  getAppoitnments(userId: number) {
    this.appointmentService.getUserAppointments(userId)
      .subscribe(
        (appointments) => {
          this.appointments = appointments;
        },
        (error) => {
          console.error('Error fetching appointments with status PENDING:', error);
        }
      );
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
