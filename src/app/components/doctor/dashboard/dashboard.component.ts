import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { doc } from 'firebase/firestore';

import { Chart } from 'chart.js';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { Appoitment as apt } from 'src/app/models/user.model';
import { DoctorServicesService } from 'src/app/services/doctor-services.service';
import { AppointmentService } from 'src/app/services/appointment/appointment.service';
import { Appointment } from 'src/app/models/appointment';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
import { StatusAPT } from 'src/app/enum/status-apt';
import { Profile } from 'src/app/models/profile';


// Interface for patient data
interface patientData {
  name: String;
  data: number;
}

// Interface for patient details
interface Patient {
  id: String;
  name: String;
  title: String;
  lastname: String;
  gender: String;
  profilePicture: String;
}

// Interface for payment data
interface paymentData {
  patient: Patient;
  appoitment: String;
  Date: String;
  payment: {
    amount: number;
    methode: String;
  };
  Statu: String;
}

// Observable for last 3 payments data
const last3Payments: Observable<paymentData[]> = of([
  {
    // Payment data for first patient
    patient: {
      id: '#DC216',
      name: 'Scott',
      title: 'Mr.',
      lastname: 'mctominay',
      gender: 'male',
      profilePicture: 'male.jpg',
    },
    appoitment: 'Diabetes Control',
    Date: 'Dec 15 2023',
    payment: {
      amount: 200,
      methode: 'Credit Card',
    },
    Statu: 'Success',
  },
  {
    // Payment data for second patient
    patient: {
      id: '#DC218',
      name: 'Alicia',
      lastname: 'Brook',
      gender: 'female',
      title: 'Mrs.',
      profilePicture: 'female.jpg',
    },
    appoitment: 'Monthly Medical Check-up',
    Date: 'Dec 16 2023',
    payment: {
      amount: 200,
      methode: 'Credit Card',
    },
    Statu: 'Pending',
  },
  {
    // Payment data for third patient
    patient: {
      id: '#DC220',
      name: 'Robert',
      lastname: 'White',
      title: 'Mr.',
      gender: 'male',
      profilePicture: 'male.jpg',
    },
    appoitment: 'Root Canal',
    Date: 'Dec 17 2023',
    payment: {
      amount: 200,
      methode: 'Google',
    },
    Statu: 'Failed',
  },
]);

// Observable for patient data
const getpatientdata: Observable<patientData[]> = of([
  {
    name: 'Treatment',
    data: 56,
  },
  {
    name: 'Check-up',
    data: 21,
  },
  {
    name: 'operation2',
    data: 15,
  },
  {
    name: 'operation2',
    data: 52,
  },
  {
    name: 'operation3',
    data: 10,
  },
]);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chart2', { static: true }) chartRef2!: ElementRef;
  private unsubscribe$ = new Subject<void>();
  todaysAppointments: Appointment[] = [];
  userAppointments: Appointment[] = [];
  userProfile!: Profile;
  lastPayments: paymentData[] = [];
  patientDatas1: patientData[] = [];
  colors = ['#1D3EAF', '#FF4C5E', '#848FAC'];
  selectedDate!: Date;
  appoitmentList: apt[] = [];
  constructor(
    private docService: DoctorServicesService,
    private datePipe: DatePipe,
    private appointmentService: AppointmentService,
    private authService: SpringAuthService
  ) {
    const currentDate = new Date();
    this.selectedDate = currentDate;
    const firstDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
      0,
      0,
      0
    );
    const lastDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 2,
      0,
      23,
      59,
      59
    );
  }
  thisdayhaveApps() {
    let res = false;
    for (let a of this.appoitmentList) {
      if (this.isSameDay(a.date.toString())) {
        res = true;
      }
    }
    return res;
  }
  isSameDay(d: string) {
    const targetDate = new Date(d);
    const currentDate = new Date();

    return this.isSDay(targetDate, currentDate);
  }

  isSDay(date1: Date, date2: Date) {
    // Extract year, month, and day components from the dates
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();

    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    // Compare year, month, and day components
    return year1 === year2 && month1 === month2 && day1 === day2;
  }
  Dtosting(d: string) {
    console.log(d);
    const date = new Date(d);
    const formattedDate = this.datePipe.transform(date, 'd MMM yyyy HH:mm');
    return formattedDate;
  }
  extractStatusAPT(data: any[]): string[] {
    const statusAPTArray: string[] = [];

    data.forEach((item) => {
      statusAPTArray.push(item.statusAPT);
    });
    return statusAPTArray;
  }
  // Function to calculate percentage based on Appointent data
  calcPercentage(status: string): number {
    const totalAppointments = this.userAppointments.length;
    const filteredAppointments = this.userAppointments.filter(appointment => appointment.statusAPT === status);
    const appointmentsCount = filteredAppointments.length;
  
    return (appointmentsCount / totalAppointments) * 100;
  }


  ngOnInit(): void {
    //? INIZILISING THE CURRENTUSER
    this.authService
      .getActiveUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        ({ currentUser, userDetails }) => {
          if (currentUser) {
            this.userProfile = currentUser;
            this.getTodaysAppointment(currentUser.id!);
            this.getUserAppointments(currentUser.id!);
          }
        },
        (error) => {
          console.error('Error getting active user', error);
        }
      );
     

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  getTodaysAppointment(userId: number) {
    this.appointmentService
      .getUserTodaysAppointments(userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (appointments) => {
          this.todaysAppointments = appointments;
        },
        (error) => {
          console.error('Error fetching Todays doctor appointments:', error);
        }
      );
  }
  getUserAppointments(userId: number) {
    this.appointmentService
      .getUserAppointments(userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (appointments) => {
          this.userAppointments = appointments;
        },
        (error) => {
          console.error('Error fetching appointments:', error);
        }
      );
  }

  RenderChart(){
    new Chart('PieChart', {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  


}
