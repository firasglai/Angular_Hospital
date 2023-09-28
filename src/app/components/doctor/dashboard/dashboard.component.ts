import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { doc } from 'firebase/firestore';
import { Chart, registerables, ChartConfiguration } from 'node_modules/chart.js';
import { Observable, of } from 'rxjs';
import { Appoitment } from 'src/app/models/user.model';
import { DoctorServicesService } from 'src/app/services/doctor-services.service';
Chart.register(...registerables)

// Interface for patient data
interface patientData {
  name: String,
  data: number
}


// Interface for patient details
interface Patient {
  id: String,
  name: String,
  title: String,
  lastname: String,
  gender: String,
  profilePicture: String
}

// Interface for payment data
interface paymentData {
  patient: Patient,
  appoitment: String,
  Date: String,
  payment: {
    amount: number,
    methode: String
  },
  Statu: String
}

// Observable for last 3 payments data
const last3Payments: Observable<paymentData[]> = of([
  {
    // Payment data for first patient
    patient: {
      id: "#DC216",
      name: "Scott",
      title: "Mr.",
      lastname: "mctominay",
      gender: "male",
      profilePicture: "male.jpg"
    },
    appoitment: "Diabetes Control",
    Date: "Dec 15 2023",
    payment: {
      amount: 200,
      methode: "Credit Card"
    },
    Statu: "Success"
  },
  {
    // Payment data for second patient
    patient: {
      id: "#DC218",
      name: "Alicia",
      lastname: "Brook",
      gender: "female",
      title: "Mrs.",
      profilePicture: "female.jpg"
    },
    appoitment: "Monthly Medical Check-up",
    Date: "Dec 16 2023",
    payment: {
      amount: 200,
      methode: "Credit Card"
    },
    Statu: "Pending"
  },
  {
    // Payment data for third patient
    patient: {
      id: "#DC220",
      name: "Robert",
      lastname: "White",
      title: "Mr.",
      gender: "male",
      profilePicture: "male.jpg"
    },
    appoitment: "Root Canal",
    Date: "Dec 17 2023",
    payment: {
      amount: 200,
      methode: "Google"
    },
    Statu: "Failed"
  }
])

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
export class DashboardComponent implements OnInit {
  @ViewChild('chart', { static: true }) chartRef!: ElementRef;
  @ViewChild('chart2', { static: true }) chartRef2!: ElementRef;
  username = "Yassine Cherni";
  lastPayments: paymentData[] = []
  patientDatas1: patientData[] = [];
  colors = [
    '#1D3EAF',
    '#FF4C5E',
    '#848FAC'
  ]
  selectedDate!:Date
appoitmentList:Appoitment[]=[]
  constructor(private docService:DoctorServicesService,private datePipe:DatePipe) {
    const currentDate = new Date();
    this.selectedDate=currentDate
    const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0);
    const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0, 23, 59, 59);
 
    docService.getAppointmentsByDates(firstDate,lastDate).subscribe((k)=>{
      this.appoitmentList =k as unknown as Appoitment[]
      console.log(this.extractStatusAPT(this.appoitmentList))
      this.RenderOChart2();
      this.RenderOChart()
    })
  }
  thisdayhaveApps(){
    let res = false
    for (let a of this.appoitmentList){
      if(this.isSameDay(a.date.toString())){
        res=true
      }
    }
    return res
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
  
  
  Dtosting(d:string){
    console.log(d)
    const date = new Date(d);
    const formattedDate = this.datePipe.transform(date, 'd MMM yyyy HH:mm');
    return formattedDate
  
  }
  extractStatusAPT(data: any[]): string[] {
    const statusAPTArray: string[] = [];

    data.forEach((item) => {
      statusAPTArray.push(item.statusAPT);
    });

    return statusAPTArray;
  }
  // Function to calculate percentage based on patient data
  calcpercentage(status: string) {
    let totalCount = 0;
    let statusCount = 0;
  
    for (const appointment of this.appoitmentList) {
      if (appointment.statusAPT !== 'CANCELED') {
        totalCount++;
        if (appointment.statusAPT === status) {
          statusCount++;
        }
      }
    }
  
    if (totalCount === 0) {
      return 0;
    }
  
    return Math.round((statusCount / totalCount) * 100);
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
    // Subscribe to getpatientdata Observable
    getpatientdata.subscribe(key => {
      for (const k of key) {
        this.patientDatas1.push(
          {
            name: k["name"],
            data: k["data"]
          }
        )
      }
    });

    // Subscribe to last3Payments Observable
    last3Payments.subscribe(key => {
      for (const k of key) {
        this.lastPayments.push(
          {
            patient: k["patient"],
            appoitment: k["appoitment"],
            Date: k["Date"],
            payment: k["payment"],
            Statu: k["Statu"]
          }
        )
      }
    });
    // Call sortdetails() function
    this.sortdetails();

    // Call RenderOChart() function
  

    // Call RenderOChart2() function

  }

  // Function to sort patientDatas1 array
  sortdetails() {
    this.patientDatas1.sort((a, b) => (a.data < b.data) ? 1 : -1)

    if (this.patientDatas1.length > 3) {
      var other = 0
      for (var i = 2; i < this.patientDatas1.length; i++) {
        other += this.patientDatas1[i].data
      }
      this.patientDatas1 = this.patientDatas1.slice(0, 2)
      this.patientDatas1.push({ name: "others", data: other })
    }

  }
  RenderOChart() {
    let pendingCount = 0;
    let approvedCount = 0;
    let doneCount = 0;
  
    for (const appointment of this.appoitmentList) {
      const status = appointment.statusAPT;
      if (status === 'PENDING') {
        pendingCount++;
      } else if (status === 'APPROVED') {
        approvedCount++;
      } else if (status === 'DONE') {
        doneCount++;
      }
    }
  
    const data = [pendingCount, approvedCount, doneCount];
    const labels = ['PENDING', 'APPROVED', 'DONE'];
  console.log(data)
    const chart = new Chart(this.chartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Appointment Status',
            data: data,
            backgroundColor: [
              '#1D3EAF',
              '#FF4C5E',
              '#848FAC',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: 70,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
  
  
  countComplitedApp(){

  }
  countPendingApp(){
    
  }
  
  RenderOChart2() {
    const dataByDay: { [key: string]: number } = {};
    const labels: string[] = [];
    const currentDate = new Date();
    const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0);
    const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0, 23, 59, 59);
    const currentDay = new Date(firstDate);
  
    while (currentDay <= lastDate) {
      const day = currentDay.toLocaleDateString();
      dataByDay[day] = 0; // Initialize the value as 0
      labels.push(day); // Add the day as a label
      currentDay.setDate(currentDay.getDate() + 1); // Move to the next day
    }
  
    for (const appointment of this.appoitmentList) {
      const day = new Date(appointment.date).toLocaleDateString();
  
      if (dataByDay.hasOwnProperty(day)) {
        dataByDay[day]++; // Increment the value for the appointment day
      }
    }
  
    const datasets = [
      {
        label: 'Appointments',
        data: labels.map((day) => dataByDay[day]),
        fill: false,
        borderColor: '#afcdfddb',
        backgroundColor: '#afcdfddb',
        borderWidth: 2,
        pointRadius: 0, // Set the point radius to 0 to hide the data points
      },
    ];
  
    const chart = new Chart(this.chartRef2.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              maxRotation: 0, // Set the maximum rotation to 0 degrees
              minRotation: 0, // Set the minimum rotation to 0 degrees
            },
          },
          y: {
            grid: {
              drawBorder: false,
              borderDash: [10, 10],
              borderDashOffset: 2,
              tickBorderDash: [2, 2, 2, 2, 2, 2],
            },
            ticks: {
              stepSize: 1, // Ensure the y-axis steps by 1
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
  
  
}