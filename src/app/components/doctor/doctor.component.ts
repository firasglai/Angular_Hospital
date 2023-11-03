import { Component, HostListener, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Unsubscribable, map, take, takeUntil } from 'rxjs';
import { CALL } from 'src/app/models/chat';
import { ProfileUser } from 'src/app/models/user-profile';
import { AuthenticationService } from 'src/app/services/authentication/auth2.service';
import { ChatsService } from 'src/app/services/chats.service';
import { PresenceService } from 'src/app/services/presence.service';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  /*
  isActive = false;
  isActive1 = false;
  user$


  userid!:string| undefined
  user!:ProfileUser
  clickMeClicked: EventEmitter<void> = new EventEmitter<void>();
  username$:string| undefined
  incall=""
  callstatu=""
  userHaveCallID=""
  incallIdObserver:Observable<string>
  CallObservable!:Observable<CALL>
  CallObservableSUB= new Subject<CALL>()
  call!:CALL|undefined
  constructor(   private authService: SpringAuthService,

    private router: Router,
    private usersService: UsersService,
    private presence : PresenceService,
    private chatservice: ChatsService
     ) {
     // Get the current user profile once and map it to this.user1$ observable
      /*
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
      
      this.incallIdObserver   = new Observable<string> ((observer)=>{
        this.usersService.currentUserProfile$.pipe(map((k)=>{
          this.userHaveCallID=k?.IncallId!
          this.user$.pipe(take(1)).subscribe((user)=>{
            this.chatservice.checkCall(user!)
          })
        
          if(this.userHaveCallID.length>0){
             this.chatservice.checkCall(this.user)
            this.CallObservableSUB.subscribe()
            this.CallObservable= this.chatservice.getOtheCallStat(this.userHaveCallID)
            this.CallObservable.pipe(map((k)=>{
              console.log(k)
              this.call=k
              if(k.statu=="accepted"){
                window.location.replace("./chat")

                
              }else{
               
              }
            })).subscribe()

          }else{
            this.call=undefined
          }
          
          observer.next(this.userHaveCallID)
        })).subscribe()
      }) 
      this.incallIdObserver.subscribe((k)=>{
        console.log(this.userHaveCallID);
      })
  }

  ngOnInit() {
    // Call the resetActive method when the component is initialized
    this.resetActive();
    this.user$.pipe(take(1)).subscribe((user)=>{
      this.chatservice.checkCall(user!)

    })
    
  
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

  toggleActive() {
    this.isActive = !this.isActive;
  }
  
  toggleActive1() {
    this.isActive1 = !this.isActive1;
  }
  SingOut(){
  
    this.authService.logout()

      window.location.href="/"
   
  }

  toCall(){
    this.router.navigate(['./chat'])
  }
  
  CancelCall(){
    this.chatservice.destroyCall(this.userHaveCallID!)
  }
  CancelAttempt(){
    this.chatservice.destroyCall(this.userHaveCallID!)
  }
  AccpectCall(){
    this.chatservice.AccpectCall(this.userHaveCallID)
  }
  destroyCallWindow(){

  }
  */
}
