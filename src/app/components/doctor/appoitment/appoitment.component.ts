import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { from, take } from 'rxjs';
import { patientService } from 'src/app/services/patientService';
import { patient, patientProfile } from 'src/app/models/user-profile';
import { Doctor, DoctorServicesService } from 'src/app/services/doctor-services.service';
import { Appoitment } from 'src/app/models/user.model';
interface appoitment {
  id: string
  PatienID: string,
  day: string,
  hour: string,
  Title: string,
  statu: string,
  durationByHour: number
  PatientNotes?: string,
  Documents?: string[]
  onbaseId:string
}
interface respo {

  "id": 1,
  "date": Date,
  "reason": string,
  "statusAPT": string,

  "patient": patientProfile
  "consultation": string

}
interface hour{
  number:number,
  apps:appoitment[]
  hour:string,
  day:string
}
@Component({
  selector: 'app-appoitment',
  templateUrl: './appoitment.component.html',
  styleUrls: ['./appoitment.component.css']
})

export class AppoitmentComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  apploading=false
  app1List: appoitment[] = [
  ]
  listOfListApp: hour[] = []
  patientlist: patientProfile[] = []

  hourData!:hour|undefined
  @Input() selectedDate!: Date;
  selectedDate1!: string;
  currentMonth!: Date;
  weeks!: Date[][];
  CalendarDiplay1 = true
  consultationTitle: string="";
  consultationReport:  string="";
  treatmentDescription:  string="";
  treatmentMedicin:  string="";
  treatmentDuration:  string="";
  consultationTitleError: string="";
  consultationReportError:  string="";
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  user!:Doctor
 loded=false
isShowOnlyApp=true
disPhinish=false
  constructor(patientService: patientService, private docservice: DoctorServicesService) {
    this.docservice.doctor$.pipe(take(1)).subscribe((k)=>{

      this.user=k
    
      
    this.currentMonth = new Date();
    this.selectedDate1 = this.currentMonth.toString()

   
    this.selectedDate = new Date()
    
    this.getapps()
    
    patientService.getPatients().pipe(take(1)).forEach((k) => {
      this.patientlist = k


    })

    })



  }
  finishregister(id:string){
    let check=true
    if(this.consultationTitle==""){
       this.consultationTitleError="Please enter a title"
       check=false
    }else{
      this.consultationTitleError=""
    }
    if(this.consultationReport==""){
      this.consultationReportError="Please enter your report"
      check=false
   }else{
     this.consultationReportError=""
   }
    let con={
      Id:"",
      dateConsultation:new Date(),
      title:this.consultationTitle,
      rapport:this.consultationReport,
      treatment:{
        id:"",
        description:this.treatmentDescription,
        medicin:this.treatmentMedicin,
        duration:this.treatmentDuration
      }
    }
    if( check==false){
      return
    }
    this.docservice.approve(id,con).subscribe((k)=>{
      console.log(k);
    })
   

  }
  
declineappoitment(id:string){
  this.apploading=true
  this.docservice.updateappoitment(id, "CANCELED").subscribe((k)=>{
    
    let res = k as unknown as Appoitment
    let statu = "Declined"
  
    let a =this.app1List.find((kk)=>kk.onbaseId==id)
    if(a){
      a.statu=statu
    }

    this.generate()
    this.apploading=false
  })
}
Acceptappoitment(id:string){
  this.apploading=true
  this.docservice.updateappoitment(id, "APPROVED").subscribe((k)=>{
    
    let res = k as unknown as Appoitment
    let statu = "Approved"
  
    let a =this.app1List.find((kk)=>kk.onbaseId==id)
    if(a){
      a.statu=statu
    }
    this.apploading=true
    this.generate()
    this.apploading=false
  })
}
updateApps(){

}
  ngAfterViewInit(): void {
  
  }
  switchDisplayto1() {
    this.CalendarDiplay1 = true
  }
  switchDisplayto2() {
    this.CalendarDiplay1 = false
  }
  hoursList = []
  // Inside your Angular component or service

  // Declare and initialize an empty array
  numbersArray: string[] = [];
  beginDate!: string
  DaysOnCalendar: string[] = []
  day: string[][] = [];

  // Use a loop to populate the array with numbers from 1 to 24
  ngOnInit(): void {

 


    // this.docservice.getAppoitmentsByDates(this.selectedDate)

  }
  getapps() {
    const initialDate = this.selectedDate;
    const fourDaysAfter = new Date(initialDate);
    fourDaysAfter.setDate(fourDaysAfter.getDate() + 3);
    this.docservice.getAppointmentsByDates(initialDate, fourDaysAfter).subscribe((k) => {
      let res = k as unknown as respo[]
      let applist: appoitment[] = []
      let plist: patientProfile[]=[]

      for (let [index, re] of res.entries()) {
        let statu = ""
        if (re.statusAPT == "PENDING") {
          statu = "waiting Approve"
        }
        if (re.statusAPT == "CANCELED") {
          statu = "Declined"
        } 
        if (re.statusAPT == "APPROVED") {
          statu =  "Approved"
        }
        if (re.statusAPT == "DONE") {
          statu =  "Completed"
        }
        let da = new Date(re.date)

        const year = da.getFullYear();
        const month = (da.getMonth() + 1).toString().padStart(2, "0");
        const day = da.getDate().toString().padStart(2, "0");
        const hour = da.getHours()
        if (plist.find((p) => p.id == re.patient.id)==undefined) {
          plist.push(re.patient)
         }
        const formattedDate = `${year}/${month}/${day}`;
    
        let ap: appoitment = {
          id: index.toString(),
          onbaseId:re.id.toString(),
          day: formattedDate,
          durationByHour: 1,
          hour: hour.toString().padStart(2, "0")+":00",
          PatienID: re.patient.id.toString(),
          statu: statu,
          Title: "sqdsq"

        }
        this.patientlist=[]
        
        for(let p of plist){
          this.patientlist.push(
            p
          )
        }
        applist.push(ap)
      }

      this.app1List = applist
    this.generateCalendar();
      this.generate()
      this.loded=true
      this.scrollToPosition()
   

    })

 
  }
  calendarSelect = false
  generate() {

    this.numbersArray = []
    this.day = []
    let arrayof24_0 = []
    for (let i = 1; i <= 24; i++) {
      let x = i.toString()

      if (x.length < 2) {

        x = '0' + x
      }
      this.numbersArray.push(x + ':00');

      arrayof24_0.push("")
    }
    for (let i = 0; i < 4; i++) {
      this.day.push([...arrayof24_0])
    }
    if (this.selectedDate) {
      this.beginDate = this.selectedDate.toString()
    } else {
      this.beginDate = this.currentMonth.toString()
    }

    this.DaysOnCalendar = this.getDatesArray(this.beginDate, 4)
    this.listOfListApp=[]

    for (let ap of this.app1List) {
      for (let day of this.DaysOnCalendar) {
       
        if (ap.day == day.toString()) {
          for(let hour of  this.numbersArray){
            if(hour == ap.hour){
             
              let shift =this.listOfListApp.find((ks)=> ks.hour == hour)
              if(shift){
                 shift.hour=hour
                 shift.apps.push(ap)
                 shift.number+=1
              }else{
                this.listOfListApp.push({
                  hour:hour,
                  apps:[ap],
                  number:1,
                  day:ap.day
                })
              }
            }
          }
          console.log(this.app1List)

          let heureBynumber = ap.hour.slice(0, 2)
          let id = parseInt(ap.PatienID)

          this.day[this.DaysOnCalendar.findIndex(c => c == ap.day)][parseInt(heureBynumber) - 1] = ap.id
          for (let i = 1; i < ap.durationByHour; i++) {

            this.day[this.DaysOnCalendar.findIndex(c => c == ap.day)][(parseInt(heureBynumber) + i - 1)] = "x"
          }


        }
      }

    }

  }
  openCalendiar() {
    this.calendarSelect = true
  }
  closeCalendiar() {
    this.calendarSelect = false
  }
  goToPreviousMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.selectedDate1 = this.currentMonth.toString()
    this.generateCalendar();
    this.getapps()
  

  }

  goToNextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.selectedDate1 = this.currentMonth.toString()
    this.generateCalendar();
    this.getapps()
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
    this.getapps()

  }

  isCurrentOrNextThreeDays(index: Date): boolean {
    if (this.selectedDate) {
      if ((index.getMonth() == this.selectedDate.getMonth() && index.getFullYear() == this.selectedDate.getFullYear())) {
        let currentIndex = this.selectedDate
        return index.getDate() >= currentIndex.getDate() && index.getDate() < currentIndex.getDate() + 4;
      } else {
        return false
      }

    }
    // Implement your logic to get the current index
    return false
  }
  setcuhour(date: string) {
    const d=date.slice(0,date.indexOf('|'))
    const h=date.slice(date.indexOf('|')+1,date.length)
   
    for(let ap of this.listOfListApp){
      if(ap.day==d&&ap.hour==h){
       this.hourData=ap
   
      }
    }
   
  }

  haveAppotmentes2(date: string) {
    const d=date.slice(0,date.indexOf('|'))
    const h=date.slice(date.indexOf('|')+1,date.length)
    let app=[]
    for(let ap of this.listOfListApp){
      if(ap.day==d||ap.hour==h){
        app.push(ap)
      }
    }
   

    return app
  }


  haveAppotmentes(date: Date): number {
    let n = 0
    for (let ap of this.app1List) {
      if (parseInt(ap.day.substring(5, 7)) == date.getMonth() + 1 && parseInt(ap.day.substring(8, 10)) == date.getDate() && parseInt(ap.day.substring(0, 4)) == date.getFullYear()) {
        n++
      }
    }

    return n
  }





  appointment!: appoitment|undefined
  getInfoApp(id: string) {
    this.appointment = this.getapp(id)

  }
  closeServiceTab() {
    this.appointment = undefined
    this.hourData=undefined
  }
  scrollToPosition(): void {
    const container = this.scrollContainer.nativeElement;
    // Specify the position you want to scroll to
    let cuhour = new Date().getHours()

    const position = (cuhour * 100) - 100;
  
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
  gethourByString(id: string): string {

    let app = this.getapp(id)
    let begin = app.hour.slice(0, 2)
    let end = parseInt(app.hour) + app.durationByHour
    return begin + ":00 - " + end + ":00"
  }
  getapp(id: string): appoitment {
    return this.app1List.find(c => c.id == id)!
  }

  getstatu(id: string): appoitment {

    return this.app1List.find((c) => c.id == id)!
  }
  getpatientt(id: string): patientProfile[] {
    let k = this.patientlist.find(p => p.id == id)
    if (k) {
      return [k]
    } else {
      return []
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
  getDownloadUrl(doc: string): string {
    // Implement the logic to get the download URL for the file
    // Return the URL
    return './assets/PatientDocs/' + doc;
  }
  getappByDay(date: string): appoitment[] {

    let appList: appoitment[] = []
    for (let ap of this.app1List) {
      if (ap.day == date) {
        appList.push(ap)
      }
    }

    return appList
  }
  IsanyappIn(): boolean {
    let rep = false
    for (let d of this.DaysOnCalendar) {
      if (this.getappByDay(d).length > 0) {
        rep = true
      }
    }
    return rep
  }
  getappclass(statu:string){
    let res=""
    if(statu=="waiting Approve"){
      res= "cwaiting"
    }
    if(statu=="Declined"){
      res="declined"
      if(this.isShowOnlyApp){
        res="displayNo"
      }
    }
    if(statu=="Approved"){
      res= "Approved"
    }
    if(statu=="Completed"){
      res= "Completed"
    }
    return res
  }
  anyconsolt(){
    let result=false
   for(let ap of this.getpatientt(this.appointment!.PatienID)![0].appointments) {
           if(ap.consultation){
            result=true
           }
   }
   return result
  }
}
