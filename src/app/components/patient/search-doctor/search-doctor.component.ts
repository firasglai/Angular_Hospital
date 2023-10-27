import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import axios from 'axios';
import { AutocompleteService } from 'src/app/services/autocomplete.service';
import {
  Doctor,
  DoctorServicesService,
} from 'src/app/services/doctor-services.service';
import { patientService, respage } from 'src/app/services/patientService';
import * as L from 'leaflet';
import { patientProfile } from 'src/app/models/user-profile';
import { DatePipe } from '@angular/common';
import { Subscription, take } from 'rxjs';
import { Appoitment } from 'src/app/models/user.model';
import { SpecialtyModel } from 'src/app/models/specialty.model';
import { SpecialtyService } from 'src/app/services/specialty/specialty.service';
import { Doctor as DoctorModel } from 'src/app/models/doctor';
import { DoctorService } from 'src/app/services/doctor/doctor.service';
import { MatDialog } from '@angular/material/dialog';
import { DoctorProfileComponent } from '../modals/doctor-profile/doctor-profile.component';
import { AppointmentBookingComponent } from '../modals/appointment-booking/appointment-booking.component';
import { AnimationOptions } from 'ngx-lottie';

interface citie {
  id: String;
  gov: string;
  deleg: string;
  cite: string;
  zip: string;
}
interface workday {
  name: string;
  shifts: string[];
}
interface done {
  id: string;
  date: string;
  reason: string;
  statusAPT: string;
  patient: patientProfile;
  doctor: Doctor;
}
@Component({
  selector: 'app-search-doctor',
  templateUrl: './search-doctor.component.html',
  styleUrls: ['./search-doctor.component.css'],
})
export class SearchDoctorComponent implements OnInit {

  public lottieConfig: AnimationOptions = {
    path: 'assets/animations/User interface research.json',
    loop: true,
    autoplay: true,
  };
  

  doctorToshow: Doctor | undefined;
  showmap = false;
  currentDate: string;
  currentDateControl!: FormControl;
  currentDateControl2!: FormControl;
  searchTerm: FormControl;
  filteredCities: citie[] = [];
  searchControll: FormControl = new FormControl();
  searchResults: any[] = [];
  searchKeyword: string = '';
  dayss = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  selectedspeciality: SpecialtyModel | undefined;
  private specialties: SpecialtyModel[] = [];
  location!: any;
  isDescriptionOn = false;
  private map!: L.Map;
  map2!: L.Map | undefined;
  private searchControl!: L.Control;
  private marker!: L.Marker;
  private marker2!: L.Marker;
  private circle!: L.Circle;
  issendig = false;
  calendarSelect = false;
  showdoc = false;
  showbook = false;
  maploading = false;
  totalpages = 0;
  pagecounte = 0;
  doctorArray: Doctor[] = [];
  doctors: DoctorModel[] = [];
  circleSize: number = 20000;
  @Input() selectedDate!: Date;
  selectedDate1: string;
  currentMonth!: Date;
  weeks!: Date[][];
  CalendarDiplay1 = true;
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  isselecteddayvalid = false;
  noteController = new FormControl();
  hourcontroller = new FormControl('');
  user!: patientProfile;
  showdone = false;
  resposne: done | undefined;
  usersub: Subscription;
  errorofhour = '';
  //? ANIMATIONS
  showAnimation = true;
  loading = false;

  constructor(
    private datePipe: DatePipe,
    private autocompleteService: AutocompleteService,
    private docservices: DoctorServicesService,
    private patient: patientService,
    private elementRef: ElementRef,
    private specialtyservice: SpecialtyService,
    private doctorService: DoctorService,
    public dialog: MatDialog
  ) {
    this.currentMonth = new Date();
    this.selectedDate1 = new Date().toDateString();
    this.searchControll.valueChanges.subscribe((value: string) => {
      if (value) {
        this.searchKeyword = value;
        this.searchSpecialties();
      } else {
        this.searchResults = [];
      }
    });
    this.currentDate = new Date().toISOString().split('T')[0];
    this.searchTerm = new FormControl('');
    this.currentDateControl = new FormControl(
      new Date().toISOString().split('T')[0]
    );
    const currentDate = new Date(); // Get the current date
    currentDate.setDate(currentDate.getDate() + 7); // Add 7 days to the current date
    this.currentDateControl2 = new FormControl(
      currentDate.toISOString().split('T')[0]
    );

    this.usersub = this.patient.patient.subscribe((k) => {
      this.user = k;
    });
  }
  ngOnInit() {
    this.loadspecialties();
    this.showmap = true;
    this.initializeMap();
    this.initializeMapClickEvent();
    //? RETREIVE PATIENT DOCTORS
    this.patient.getalldoctors(0, 9).subscribe((doctors) => {
      let resu = doctors as unknown as respage;
      this.doctorArray = resu.content;
      this.totalpages = resu.totalPages;
    });
    this.selectedDate = new Date();

  }
  //? LOAD SPECIALITY API CALL
   loadspecialties() {
    this.specialtyservice.getSpecialties().forEach((k) => {
      let arr = k as SpecialtyModel[];
      this.specialties = arr;
    });
  }
  //? SEARCH SPEC BY KEYWORD CALL
  calculateMatchPercentage(source: string, keyword: string): number {
    const sourceWords = source.toLowerCase().split(' ');
    const keywordWords = keyword.toLowerCase().split(' ');

    let matchCount = 0;
    for (const word of sourceWords) {
      for (const keyword of keywordWords) {
        if (word.includes(keyword)) {
          matchCount++;
          break;
        }
      }
    }

    const totalWords = sourceWords.length;
    return (matchCount / totalWords) * 100;
  }
  searchSpecialties(): void {
    this.searchResults = this.specialties.filter((specialty) => {
      const specialtyName = specialty.name.toLowerCase();
      const specialtyDescription = specialty.description.toLowerCase();
      const keyword = this.searchKeyword.toLowerCase();
      const nameMatchPercentage = this.calculateMatchPercentage(
        specialtyName,
        keyword
      );
      if (nameMatchPercentage >= 40) {
        return true;
      }
      return specialtyDescription.includes(keyword);
    });
  }

  clearSelectedSpecialty(): void {  
    this.selectedspeciality = undefined;
    this.searchControll.setValue('');
    this.searchResults = []
  }

  resetSearch(){
    this.doctors = [];
    this.showAnimation = true;
  }


 //? SEARCH DOCTORS BY SPECIALTY
searchDoctorsBySpeciality() {
  if (this.selectedspeciality) {
    const specialityName = this.selectedspeciality.name; 
    console.log("SpecialtyName : "+ specialityName)

    // Hide the Lottie animation first
    this.showAnimation = false;
    this.loading = true;
    // Delay showing the loading spinner by 200 milliseconds
    setTimeout(() => {
      // Show the loading spinner
      this.specialtyservice
        .getDoctorsBySpeciality(specialityName)
        .subscribe((doctors) => {
          console.log("THE DOCTORS HERE :"+ doctors);
          this.doctors = doctors;

          // Hide the loading spinner after a timeout (e.g., 2 seconds)
         this.loading= false 
        });
    }, 1000);
  }
}


  //? VIEW DOCTOR PROFILE DIALOG
  openDialog(doctor:DoctorModel,enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(DoctorProfileComponent, {
      data: {
        doctorName: doctor.fullName,
        doctorAddress: doctor.address,
        doctorEmail: doctor.email,
        doctorPhone: doctor.phone,
        doctorBirthDate: doctor.dateOfBirth
      },
      height:'500px',
      width:'500px',
      enterAnimationDuration,
      exitAnimationDuration
    });
  }
  //? APPOINTMENT BOOKING DIALOG WITH ROUTING
  openBookingDialog(doctor:DoctorModel, enterAnimationDuration: string, exitAnimationDuration: string){
    const dialogRef = this.dialog.open(AppointmentBookingComponent, {
        data: {
          doctorID:doctor.id,
          doctorName: doctor.fullName,
          patientId: 123,
          specialityName: doctor.specialty?.name
        },
        height:'800px',
        width:'800px',
        enterAnimationDuration,
        exitAnimationDuration
    }
    )
  }

  //!DEPRECATED
  unsubscribetodoctor() {
    this.patient
      .unsubscribetodoctor(this.user.id, this.doctorToshow!.id)
      .pipe(take(1))
      .subscribe((k) => {
        let kk = k as unknown as Doctor;
        if (kk) {
          for (let i = 0; i < this.doctorArray.length; i++) {
            if (this.doctorArray[i].id == kk.id) {
              this.doctorArray[i] = kk;
              this.doctorToshow = kk;
            }
          }
        }
      });
  }
  //!DEPRECATED
  subscribetodoctor() {
    this.patient
      .subscribetodoctor(this.user.id, this.doctorToshow!.id)
      .pipe(take(1))
      .subscribe((k) => {
        let kk = k as unknown as Doctor;
        if (kk) {
          for (let i = 0; i < this.doctorArray.length; i++) {
            if (this.doctorArray[i].id == kk.id) {
              this.doctorArray[i] = kk;
              this.doctorToshow = kk;
              console.log();
            }
          }
        }
      });
  }
  //!DEPRECATED
  isubbed() {
    let resulta = false;
    for (let p of this.doctorToshow?.patients!) {
      if (p.id == this.user.id) {
        resulta = true;
      }
    }
    return resulta;
  }
  //!DEPRECATED
  send() {
    if (this.isselecteddayvalid) {
      console.log(!this.patientHaveAppointmentByDate());
      if (this.patientHaveAppointmentByDate()) {
        this.errorofhour = 'you already have an appoitment this date';
      } else {
        this.errorofhour = '';
      }

      if (!this.patientHaveAppointmentByDate()) {
        let date = this.selectedDate;
        date.setHours(parseInt(this.hourcontroller.value!), 0, 0);
        console.log(this.user);
        this.issendig = true;
        this.patient
          .submitappoitment(
            date,
            this.noteController.value,
            this.doctorToshow!,
            this.user
          )
          .pipe(take(1))
          .toPromise()
          .then(
            (k) => {
              let res = k as unknown as done;
              let ress = k as unknown as Appoitment;
              if (res.date) {
                const parsedDate = this.datePipe.transform(
                  res.date,
                  'medium',
                  'local'
                );
                res.date = parsedDate || ''; // Assign the parsed date or an empty string if it's null
              }
              if (ress) {
                this.usersub.unsubscribe();
                this.usersub = this.patient.patient.subscribe((k) => {
                  this.user = k;
                });
              }

              this.resposne = res;
              this.issendig = false;
              this.showdone = true;
              this.showbook = false;
              console.log(res);
              return;
            },
            () => {
              this.issendig = false;

              return;
            }
          );
      }
    }
  }
   //!DEPRECATED
  patientHaveAppointmentByDate() {
    const selectedDate = this.selectedDate;
    selectedDate.setHours(parseInt(this.hourcontroller.value!), 0, 0);

    const appointments = this.user.appointments;
    let res = false;

    for (const appointment of appointments) {
      const appointmentDate = new Date(appointment.date);

      if (
        appointmentDate.getUTCFullYear() === selectedDate.getUTCFullYear() &&
        appointmentDate.getUTCMonth() === selectedDate.getUTCMonth() &&
        appointmentDate.getUTCDate() === selectedDate.getUTCDate() &&
        appointmentDate.getUTCHours() === selectedDate.getUTCHours()
      ) {
        res = true;
      }
    }

    return res;
  }
 //!DEPRECATED
  gethoures() {
    let shift: string[] = [];
    for (let X of this.doctorToshow?.shiftHours!) {
      if (X.days[this.selectedDate.getDay()].selected == true) {
        shift.push(X.start + '/' + X.end);
      }
    }
    let hours = [];

    for (let i = 0; i < shift.length; i++) {
      const interval = shift[i];
      const startHour = parseInt(interval.split('/')[0]);
      const endHour = parseInt(interval.split('/')[1]);

      for (let hour = startHour; hour <= endHour; hour++) {
        hours.push(hour);
      }
    }
    if (!this.hourcontroller.value) {
      this.hourcontroller.setValue(hours[0].toString());
    }
    return hours;
  }
   //!DEPRECATED
  isvalidDay(day: Date) {
    let result = false;
    let dayy = this.dayss[day.getDay()];
    for (let sh of this.doctorToshow!.shiftHours) {
      for (let d of sh.days) {
        if (dayy == d.name && d.selected == true) {
          result = true;
        }
      }
    }

    return result;
  }
 //!DEPRECATED
  openCalendiar() {
    this.calendarSelect = true;
    this.generateCalendar();
  }
   //!DEPRECATED
  closeCalendiar() {
    this.calendarSelect = false;
  }
   //!DEPRECATED
  goToPreviousMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }
 //!DEPRECATED
  goToNextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);

    this.generateCalendar();
  }
   //!DEPRECATED
  checktheday() {
    this.errorofhour = '';

    if (this.isvalidDay(this.selectedDate)) {
      this.isselecteddayvalid = true;
    } else {
      this.isselecteddayvalid = false;
    }
  }
   //!DEPRECATED
  generateCalendar() {
    const firstDayOfMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      0
    );

    const firstDayOfWeek = firstDayOfMonth.getDay();
    const lastDayOfWeek = lastDayOfMonth.getDay();

    const daysInPreviousMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth(),
      0
    ).getDate();
    const daysInCurrentMonth = lastDayOfMonth.getDate();

    const totalDays = firstDayOfWeek + daysInCurrentMonth + (6 - lastDayOfWeek);
    const totalWeeks = Math.ceil(totalDays / 7);

    this.weeks = [];

    let currentDay = 1;
    for (let i = 0; i < totalWeeks; i++) {
      const week: Date[] = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfWeek) {
          const previousMonthDay = new Date(
            this.currentMonth.getFullYear(),
            this.currentMonth.getMonth() - 1,
            daysInPreviousMonth - (firstDayOfWeek - j - 1)
          );
          week.push(previousMonthDay);
        } else if (currentDay <= daysInCurrentMonth) {
          const currentMonthDay = new Date(
            this.currentMonth.getFullYear(),
            this.currentMonth.getMonth(),
            currentDay
          );
          week.push(currentMonthDay);
          currentDay++;
        } else {
          const nextMonthDay = new Date(
            this.currentMonth.getFullYear(),
            this.currentMonth.getMonth() + 1,
            j - lastDayOfWeek
          );
          week.push(nextMonthDay);
        }
      }
      this.weeks.push(week);
    }
    if (this.isvalidDay(this.selectedDate)) {
      this.isselecteddayvalid = true;
    } else {
      this.isselecteddayvalid = false;
    }
  }
 //!DEPRECATED
  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth.getMonth();
  }
 //!DEPRECATED
  isDateSelected(date: Date): boolean {
    if (!this.selectedDate) {
      return false;
    }
    return date.toDateString() === this.selectedDate.toDateString();
  }
 //!DEPRECATED
  selectDate(date: Date) {
    this.selectedDate1 = date.toDateString();
    if (this.isvalidDay(date)) {
      this.isselecteddayvalid = true;
      this.selectedDate = date;
      this.calendarSelect = false;
      this.generateCalendar();
    } else {
      this.isselecteddayvalid = false;
      this.selectedDate = date;

      this.generateCalendar();
    }
  }
   //!DEPRECATED
  convertDateString1(dateString: string): string {
    const dateParts = dateString.split('/');
    const year = dateParts[0];
    const month = this.getMonthName(+dateParts[1]);
    const day = dateParts[2];

    return `${month} ${day}`;
  }
   //!DEPRECATED
  convertDateString(dateString: string): string {
    const dateParts = dateString.split('/');
    const year = dateParts[0];
    const month = this.getMonthName(+dateParts[1]);
    const day = dateParts[2];

    return `${month} ${day} ${year}`;
  }
 //!DEPRECATED
  getMonthName(monthNumber: number): string {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return months[monthNumber - 1];
  }
   //!DEPRECATED
  getworkingDay(d: Doctor) {
    let workingday: workday[] = [];
    for (let i = 0; i < this.dayss.length; i++) {
      workingday.push({
        name: this.dayss[i],
        shifts: [],
      });
    }
    for (let sh of d.shiftHours) {
      for (let dd of sh.days) {
        if (dd.selected == true) {
          let notexist = true;
          for (let iy = 0; iy < workingday.length; iy++) {
            if (workingday[iy].name == dd.name) {
              notexist = false;
              workingday[iy].shifts.push(sh.start + ' - ' + sh.end);
            }
          }
          if (notexist) {
            workingday.push({
              name: dd.name,
              shifts: [sh.start + ' - ' + sh.end],
            });
          }
        }
      }
    }
    return workingday;
  }
   //!DEPRECATED
  toggleShifts(day: string, id: string): void {
    const elementId = `day-${day}-${id}`;
    const element = document.getElementById(elementId);

    if (element) {
      if (element.classList.contains('active')) {
        element.classList.remove('active');
      } else {
        element.classList.add('active');
      }
    }
  }
 //!DEPRECATED
  setmarker(cit: citie) {
    this.maploading = true;
    this.getCoordinates(cit.zip);
    this.searchTerm.setValue(`${cit.gov}, ${cit.deleg}, ${cit.cite}`);
  }
   //!DEPRECATED
  setsize(e: any) {
    this.circleSize = 1000 * parseInt(e.target.value);
    if (this.circle) this.circle.setRadius(this.circleSize);
  }
   //!DEPRECATED
  private initializeMap(): void {
    this.map = L.map(
      this.elementRef.nativeElement.querySelector('#map')
    ).setView([33.81897, 10.16579], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' AppoitmentEase contributors',
    }).addTo(this.map);

    this.map.zoomControl.setPosition('topright');
  }
   //!DEPRECATED
  private initializeMapClickEvent(): void {
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      const targetTagName = (
        event.originalEvent.target as HTMLElement
      ).tagName.toLowerCase();

      // Check if the click originated from the input field or button
      if (targetTagName === 'input' || targetTagName === 'button') {
        return; // Ignore the click
      }

      if (this.marker) {
        this.marker.setLatLng([lat, lng]); // Update marker's location
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.map); // Create a new marker
      }

      if (this.circle) {
        this.circle.setLatLng([lat, lng]);
      } else {
        this.circle = L.circle([lat, lng], { radius: this.circleSize }).addTo(
          this.map
        ); // Create a new circle
      }

      this.saveLocation(lat, lng);
    });
  }
 //!DEPRECATED
  private saveLocation(latitude: number, longitude: number): void {
    // Perform logic to save the location here

    this.location = latitude + ',' + longitude;
  }

  
 //!DEPRECATED
  searchDoctors() {
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const start = new Date(this.currentDateControl.value);
    const end = new Date(this.currentDateControl2.value);
    const timeDifference = Math.abs(end.getTime() - start.getTime());
    const numberOfDays = Math.ceil(timeDifference / millisecondsPerDay) + 1;

    if (numberOfDays >= 7) {
      if (this.location != undefined && this.selectedspeciality == undefined) {
        //search by location
      } else {
        if (
          this.location != undefined &&
          this.selectedspeciality != undefined
        ) {
          //search by location and speciality
        } else {
          //get all
        }
      }
    } else {
      let star;
      let endd;
      let array;
      if (start.getDay() < end.getDay()) {
        star = start.getDay();
        endd = end.getDay();
        array = this.dayss.slice(star, endd + 1);
      } else {
        star = start.getDay();
        endd = end.getDay();
        array = this.dayss.slice(0, endd + 1).concat(this.dayss.slice(star, 7));
      }

      if (this.location != undefined && this.selectedspeciality == undefined) {
        this.patient
          .searchbydateandlocation(
            array,
            this.marker.getLatLng().lat,
            this.marker.getLatLng().lng,
            this.circleSize
          )
          .subscribe((k) => {});
      } else {
        if (
          this.location == undefined &&
          this.selectedspeciality == undefined
        ) {
          //search by date
          this.patient.searchbydate(array).subscribe((k) => {});
        } else {
          //search by date location and speciality
        }
      }
      if (this.selectedspeciality) {
        const specialityName = this.selectedspeciality.name; 
        console.log("SpecialtyName : "+ specialityName)
        this.specialtyservice
          .getDoctorsBySpeciality(specialityName)
          .subscribe((doctors) => {
            console.log("THE DOCTORS HERE :"+ doctors);
            this.doctors = doctors;
          });
      }

      //this.patient.searchbydate(array).subscribe((k)=>{})
    }
  }
 

  stars = [
    { filled: true },
    { filled: false },
    { filled: false },
    { filled: false },
    { filled: false },
  ];
 //!DEPRECATED
  rate(star: any) {
    // Reset all stars' filled status
    this.stars.forEach((s) => (s.filled = false));

    // Fill stars up to the clicked star
    const starIndex = this.stars.indexOf(star);
    for (let i = 0; i <= starIndex; i++) {
      this.stars[i].filled = true;
    }
  }
   //!DEPRECATED
  getmax() {
    return this.currentDateControl.value;
  }
   //!DEPRECATED
  search(): void {
    if (this.searchTerm.value) {
      this.autocompleteService
        .searchCities(this.searchTerm.value)
        .subscribe((cities) => {
          this.filteredCities = cities as citie[];
        });
    } else {
      this.filteredCities = [];
    }
  }

  async getCoordinates(zipcode: string) {
    const query = zipcode;
    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            format: 'json',
            q: query,
            addressdetails: 1,
            countrycodes: 'TN',
          },
        }
      );
      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        const lat = result.lat;
        const lon = result.lon;
        if (this.marker) {
          this.marker.setLatLng([lat, lon]); // Update marker's location
        } else {
          this.marker = L.marker([lat, lon]).addTo(this.map); // Create a new marker
        }

        if (this.circle) {
          this.circle.setLatLng([lat, lon]);
        } else {
          this.circle = L.circle([lat, lon], { radius: this.circleSize }).addTo(
            this.map
          ); // Create a new circle
        }
        this.location = lat + ',' + lon;
        this.map.setView([lat, lon], 10);
      } else {
      }
      this.filteredCities = [];
      this.maploading = false;
    } catch (error) {
      this.maploading = false;
    }
  }
  initmap2() {
    let lat = this.doctorToshow?.lat;
    let lon = this.doctorToshow?.lon;
    if (!this.marker2 || !this.map2) {
      this.map2 = L.map(
        this.elementRef.nativeElement.querySelector('#map2')
      ).setView([lat!, lon!], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' AppoitmentEase contributors',
      }).addTo(this.map2);
      this.map2.zoomControl.setPosition('topright');
      this.marker2 = L.marker([lat!, lon!]).addTo(this.map2);
    } else {
      this.map2.setView([lat!, lon!], 12);
      this.marker2.setLatLng([lat!, lon!]);
    }
  }
  @ViewChild('mySelect') selectElementRef!: ElementRef;
  isSelectOpen: boolean = false;

  onSelectChange(): void {
    this.selectElementRef.nativeElement.blur();
    if (this.patientHaveAppointmentByDate()) {
      this.errorofhour = 'you already an appoitment this date';
    } else {
      this.errorofhour = '';
    }
    this.isSelectOpen = false;
  }

  toggleSelectOpen(): void {
    this.isSelectOpen = !this.isSelectOpen;
    if (this.patientHaveAppointmentByDate()) {
      this.errorofhour = 'you already an appoitment this date';
    } else {
      this.errorofhour = '';
    }
  }
  showcreatedsuccsefully() {}
}
