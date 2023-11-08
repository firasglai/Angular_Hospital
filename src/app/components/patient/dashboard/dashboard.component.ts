import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Chart, registerables, ChartConfiguration } from 'node_modules/chart.js';
import { Observable, Subject, of, switchMap, takeUntil } from 'rxjs';
import { ProfileUser, patientProfile } from 'src/app/models/user-profile';
import { patientService } from 'src/app/services/patientService';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
import { Profile } from 'src/app/models/profile';
import { Store, select } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { selectCurrentUser } from 'src/app/store/selectors/user-selector';
import { StatusAPT } from 'src/app/enum/status-apt';
import { AppointmentDetailsComponent } from '../modals/appointment-details/appointment-details.component';
import { MatDialog } from '@angular/material/dialog';

Chart.register(...registerables)


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit , OnDestroy {


  private unsubscribe$ = new Subject<void>();
  
  @ViewChild('chart', { static: true }) chartRef!: ElementRef;
  @ViewChild('chart2', { static: true }) chartRef2!: ElementRef;

  //initilising the userProfile
  userProfile: Profile | null = {};
  userAppointments: Appointment[] = [];
  colors = [
    '#1D3EAF',
    '#FF4C5E',
    '#848FAC'
  ]

  constructor(private patService:patientService,
    private authService: SpringAuthService,
    private appointmentService: AppointmentService,
    private dialog: MatDialog
    ) {
    

    }


      //! to change to get Approved appointments
      getAppoitnments(userId: number) {
        this.appointmentService.getUserAppointments(userId)
          .subscribe(
            (appointments) => {
              this.userAppointments = appointments;
            },
            (error) => {
              console.error('Error fetching appointments with status PENDING:', error);
            }
          );
      }

      getAppointmentsForActiveUser(patientId: number) {
        this.appointmentService.getUpcomingPatientAppointments(patientId)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(
            (appointments) => {
              this.userAppointments = appointments;
              console.log(this.userAppointments);
            },
            (error) => {
              console.error('Error fetching upcoming patient appointments:', error);
            }
          );
      }
      openAppointmentDetailsModal(appointmentData: any, enterAnimationDuration: string, exitAnimationDuration: string): void {
        const dialogRef = this.dialog.open(AppointmentDetailsComponent, {
          width: '800px',
          height: '500px',
          data: { appointment: appointmentData } // Pass the appointment data to the modal
        });
      }
  

  ngOnInit(): void {
    //? INIZILISING THE CURRENTUSER
    this.authService.getActiveUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        ({ currentUser, userDetails }) => {
          if (currentUser) {
            this.userProfile=currentUser;
            this.getAppointmentsForActiveUser(currentUser.id!);
            const patientId = userDetails?.id;
            if (patientId) {
              this.getAppointmentsForActiveUser(patientId);
            }
          }
        },
        (error) => {
          console.error('Error getting active user', error);
        }
      );
  }


 
  
  
  
  countOccurrences(arr: any[], element: any): number {
    return arr.reduce((count, current) => {
      if (current.name === element.name) {
        count++;
      }
      return count;
    }, 0);
  }
  // Function to render doughnut chart
  RenderOChart() {
    const data = [];
    const labels = [];
    const statusCounts:any = {};
  
    // Calculate status counts from userAppointments
   // for (const appointment of this.userAppointments) {
      //const status = appointment.statusAPT;
     // if (statusCounts[status]) {
    //    statusCounts[status]++;
    //  } else {
     //   statusCounts[status] = 1;
    //  }
   // }
  
    // Convert status counts into data and labels arrays
    for (const [status, count] of Object.entries(statusCounts)) {
      labels.push(status);
      data.push(count);
      console.log("***********************"+count)
    }
  
    const chart = new Chart(this.chartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'appointments data',
          data: data,
          backgroundColor: [
            '#1D3EAF',
            '#FF4C5E',
            '#848FAC'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: 70,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  
    // Hide the legend manually if the above code doesn't work
    chart.legend!.options.display = false;
    chart.update();
  }
  
  


ngOnDestroy() {
  this.unsubscribe$.next();
  this.unsubscribe$.complete();
}


}