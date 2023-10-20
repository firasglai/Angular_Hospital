import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, combineLatest, fromEvent, Subject } from 'rxjs';
import { switchMap, tap, map, startWith, timeout, delay, take, takeUntil } from 'rxjs/operators';

import { Message, Chat } from 'src/app/models/chat';
import { ProfileUser, patientProfile } from 'src/app/models/user-profile';
import { PresenceService } from 'src/app/services/presence.service';
import { ChatsService } from 'src/app/services/chats.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Doctor, DoctorServicesService } from 'src/app/services/doctor-services.service';
import { DoctorChatService, chatReq } from 'src/app/services/doctor/doctor-chat.service';
import { patientService } from 'src/app/services/patientService';
import { PatientChatService } from 'src/app/services/patient/patient-chat.service';


interface Patient {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  profilePhoto: string;
  appointmentHistory: {
    id: number;
    date: string;
    reason: string;
  }[];
}
type Target = Document | HTMLElement;
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  @ViewChild('endOfChat')
  endOfChat!: ElementRef;
  scrollcounter=0
  user2$!: Observable<ProfileUser | null>;
  AllmyChats1$!: Observable<Chat[]>;
  messages$: Message[]=[]
  scrollContainer!: HTMLElement;
  @ViewChild('chatArea')
  chatArea!: ElementRef;

  currentchat!:chatReq;
  searchControl =""
  messageControl = new FormControl('');
  newMessage: string
  scrollPos: number = 0;
  chatListControl: FormControl = new FormControl([""]);
  user!: ProfileUser;
  status$!: string;
  currentChat!:Chat
  suggestedUsers:Doctor[]=[]
  loadmsgNumber=15
  incall:string=""
  unsubscribe$ = new Subject<void>();
   userHaveCallID=""
   patientList:Doctor[]=[]
  searchValue=""
  cuuser!:patientProfile
  chatlist:chatReq[]=[]
  constructor(
    private elementRef: ElementRef,
    private usersService: UsersService,
    private presence: PresenceService,
    private patService:patientService,
    private chatserv:PatientChatService
  ) {
    this.patService.getMyDoctors().subscribe((k)=>{
      this.patientList=k
          
         })
    this.patService.patient.subscribe((k)=>{
 this.cuuser=k
 this.patientList
 this.getAllchats()
     
    })
  
     this.newMessage=""
          

   
  }
  ngOnInit(): void {
 
   

 
  }
  getAllchats(){
    this.chatserv.getMyAllchats(this.cuuser.id).then((res)=>{
      this.chatlist=res
      console.log(res)
    })

  }
  getmsgs(msg:any){
console.log(msg)
return []
  }
  sendMessage(){
    this.chatserv.sendMessage(this.currentchat,this.newMessage)
    this.newMessage=""
  }
  getchatimg(cht:chatReq){
    let img=""
for(let p of this.patientList){
if(p.id==cht.doctorid){
  img=p.profilepic
}
}
return img
  }
  getchatname(cht:chatReq){
    let img=""
    for(let p of this.patientList){
    if(p.id==cht.doctorid){
      img=p.name+' '+p.lastname
    }
    }
    return img
  }
  createChat(us:Doctor){
  
   this.chatserv.createChat(us.id,this.cuuser.id).then((k)=>{
    this.chatserv.getChatById(k).subscribe((key)=>{
      console.log( key)
      this.currentchat=key!
    })
   

   })
  }
  openChat(us:string){
  
    this.chatserv.createChat(us,this.cuuser.id).then((k)=>{
     this.chatserv.getChatById(k).subscribe((key)=>{
       console.log( key)
       this.currentchat=key!
     })
    
 
    })
   }
  searchUser(searchValue: string) {
    this.suggestedUsers =[]
   
      this.suggestedUsers = this.patientList.filter(user =>
        user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email.toLowerCase().includes(searchValue.toLowerCase())||user.lastname.toLowerCase().includes(searchValue.toLowerCase())
      ).slice(0, 5);
      console.log(this.scrollPos);
    
    if(searchValue==""){
      this.suggestedUsers =[]
    }else{

    }
   
  }
  

}

