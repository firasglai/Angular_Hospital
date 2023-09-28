import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables, ChartConfiguration } from 'node_modules/chart.js';
import { Observable, of } from 'rxjs';
import { ProfileUser, patientProfile } from 'src/app/models/user-profile';
import { patientService } from 'src/app/services/patientService';
Chart.register(...registerables)

// Interface for patient data
interface patientData {
  name: string,
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
user!:patientProfile
  constructor(private patService:patientService) {
    this.patService.patient.subscribe((k)=>{
      this.user=k 
      for (const k of   this.user.appointments) {
        this.patientDatas1.push(
          {
            name: k["statusAPT"],
            data: 1
          }

        )

      }
            this.sortdetails();
console.log(this.patientDatas1)
    // Call RenderOChart() function
    this.RenderOChart();


    })
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
    // Subscribe to getpatientdata Observable
  

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

  }
  sortdetails() {
    // Calculate the total data
    this.patientDatas1=this.calculateStatusPercentage(this.patientDatas1)
    
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
  var data = [];
  var labels = [];
  for (let k of this.patientDatas1) {
    data.push(k["data"]);
    labels.push(k["name"]);
  }
  const chart = new Chart(this.chartRef.nativeElement, {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [{
        label: 'patients data',
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



}