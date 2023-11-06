import { Component, OnInit, ViewChild } from '@angular/core';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { Router } from '@angular/router';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
import { StatusAPT } from 'src/app/enum/status-apt';
import { Profile } from 'src/app/models/profile';
import { Subject, takeUntil } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  displayedAppointments: Appointment[] = [];
  userProfile: Profile | null = {};
  private unsubscribe$ = new Subject<void>();
  selectedStatus: string | null = null;
  searchTerm: string = '';
  value = 'Clear me';
  searchText = '';

  //initlize Paginator variables
  page = 0;
  pageSize = 5;
  // Inject the MatPaginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private authService: SpringAuthService
  ) {}
  ngOnInit(): void {
    this.authService
      .getActiveUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        ({ currentUser, userDetails }) => {
          if (currentUser) {
            this.getAppoitnments(currentUser.id!);
            if (userDetails) {
              //handle user details
            }
          }
        },
        (error) => {
          console.error('Error getting active user', error);
        }
      );
  }

  getAppoitnments(userId: number) {
    this.appointmentService.getUserAppointments(userId).subscribe(
      (appointments) => {
        this.appointments = appointments;
        this.updateDisplayedAppointments();
      },
      (error) => {
        console.error(
          'Error fetching appointments with status PENDING:',
          error
        );
      }
    );
  }

  //? UPDATING THE DISPLAYED APPOINTMENTS BASED ON PAGINATOR
  updateDisplayedAppointments() {
    const startIndex = this.page * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    if (this.selectedStatus) {
      this.displayedAppointments = this.appointments
        .filter((appointment) => appointment.statusAPT === this.selectedStatus)
        .slice(startIndex, endIndex);
    } else {
      this.displayedAppointments = this.appointments.slice(
        startIndex,
        endIndex
      );
    }
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedAppointments();
  }

  onStatusFilter(status: string | null) {
    this.selectedStatus = status;
    this.updateDisplayedAppointments();
  }

  onSearch() {
    console.log("called");
    console.log("Search Term:", this.searchTerm); // Add this line
  
    if (!this.searchTerm) {
      this.updateDisplayedAppointments();
      return;
    }
  
      this.displayedAppointments = this.appointments.filter(appointment => {
        const doctorFullName = appointment.doctor?.fullName;
      console.log('Doctor Full Name:', doctorFullName);
      return doctorFullName && 
        doctorFullName.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
