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

// Interface for patient data
interface patientData {
  name: string,
  data: number
}





// Observable for patient data
const getpatientdata: Observable<patientData[]> = of([{
  name: "Treatment", data: 56
}, {
  name: "Check-up", data: 21
}, {
  name: "operation2", data: 15
}, {
  name: "operation2", data: 52
}, {
  name: "operation3", data: 10
}]);

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
  patientDatas1: patientData[] = [];
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


  // Function to calculate percentage based on patient data
  calcpercentage(number: number) {
    var s = 0
    for (let k of this.patientDatas1) {
      s += k["data"]
    }
    return Math.round((number * 100 / s + Number.EPSILON) * 100) / 100
  }

  // Function to set color based on patient data
  color(d: patientData) {
    let c = 0
    let c1 = 0
    for (let k of this.patientDatas1) {
      if (k === d) {
        c1 = c
      } else {
        c++
      }
    }
    return this.colors[c1]
  }
  

  ngOnInit(): void {
    //? INIZILISING THE CURRENTUSER
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

 
  calculateStatusPercentage(patients: patientData[]): patientData[] {
    patients=this.patientDatas1
    const statusCount: patientData[]= [];
  
    // Count the occurrences of each status
    patients.forEach(patient => {
      console.log(statusCount.find(k => k.name==patient.name))
       if(statusCount.find(k => k.name==patient.name)==undefined){
        statusCount.push({
          name:patient.name,
          data:this.countOccurrences(patients,patient)
        })
       }
      
    });
 
  
    return statusCount;
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