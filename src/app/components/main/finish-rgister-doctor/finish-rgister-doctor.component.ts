import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, PatternValidator, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { control, DomUtil } from 'leaflet';
import { geocode } from 'opencage-api-client';
import { User } from 'src/app/models/user.model';
import { Doctor, DoctorServicesService, specialty } from 'src/app/services/doctor-services.service';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
interface Day {
  name: string,
  selected: boolean
}
interface ShiftHours {
  name: string,
  start: string; // Start time of the shift (e.g., "9:00 AM")
  end: string; // End time of the shift (e.g., "5:00 PM")
  days:Day[],
  errors:string[]
}
@Component({
  selector: 'app-finish-rgister-doctor',
  templateUrl: './finish-rgister-doctor.component.html',
  styleUrls: ['./finish-rgister-doctor.component.css']
})
export class FinishRgisterDoctorComponent implements OnInit {
  continue=false
  private map!: L.Map;
  private searchControl!: L.Control;
  private marker!: L.Marker;
  private resultsContainer!: HTMLDivElement;
  private specialitise: specialty[] = []
  counter=1
  searchControll: FormControl = new FormControl();
  searchKeyword: string = '';
  searchResults: any[] = [];
  isDescriptionOn = false
  selecetedspeciality: specialty | undefined
  nameControll: FormControl = new FormControl();
  lastnameControll: FormControl = new FormControl();
  descriptionControll: FormControl = new FormControl();
  hours: string[] = [];

  workShifts: ShiftHours[] = []
  emailPattern: RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  dayss = [
    'Sunday',
  'Monday', 
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday', 
  'Saturday'
  ];
  
  emailControll: FormControl = new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]);
  phoneControll: FormControl = new FormControl();
  nameerror = ""
  lastnameerror = ""
  decriptionerror = ""
  emailerror = ""
  phoneerror = ""
  specialityerror = ""
  phoneNumber: string = '';
  locationerror = ""
  onInputChange() {
    const digitsOnly = this.phoneNumber.replace(/\D/g, '');

    if (digitsOnly.length > 8) {
      this.phoneNumber = digitsOnly.slice(0, 8);
    }

    if (digitsOnly.length === 0) {
      this.phoneerror = '';
    } else if (digitsOnly.length < 8) {
      this.phoneerror = 'Please enter a valid phone number: length should be 8 digits';
    } else {
      this.phoneerror = '';
    }
  }
  constructor(private elementRef: ElementRef, private docservices: DoctorServicesService, private auth: SpringAuthService) {
    if (auth.user.user_status == "done") {
      window.location.href = "doctor"
    }
    this.searchControll.valueChanges.subscribe((value: string) => {
      this.searchKeyword = value;
      this.searchSpecialties();
    });
    this.searchControll.setValue('')
    this.nameControll.valueChanges.subscribe((value: string) => {
      this.nameerror = ""
      if (value.length > 0 && value.length < 3) {
        this.nameerror = "Please enter a valid name: length more than 2 characters"
      }
      if (value.length > 0 && !/^[a-zA-Z]+$/.test(value)) {
        this.nameerror = "Please enter a valid name: no special characters"
      }
    })
    this.lastnameControll.valueChanges.subscribe((value: string) => {
      this.lastnameerror = ""
      if (value.length > 0 && value.length < 3) {
        this.lastnameerror = "Please enter a valid last name: length more than 2 characters"
      }
      if (value.length > 0 && !/^[a-zA-Z]+$/.test(value)) {
        this.lastnameerror = "Please enter a valid last name: no special characters or numbers"
      }
    })
    this.descriptionControll.valueChanges.subscribe((value: string) => {
      this.decriptionerror = ""
      if (value.length < 15 || value.length > 250) {
        this.decriptionerror = "Please enter a valid description: length should more than characters"
      }
      if (value.length > 250) {
        this.decriptionerror = "Please enter a valid description: length MAX 250 characters"
      }
    })
    this.phoneControll.valueChanges.subscribe((value: string) => {
      this.phoneerror = "";

      if (value.length > 0 && value.length < 8) {
        this.phoneerror = "Please enter a valid phone number: length should be 8 digits";
      }
      if (value.length > 0 && !/^\d+$/.test(value)) {
        this.phoneerror = "Please enter a valid phone number: only digits are allowed";
      }
      if (value.length > 8) {
        this.phoneerror = "Please enter a valid phone number: length should be 8 digits";
      }
    });
    this.emailControll.valueChanges.subscribe((value: string) => {

      this.emailerror = "";

      if (this.emailControll.invalid) {
        this.emailerror = "Please enter a valid email adress";
      }

    });


  }

  ngOnInit(): void {
    this.initializeMap();
    this.initializeSearchControl();
    this.initializeMapClickEvent()
    this.loadspecialties()
    this.generateHours();
    this.addShift()
  }
  addShift() {
    let length = this.workShifts.length
    if (length < 4) {
      let newc: ShiftHours = {
        name: "Shift " + (this.counter ),
        start: "08",
        end: "12",
        days:[
          { name: 'Sunday', selected: false },
          { name: 'Monday', selected: false },
          { name: 'Tuesday', selected: false },
          { name: 'Wednesday', selected: false },
          { name: 'Thursday', selected: false },
          { name: 'Friday', selected: false },
          { name: 'Saturday', selected: false }
        ],
        errors:[]
      }   
       this.workShifts.push(newc)
    }
    this.counter++
  }
  generateHours() {
    for (let i = 1; i <= 12; i++) {
      const hour = i.toString().padStart(2, '0');
      this.hours.push(hour);
    }
    for (let i = 1; i <= 12; i++) {
      const hour = (i + 12).toString().padStart(2, '0');
      this.hours.push(hour);
    }
  }


  private initializeMap(): void {
    this.map = L.map(this.elementRef.nativeElement.querySelector('#map')).setView([33.81897, 10.16579], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' AppoitmentEase contributors'
    }).addTo(this.map);

    this.map.zoomControl.setPosition('topright')
  }

  private initializeSearchControl(): void {
    const searchContainer = DomUtil.create('div', '');
    const form = document.createElement('form');
    form.style.border = "0"
    const input = document.createElement('input');
    const submitBtn = document.createElement('button');
    this.resultsContainer = document.createElement('div');
    this.resultsContainer.style.marginTop = "20"
    input.id = "searchtext"
    input.type = 'text';
    input.placeholder = 'Search location...';
    input.addEventListener('input', (event) => {
      const location = (event.target as HTMLInputElement).value;

      if (location.length > 2) {
        this.searchLocation(location);
      } else {
        this.clearResults();
        form.style.border = "0"
      }
    });

    submitBtn.type = 'submit';
    submitBtn.innerText = 'Go';
    submitBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const location = input.value;
      if (location.length > 2) {
        this.searchLocation(location);

      } else {
        this.clearResults();
        form.style.border = "0"
      }
    });

    form.appendChild(input);
    form.appendChild(submitBtn);
    searchContainer.appendChild(form);
    searchContainer.appendChild(this.resultsContainer);

    this.searchControl = control.attribution({ position: 'topleft' });
    this.searchControl.onAdd = () => searchContainer;
    this.searchControl.addTo(this.map);
  }

  private searchLocation(location: string): void {
    const apiKey = '3d8b2d4a994743fbb991cf6d159fbfd8';

    geocode({ q: location, key: apiKey })
      .then((response) => {
        const results = response.results;
        if (response.results) {
          this.displayResults(results);

        } else {
          this.clearResults();
        }

      })
      .catch((error) => {
        this.clearResults();
        console.log('Geocoding error:', error);
      });
  }

  private displayResults(results: any[]): void {
    this.clearResults();

    results.forEach((result) => {
      this.resultsContainer.style.border = "1px black solid"
      const option = document.createElement('div');
      option.innerText = result.formatted;
      option.classList.add('search-options');
      option.style.background = "white"
      option.addEventListener('click', () => {
        const latitude = result.geometry.lat;
        const longitude = result.geometry.lng;
        this.map.setView([latitude, longitude], 11);
        let inp = document.getElementById('searchtext') as HTMLInputElement
        inp.value = ""
        this.clearResults();
      });

      this.resultsContainer.appendChild(option);
    });
    if (results.length == 0) {
      this.resultsContainer.style.borderColor = "transparent"
    }
    console.log(results)
  }

  private clearResults(): void {
    while (this.resultsContainer.firstChild) {
      this.resultsContainer.removeChild(this.resultsContainer.firstChild);
    }
    this.resultsContainer.style.border = "0"
  }
  private initializeMapClickEvent(): void {
    this.map.on('click', (event) => {
      const { lat, lng } = event.latlng;
      // Check if the click originated from the input field
      console.log((event.originalEvent.target as HTMLElement).tagName.toLowerCase())
      const isClickFromInput = (event.originalEvent.target as HTMLElement).tagName.toLowerCase() === 'input'
      if (isClickFromInput) {
        return; // Ignore the click
      }
      const isClickFromInputb = (event.originalEvent.target as HTMLElement).tagName.toLowerCase() === 'button'
      if (isClickFromInputb) {
        return; // Ignore the click
      }
      if (this.marker) {
        this.marker.setLatLng([lat, lng]); // Update marker's location
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.map); // Create a new marker
      }
      this.locationerror = ""
      this.clearResults();
      this.saveLocation(lat, lng);
    });
  }

  private saveLocation(latitude: number, longitude: number): void {
    // Perform logic to save the location here
    console.log('Location saved:', latitude, longitude);
  }
  loadspecialties() {
    this.docservices.getallspecialities().forEach((k) => {
      let arr = k as specialty[]
      this.specialitise = arr

    })
  }

  searchSpecialties(): void {
    console.log(this.searchResults)
    this.searchResults = this.specialitise.filter(specialty => {
      const specialtyName = specialty.name.toLowerCase();
      const specialtyDescription = specialty.description.toLowerCase();
      const keyword = this.searchKeyword.toLowerCase();

      const nameMatchPercentage = this.calculateMatchPercentage(specialtyName, keyword);
      if (nameMatchPercentage >= 40) {
        return true;
      }

      return specialtyDescription.includes(keyword);
    });
    console.log(this.searchResults)
  }

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

  checkinputs() :boolean{
    let result = true

    if (this.nameControll.value) {

      this.nameerror = ""
      if (this.nameControll.value.length > 0 && this.nameControll.value.length < 3) {
        this.nameerror = "Please enter a valid name: length more than 2 characters"
        result = false;
      }
      if (this.nameControll.value.length > 0 && !/^[a-zA-Z]+$/.test(this.nameControll.value)) {
        this.nameerror = "Please enter a valid name: no special characters"
        result = false;
      }
    } else {
      result = false;
      this.nameerror = "Please enter name"
    }




    if (this.lastnameControll.value) {
      this.lastnameerror = ""

      if (/^[a-zA-Z]+$/.test(this.lastnameControll.value)) {
        if (this.lastnameControll.value.length > 0 && this.lastnameControll.value.length < 3) {
          result = false;
          this.lastnameerror = "Please enter a valid last name: length more than 2 characters"
        }
      } else {
        if (this.lastnameControll.value.length > 0 && !/^[a-zA-Z]+$/.test(this.lastnameControll.value)) {
          this.lastnameerror = "Please enter a valid last name: no special characters or numbers"
          result = false;
        }

      }



    } else {
      this.lastnameerror = "Please enter last name"

    }


    if (this.descriptionControll.value) {
      if (this.descriptionControll.value.length < 15 || this.descriptionControll.value.length > 250) {
        this.decriptionerror = "Please enter a valid description: length should more than characters"
        result = false;
      }
      if (this.descriptionControll.value.length > 250) {
        this.decriptionerror = "Please enter a valid description: length MAX 250 characters"
        result = false;
      }

    } else {
      this.decriptionerror = "Please enter a description"
      result = false;
    }

    if (this.emailControll.value && !this.emailControll.invalid) {
      if (this.emailControll.value.length == 0) {
        this.emailerror = "Please enter email"
        result = false;
      }
    } else {
      this.emailerror = "Please enter email"
      result = false;
    }
    if (this.phoneControll.value && /^\d+$/.test(this.phoneControll.value)) {
      if (this.phoneControll.value.length != 8) {
        this.phoneerror = "Please enter valid phone number: 8 digits"
        result = false;
      }
    } else {
      this.phoneerror = "Please enter valid phone number"
      result = false;
    }

    if (this.selecetedspeciality === undefined) {
      this.specialityerror = "Please Enter Speciality"
      result = false;
    }
    if (!this.marker) {
      result = false;
      this.locationerror = "Please enter location"
    }

    return result;

  }
  check(){
    if(this.checkinputs()){
     this.continue=true
    }
  }
  saveDoctor() {
    console.log(this.checkinputs())
    let d: Doctor = {
      id: this.auth.user.id!,
      name: this.nameControll.value,
      profilepic:"assets/avatars/doctors/DocAvatar.jpg",
      lastname: this.lastnameControll.value,
      description:this.descriptionControll.value,
      email: this.emailControll.value,

      lat: this.marker.getLatLng().lat ,
      lon: this.marker.getLatLng().lng,
      patients:[],
      specialty:
      {
        id: this.selecetedspeciality?.id!,
        name: this.selecetedspeciality?.name!,
        description: this.selecetedspeciality?.description!
      }
      ,
      phone: this.phoneControll.value,
      shiftHours:this.workShifts
    }
    console.log(d)
    this.docservices.createDoctor(d).subscribe((k) => {

      let kk = k as User
      console.log(kk)
     this.auth.updateuser(kk.id!).subscribe((kl) => {
       if (kl) {
         this.auth.user = kl as User
     
       }
     })
    })
  }
  selectday(dayy: Day,id:number) {
    dayy.selected = !dayy.selected
    this.workShifts[id].days = this.workShifts[id].days.map(day => {
      if (day.name === dayy.name) {
        return { ...day, dayy };
      }
      return day;
    });
  }
  onSelectChangebegin(value:any,id:number){
  this.workShifts[id].start=value.value
  }
  onSelectChangeend(value:any,id:number){
    this.workShifts[id].end=value.value
    }
  onSelectChangename(value:any,id:number){
    console.log(    this.workShifts[id].name)
      this.workShifts[id].name=value.value
  }
  removeshift(id:number){
    if(    this.workShifts.length>1)
    this.workShifts.splice(id,1)
  }
  
 checkShiftsOverlap() {
  let shifts= this.workShifts
  let dds= this.dayss
 let result =true
 for (let shif of this.workShifts){
  shif.errors=[]
  if(!(shif.days.find((dk)=>dk.selected==true))){
    shif.errors.push("No day selected")
    result=false
  }
 }
 for(let d in this.dayss){
   let shift=[]
    for(let sh of shifts){
        if(sh.days.find((dd)=>dd.name==dds[d]&&dd.selected==true)){
          
          shift.push(sh)
        }
    }
    for(let i=0; i< shift.length;i++){
        for(let i2=i+1;i2< shift.length;i2++){
          if(parseInt(shift[i].start) >=parseInt(shift[i2].start)){
             if(parseInt(shift[i].start) <parseInt(shift[i2].end)){
              console.log("sss")
              shift[i].errors.push(`${shift[i].name} and ${shift[i2].name} have an overlape on there time please check them`)
              shift[i2].errors.push(`${shift[i].name} and ${shift[i2].name} have an overlape on there time please check them`)
              result=false
             }
          }else{
            if(parseInt(shift[i].end) >parseInt(shift[i2].start)){
              console.log("sss")
              shift[i].errors.push(`${shift[i].name} and ${shift[i2].name} have an overlape on there time please check them`)
              shift[i2].errors.push(`${shift[i].name} and ${shift[i2].name} have an overlape on there time please check them`)
              result=false
            }
            
          }
        }
      
    }
 }
 if(result){
  this.saveDoctor()
 }
}
}
