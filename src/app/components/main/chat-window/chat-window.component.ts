import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CanDeactivate, Router } from '@angular/router';
import { Database, getDatabase, onDisconnect, onValue, push, ref, set, update } from 'firebase/database';

import { Observable, Subject, Subscription, filter, from, interval, map, of, pipe, pluck, switchMap, take, takeUntil, tap } from 'rxjs';
import { CALL, Call, Callstatu, Chat } from 'src/app/models/chat';
import { ProfileUser } from 'src/app/models/user-profile';
import { AuthenticationService } from 'src/app/services/authentication/auth2.service';

import { ChatsService } from 'src/app/services/chats.service';
import { PresenceService } from 'src/app/services/presence.service';
import { UsersService } from 'src/app/services/users/users.service';
import { MyCanDeactivateGuard } from '../../../models/pipes/BeforeCloseGuard';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';

import { FormBuilder, FormControl, Validators } from '@angular/forms';

declare var apiRTC: any;
@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit ,OnDestroy  {
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


  /*
  title = 'ApiRTC-angular';
  conversationFormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required])
  });
  get conversationNameFc(): FormControl {
    return this.conversationFormGroup.get('name') as FormControl;
  }
  isCameraOn=false
  isotherUserCameraOn=false
  user$
    
  userid!:string| undefined
  user!:ProfileUser
  username$:string| undefined
  incall=""
  callstatu=""
  userHaveCallID=""
  incallIdObserver:Observable<string>
  CallObservable!:Observable<CALL>
  CallObservableSUB= new Subject<CALL>()
  call!:CALL|undefined
  isTabOpen = false;
  isTabOpenOb!:Observable<boolean>
  sub:Subscription
  sub2!:Subscription
  db:any
  callWindowId:string=""
  incalllObservale!:Subscription
  call2!:CALL
  connected="waiting"
  constructor(   private authService: AuthenticationService,
   
    private usersService: UsersService,
    private presence : PresenceService,
    private chatservice: ChatsService,
    private router:Router,
    private fb: FormBuilder
     ) { 
      const app = initializeApp(environment.firebase);
      this.db = getDatabase(app);
      this.user$ = this.usersService.currentUserProfile$;
            this.sub=    this.user$.subscribe(user => {
        this.userid = user?.uid;
        this.user = user! 
        console.log(this.user);
       

        // Update the user's presence if it's currently offline
        this.presence.getPresence(user?.uid!).subscribe(presence => {
          this.username$ = user?.displayName;
          if (presence === "offline") {
            console.log("updating: " + presence);
            this.presence.setPresenceOn(user?.uid!).subscribe();
          }
        });
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
            
            this.incalllObservale= this.chatservice.getOtheCallStat(this.userHaveCallID).pipe(map((k)=>{
              this.call2=k

              if(k.statu=="requesting Call"){
              
                this.backtoinbox()
             
               }
             })).subscribe()

            this.CallObservable= this.chatservice.getOtheCallStat(this.userHaveCallID)
            this.CallObservable.pipe(take(1),map((k)=>{
              console.log(k)
              this.call=k

              if(k.statu=="accepted"){
                  
                 this.chatservice.setOnCall(this.userHaveCallID)
              }
        
              if(k.reciever==this.user.uid){
                this.chatservice.setReciverOnWindow(k.id)
              }else{
                if(k.starterId==this.user.uid){
                  this.chatservice.setSenderOnWindow(k.id)
                }
              }
            
              this.createCallwindow()
            this.fetchConnection().subscribe()
            this.getOrCreateConversation()

            
            })).subscribe()
         
         
          }else{
            this.call=undefined
             window.location.replace("doctor/inbox")
          }

          observer.next(this.userHaveCallID)
        })).subscribe()
      }) 
      this.sub=this.incallIdObserver.subscribe()
  

  }
  ngOnDestroy(): void {
 

    
    if(this.userHaveCallID.length>0){
      this.CallObservable.pipe(take(1),map((k)=>{
        console.log(k)
        this.call=k
       
        if(k.reciever==this.user.uid){
          
          if(this.call2.recieverCallWindows?.currentCallwindowID==this.callWindowId){
            this.endCall()
          }else{

          let arrayForOff=this.call2.recieverCallWindows?.callwindows!
          let ElOFF = arrayForOff.findIndex((c)=> c.id==this.callWindowId)
          if (ElOFF !== -1) {
            arrayForOff.splice(ElOFF, 1);
          }
          const userStatusDatabaseRef =ref(this.db,'/branche/'+ this.call2.id+"/recieverCallWindows/callwindows/"); 
          set(userStatusDatabaseRef,arrayForOff)
          }
          /////////////////////
        }else{
          if(k.starterId==this.user.uid){
            if(this.call2.starteCallWindows?.currentCallwindowID==this.callWindowId){
              this.endCall()
            }else{
               this.chatservice.setSenderOFFWindow(k.id)
            this.chatservice.setReciverOFFWindow(k.id)
            let arrayForOff=this.call2.starteCallWindows?.callwindows!
            let ElOFF = arrayForOff.findIndex((c)=> c.id==this.callWindowId)
            if (ElOFF !== -1) {
              arrayForOff.splice(ElOFF, 1);
            }
            const userStatusDatabaseRef =ref(this.db,'/branche/'+ this.call2.id+"/starteCallWindows/callwindows/"); 
            set(userStatusDatabaseRef,arrayForOff)
            }
           

          }
        }
       
      })).subscribe()
      this.sub.unsubscribe()
    }
    this.incalllObservale.unsubscribe()
    this.sub.unsubscribe()
    }



  ngOnInit(): void {
  
    this.user$.pipe(take(1)).subscribe((user)=>{
      this.chatservice.checkCall(user!)

    })

    window.addEventListener('beforeunload', (event) => {
      // Cancel the event
      event.preventDefault();
      // Chrome requires returnValue to be set



      if(this.call2.reciever==this.user.uid){
          
        if(this.call2.recieverCallWindows?.currentCallwindowID==this.callWindowId){
          this.endCall()
        }
        /////////////////////
      }else{
        if(this.call2.starterId==this.user.uid){
          if(this.call2.starteCallWindows?.currentCallwindowID==this.callWindowId){
            this.endCall()
          }
         
         

        }
      }
      this.sub.unsubscribe()
    
    });
  
  }
  
  
  endCall(){
  this.chatservice.destroyCall(this.userHaveCallID)

}

createCallwindow(){
if(this.call2&& this.call2.id.length>0)
  if(this.call2.starterId==this.user.uid){
    const ref1=ref(this.db,'branche/'+this.call2.id+'/starteCallWindows/')
        if(this.call2.starteCallWindows?.callwindows&&this.call2.starteCallWindows?.callwindows.length==0 ){
       
          const ref12=ref(this.db,'branche/'+this.call2.id+'/starteCallWindows/')

          let ref3=push(ref12)
          //add new window and set it as current call window
          let key=ref3.key as string
          this.call2.starteCallWindows.callwindows.push({
              id: key,
              statu:'on'
            })

          
          
          this.call2.starteCallWindows.currentCallwindowID=ref3.key as string
          set(ref12,this.call2.starteCallWindows)
          this.callWindowId=ref3.key as string

          //just add a new window
          console.log('just add a new window starte')
        }else{
          
          set(ref1,{
            callwindows:[],
            currentCallwindowID:''
            
          })
          const ref12=ref(this.db,'branche/'+this.call2.id+'/starteCallWindows/callwindows/')

          let ref3=push(ref12)
          //add new window and set it as current call window
          this.call2.starteCallWindows={
            currentCallwindowID: ref3.key as string,
            callwindows:[{
              id: ref3.key as string,
              statu:'on'
            }]

          }
          const ref123=ref(this.db,'branche/'+this.call2.id+'/starteCallWindows/')
          set(ref123,this.call2.starteCallWindows)
          this.callWindowId=ref3.key as string


        
        }
  }else{
    const ref1=ref(this.db,'branche/'+this.call2.id+'/recieverCallWindows/')
    if(this.call2.reciever==this.user.uid){
      if(this.call2.recieverCallWindows?.callwindows &&this.callWindowId.length==0 ){
        //just add a new window
        const ref12=ref(this.db,'branche/'+this.call2.id+'/recieverCallWindows/')

        let ref3=push(ref12)
        let key=ref3.key as string
        //add new window and set it as current call window
        this.call2.recieverCallWindows.callwindows.push({
        
            id: key ,
            statu:'on'
          })

        
        
        this.call2.recieverCallWindows.currentCallwindowID=key
        set(ref12,this.call2.recieverCallWindows)
        this.callWindowId=key

        console.log('just add a new window reciever')
      }else{
        //add new window and set it as current call window

        set(ref1,{
          callwindows:[],
          currentCallwindowID:''
          
        })
        const ref12=ref(this.db,'branche/'+this.call2.id+'/recieverCallWindows/callwindows/')

        let ref3=push(ref12)
        let key=ref3.key as string
        //add new window and set it as current call window
        this.call2.recieverCallWindows={
          currentCallwindowID: key,
          callwindows:[{
            id:key,
            statu:'on'
          }]

        }
        const ref123=ref(this.db,'branche/'+this.call2.id+'/recieverCallWindows/')
        set(ref123,this.call2.recieverCallWindows)

       
        console.log('add new window and set it as current call window reciever')
       
      
        this.callWindowId=key

        console.log('just add a new window reciever')
      }
    }
  }



 }
setCallsetOnthisWindow(){

}

backtoinbox(){
 
window.location.replace("./doctor/inbox")
}

fetchConnection(){
  const connection = ref(this.db, '.info/connected');
  

return new Observable<string>((observer) => {
  onValue(connection, (snapshot) => {
    const connected = snapshot.val();
    if (snapshot.val() == false) {
      return;
  };

  if(this.userid===this.call2.starterId){
   
    let arrayForOff=this.call2.starteCallWindows?.callwindows!
    let ElOFF = arrayForOff.findIndex((c)=> c.id==this.callWindowId)
    if (ElOFF !== -1) {
      arrayForOff.splice(ElOFF, 1);
    }
    if(this.callWindowId.length>0){
      const userStatusDatabaseRef =ref(this.db,'/branche/'+ this.call2.id+"/starteCallWindows/callwindows/"); 
      onDisconnect(userStatusDatabaseRef).set(arrayForOff)
      const status = connected ? 'online' : 'offline';
      
      observer.next(status);
    }

  }
    if(this.userid===this.call2.reciever){

      let arrayForOff=this.call2.recieverCallWindows?.callwindows!
      let ElOFF = arrayForOff.findIndex((c)=> c.id==this.callWindowId)
      if (ElOFF !== -1) {
        arrayForOff.splice(ElOFF, 1);
      }
      
      const userStatusDatabaseRef =ref(this.db,'/branche/'+ this.call2.id+"/recieverCallWindows/callwindows/"); 
      onDisconnect(userStatusDatabaseRef).set(arrayForOff)
      const status = connected ? 'online' : 'offline';
      
      observer.next(status);
    }
  
  })
  })
  

}
updateCallList(){
  let wIndex = this.call2.recieverCallWindows?.callwindows.findIndex((c)=> c.id==this.callWindowId)

}

@ViewChild('video') video!: ElementRef;


getOrCreateConversation() {
  var localStream:any=null;

  //==============================
  // 1/ CREATE USER AGENT
  //==============================
  var connectedSession;

  const ua = new apiRTC.UserAgent({
    uri: 'apzkey:76ea8ad6c5e786bc4689a606b3a0badb'
  });

    // Register UserAgent to create an apiRTC session
    

  //==============================
  // 2/ REGISTER
  //==============================
  ua.register().then((session:any) => {

    //==============================
    // 3/ CREATE CONVERSATION
    //==============================
    const conversation = session.getConversation(this.userHaveCallID);

    //==========================================================
    // 4/ ADD EVENT LISTENER : WHEN NEW STREAM IS AVAILABLE IN CONVERSATION
    //==========================================================
    conversation.on('streamListChanged', (streamInfo: { listEventType: string; isRemote: boolean; streamId: any; }) => {
      console.log("streamListChanged :", streamInfo);
      navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
       this.isCameraOn = true;
       })
    .catch(error => {
        console.log('Error accessing camera:', error);
        
       this.isCameraOn = false;
    });

      if (streamInfo.listEventType === 'added') {
        if (streamInfo.isRemote === true) {
          conversation.subscribeToMedia(streamInfo.streamId)
            .then((stream: any) => {
          
            
               
            }).catch((err: any) => {
              console.error('subscribeToMedia error', err);
            });
        }
      }
    });
    //=====================================================
    // 4 BIS/ ADD EVENT LISTENER : WHEN STREAM IS ADDED/REMOVED TO/FROM THE CONVERSATION
    //=====================================================
    conversation.on('streamAdded', (stream: { addInDiv: (arg0: string, arg1: string, arg2: {}, arg3: boolean) => void; streamId: string; }) => {
      stream.addInDiv('remote-container', 'remote-media-' + stream.streamId, {}, false);

    }).on('streamRemoved', (stream: { removeFromDiv: (arg0: string, arg1: string) => void; streamId: string; }) => {
      stream.removeFromDiv('remote-container', 'remote-media-' + stream.streamId);
    });

    //==============================
    // 5/ CREATE LOCAL STREAM
    //==============================
    ua.createStream({
      audioInputId: "",
      videoInputId: ""
    })
      .then((stream: { removeFromDiv: (arg0: string, arg1: string) => void; addInDiv: (arg0: string, arg1: string, arg2: {}, arg3: boolean) => void; }) => {

      
       

        // Save local stream
        localStream = stream;
       
        stream.removeFromDiv('local-container', 'local-media');
        stream.addInDiv('local-container', 'local-media', {}, true);
        this.connected="On"
     

        //==============================
        // 6/ JOIN CONVERSATION
        //==============================
        conversation.join()
          .then((response: any) => {
            //==============================
            // 7/ PUBLISH LOCAL STREAM
            //==============================
            conversation.publish(localStream);
          }).catch((err: any) => {
            console.error('Conversation join error', err);
          });

      }).catch((err: any) => {
        console.error('create stream error', err);
      });
  });
}
turnOnmic(){
  console.log('ask for mic');
}
turnOffmic(){
  console.log(' off mic');
}
turnOncamera(){
  console.log('ask for camera');
}
turnOffcamera(){
  console.log('off camera');
}
*/
}
