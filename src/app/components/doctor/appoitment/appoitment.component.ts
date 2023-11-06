import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { from, take } from 'rxjs';
import { patientService } from 'src/app/services/patientService';
import { Profile } from 'src/app/models/profile';
import { Doctor } from 'src/app/models/doctor';
import { Patient } from 'src/app/models/patient';
import { Appointment } from 'src/app/models/appointment';
import { Subject, takeUntil } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-appoitment',
  templateUrl: './appoitment.component.html',
  styleUrls: ['./appoitment.component.css']
})


export class AppoitmentComponent implements OnInit, AfterViewInit {
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
    private authService: SpringAuthService,
    private toastr: ToastrService
  ) {}

  ngAfterViewInit(): void {
    
  }
 
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
    //! Fix Search Issue
      this.displayedAppointments = this.appointments.filter(appointment => {
        const patientFullName = appointment.patient?.fullName;
      console.log('Doctor Full Name:', patientFullName);
      return patientFullName && 
        patientFullName.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
 
  
}
