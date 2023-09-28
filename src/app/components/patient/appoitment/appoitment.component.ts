
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { from, take } from 'rxjs';
import { patientService } from 'src/app/services/patientService';
import{patient, patientProfile} from 'src/app/models/user-profile';
import { Doctor } from 'src/app/services/doctor-services.service';
interface appoitment{
  id:string
  Docid:string,
  day:string,
  hour:string,
  Title:string,
  statu:string,
  durationByHour:number
  PatientNotes?:string,
  Documents?:string[]
}
@Component({
  selector: 'app-appoitment',
  templateUrl: './appoitment.component.html',
  styleUrls: ['./appoitment.component.css']
})

export class AppoitmentComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

app1List:appoitment[]=[]
patientlist:Doctor[]=[]


@Input() selectedDate!: Date;
selectedDate1!: string;
currentMonth!: Date;
weeks!: Date[][];
CalendarDiplay1=true
user!:patientProfile
weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

constructor(patientService:patientService){
  patientService.patient.subscribe((k)=>{
    this.user=k
    
  patientService.getmyAllAppointments(k.id).pipe(take(1)).forEach((arr)=>{

     this.app1List = [];
     this.patientlist= [];
  
    for (const obj of arr) {
      if (obj.consultation === null) {
        const appointment: appoitment = {
          id: obj.id.toString(),
          Docid: obj.doctor.id.toString(),
          day: new Date(obj.date).toISOString().slice(0, 10).replaceAll("-","/"),

          hour: new Date(obj.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit',hour12:false }),
          Title: 'zzz',
          statu: obj.statusAPT,
          durationByHour: 1
        };
  
        this.app1List.push(appointment);
        this.patientlist.push(obj.doctor);
      }
    }
    this.currentMonth = new Date();
    this.selectedDate1=this.currentMonth.toString()

    this.selectedDate=new Date()
    this.generate()
    this.generateCalendar();

    console.log(this.DaysOnCalendar)
     console.log(this.app1List)
      })
      
  
  })
  
  this.selectedDate=new Date()
    
}
  ngAfterViewInit(): void {
    this.scrollToPosition()
  }
  switchDisplayto1(){
    this.CalendarDiplay1=true
  }
  switchDisplayto2(){
    this.CalendarDiplay1=false
  }
hoursList=[]
// Inside your Angular component or service

// Declare and initialize an empty array
numbersArray: string[] = [];
beginDate!:string
DaysOnCalendar:string[]=[]
day: string[][] = [];

// Use a loop to populate the array with numbers from 1 to 24
ngOnInit(): void {

}
calendarSelect=false
 generate(){
  this.numbersArray=[]
  this.day=[]
  let arrayof24_0=[]
  for (let i = 1; i <= 24; i++) {
    let x=i.toString()
   
    if(x.length<2){
    
      x='0'+x
    }
    this.numbersArray.push(x+':00');
   
    arrayof24_0.push("")
  }
  for(let i=0;i<4;i++){
this.day.push([...arrayof24_0])
  }
  if( this.selectedDate){
    this.beginDate=    this.selectedDate.toString() 
  }else{
    this.beginDate=    this.currentMonth.toString(  ) 
  }
 
  this.DaysOnCalendar=this.getDatesArray(this.beginDate,4)

  for(let ap of this.app1List){
    for(let day of this.DaysOnCalendar){
    
      if(ap.day==day.toString()){
        let heureBynumber=ap.hour.slice(0,2)
        let id = parseInt(ap.Docid)
       
        this.day[this.DaysOnCalendar.findIndex(c=>c==ap.day)][parseInt(heureBynumber)-1]=ap.id.toString()
        console.log(this.day)
        for(let i =1;i<ap.durationByHour;i++){
       
          this.day[this.DaysOnCalendar.findIndex(c=>c==ap.day)][(parseInt(heureBynumber)+i-1)]="x"
        }
        
     
      }
    }
    
  }
}
openCalendiar(){
this.calendarSelect=true
}
closeCalendiar(){
  this.calendarSelect=false
  }
goToPreviousMonth() {
  this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
  this.selectedDate1=this.currentMonth.toString()
  this.generateCalendar();
  console.log( this.currentMonth  )
 
}

goToNextMonth() {
  this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
  this.selectedDate1=this.currentMonth.toString()
  this.generateCalendar();
}

generateCalendar() {
  const firstDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

  const firstDayOfWeek = firstDayOfMonth.getDay();
  const lastDayOfWeek = lastDayOfMonth.getDay();

  const daysInPreviousMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 0).getDate();
  const daysInCurrentMonth = lastDayOfMonth.getDate();

  const totalDays = firstDayOfWeek + daysInCurrentMonth + (6 - lastDayOfWeek);
  const totalWeeks = Math.ceil(totalDays / 7);

  this.weeks = [];

  let currentDay = 1;

  for (let i = 0; i < totalWeeks; i++) {
    const week: Date[] = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDayOfWeek) {
        const previousMonthDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, daysInPreviousMonth - (firstDayOfWeek - j - 1));
        week.push(previousMonthDay);
      } else if (currentDay <= daysInCurrentMonth) {
        const currentMonthDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), currentDay);
        week.push(currentMonthDay);
        currentDay++;
      } else { 
        const nextMonthDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, j - lastDayOfWeek);
        week.push(nextMonthDay);
      }
    }
    this.weeks.push(week);
  }
}

isCurrentMonth(date: Date): boolean {
  return date.getMonth() === this.currentMonth.getMonth();
}

isDateSelected(date: Date): boolean {
  if (!this.selectedDate) {
    return false;
  }
  return date.toDateString() === this.selectedDate.toDateString();
}

selectDate(date: Date) {

    this.selectedDate = date;
    this.generate()

}

isCurrentOrNextThreeDays(index: Date): boolean {
  if(this.selectedDate){
      if((index.getMonth()==this.selectedDate.getMonth()&&index.getFullYear()==this.selectedDate.getFullYear())  ){
        let currentIndex = this.selectedDate
        return index.getDate() >= currentIndex.getDate() && index.getDate() < currentIndex.getDate() + 4;
      }else{
        return false
      }
    
  }
 // Implement your logic to get the current index
return false
}



haveAppotmentes(date:Date):number{
 let n = 0
for( let ap of this.app1List){
if(parseInt(ap.day.substring(5,7)) ==date.getMonth()+1 && parseInt(ap.day.substring(8,10)) ==date.getDate()&& parseInt(ap.day.substring(0,4)) ==date.getFullYear()  ){
  n++
  }
}

  return n
}





appointment!:any
getInfoApp(id:string){
  this.appointment=this.getapp(id)

}
closeServiceTab(){
  this.appointment=undefined
}
scrollToPosition(): void {
  const container = this.scrollContainer.nativeElement;
   // Specify the position you want to scroll to
  let cuhour= new Date().getHours()
 
  const position = (cuhour*100)-100;
  console.log(cuhour)
  container.scrollTo({
    top: position,
    behavior: 'smooth' // Use smooth scrolling behavior
  });
}
convertDateString1(dateString: string): string {

  const dateParts = dateString.split('/');
  const year = dateParts[0];
  const month = this.getMonthName(+dateParts[1]);
  const day = dateParts[2];

  return `${month} ${day}`;
}
convertDateString(dateString: string): string {
  const dateParts = dateString.split('/');
  const year = dateParts[0];
  const month = this.getMonthName(+dateParts[1]);
  const day = dateParts[2];

  return `${month} ${day} ${year}`;
}

getMonthName(monthNumber: number): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return months[monthNumber - 1];
}
gethourByString(id:string):string{

  let app =this.getapp(id)
  let begin=app.hour.slice(0,2)
  let end=parseInt(app.hour)+app.durationByHour
  return begin+":00 - "+ end+ ":00"
}
getapp(id:string):appoitment{
return this.app1List.find(c=> c.id == id )!
}

 getstatu(id:string):appoitment{

  return this.app1List.find((c)=> c.id==id)!
 }
 getpatientt(id:string):Doctor[]{
  
   let k =this.patientlist.find(p =>  p.id==id)
   console.log(k)
   if(k){
    return [k]
   }else{
    return[]
   }
 
}
getDatesArray(startDate: string, numberOfDays: number): string[] {
  const datesArray: string[] = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < numberOfDays; i++) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + i);
    datesArray.push(this.formatDate(nextDate));
  }

  return datesArray;
}
formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}/${month}/${day}`;
}
getCurrentDate(): string {
  const currentDate = new Date();
  return this.formatDate(currentDate);
}
getDownloadUrl(doc:string): string {
  // Implement the logic to get the download URL for the file
  // Return the URL
  return './assets/PatientDocs/'+doc;
}
getappByDay(date:string):appoitment[]{

  let appList:appoitment[]=[]
  for(let ap of this.app1List){
    if(ap.day==date){
      appList.push(ap)
    }
  }

  return appList
}
IsanyappIn():boolean{
 let rep=false
  for(let d of this.DaysOnCalendar){
  if(this.getappByDay(d).length>0){
    rep=true
  }
  }
  return rep
}

}
