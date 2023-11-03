
import { Component, HostListener, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Unsubscribable, map, take, takeUntil } from 'rxjs';
import { CALL } from 'src/app/models/chat';
import { ProfileUser, patientProfile } from 'src/app/models/user-profile';
import { AuthenticationService } from 'src/app/services/authentication/auth2.service';
import { ChatsService } from 'src/app/services/chats.service';
import { call } from 'src/app/services/doctor/doctor-chat.service';
import { PatientChatService } from 'src/app/services/patient/patient-chat.service';
import { patientService } from 'src/app/services/patientService';
import { PresenceService } from 'src/app/services/presence.service';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
import { UsersService } from 'src/app/services/users/users.service';
import { TokenService } from 'src/app/services/authentication/token.service';
@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent {

  constructor (
    private authService: SpringAuthService,
    private UserService: UsersService,
    private router: Router,
    private tokenService: TokenService,
  ){
  }
  isActive = false;
  isActive1 = false;

  toggleActive() {
    this.isActive = !this.isActive;
  }

  toggleActive1() {
    this.isActive1 = !this.isActive1;
  }
  
  SignOut(){
    this.authService.logout();
    this.router.navigate(['']);
  }
/*
  
  user$


  userid!:string| undefined
  user!:ProfileUser
  clickMeClicked: EventEmitter<void> = new EventEmitter<void>();
  username$:string| undefined
  incall=""
  callstatu=""
  userHaveCallID=""
  CallObservable!:Observable<CALL>
  CallObservableSUB= new Subject<CALL>()
  call!:CALL|undefined
  requstingCall=""
  Patient:patientProfile={
    appointments:[],
    doctors:[],
    id:"",
    name:"",
    lastname:"",
    address:"",
    dateOfBirth:"",
    email:"",
    gender:"",
    medicalHistory:{
      allergies:"",
      height:"",
      id:"",
      weight:""
    }
    ,phone:"",
    profilePic:""
  }
  Ccall!:call
  constructor(   private authService: SpringAuthService,
    private router: Router,
    private usersService: UsersService,
    private presence : PresenceService,
    private chatservice: PatientChatService,
    private patientservice:patientService
     ) {// Get the current user profile once and map it to this.user1$ observable
    this.patientservice.patient.subscribe((k)=>{
        this.Patient=k
        console.log(this.Patient)

          // Update the user's presence if it's currently offline
          this.chatservice.getCallId(k.id).then((kk)=>{
            this.incall= (kk.val() as string)
            console.log()
            if(this.incall)
            if(this.incall.length>0){
              this.chatservice.getcallById(this.incall).then((res)=>{
                this.Ccall=res as call
                if(this.Ccall.statu=="approved"){
                  window.location.href="/chat"
                }
                console.log(this.Ccall)
              })
            }
          })
        
      })

      // Subscribe to the current user profile and update the corresponding variables
      this.user$ = this.usersService.currentUserProfile$;
      this.user$.subscribe(user => {
        this.userid = user?.uid;
        this.user = user! 
        console.log(this.user);
        
        
      
        if (this.user.IncallId && this.user.IncallId!== "") {
          this.incall = this.user.IncallId;
          this.callstatu = this.user.IncallId
         
        }
      
        console.log(this.user);
      
      });
      
     
         
  }

  ngOnInit() {
   
    
  
  }
 
  @HostListener('document:click', ['$event'])
  resetActive(event?: MouseEvent) {
    // Check if the clicked element is the "Click me" div
    const clickedElement = event ? event.target as HTMLElement : null;
    if (clickedElement && clickedElement.classList.contains('ava')) {
      // If it is, prevent the reset and emit the custom event

      event?.stopPropagation();
      this.clickMeClicked.emit();
    
    }else{
     
    // Reset the isActive property to false for all other clicks
    this.isActive = false;
    }
    if (clickedElement && clickedElement.classList.contains('setting')) {
      // If it is, prevent the reset and emit the custom event

      event?.stopPropagation();
      this.clickMeClicked.emit();
      return;
    }else{
     
    // Reset the isActive property to false for all other clicks
    this.isActive1 = false;
    }
   
   
  }

  
  
  


*/
}
