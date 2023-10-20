import { Injectable } from '@angular/core';
import { getDatabase, ref, push, set, update, onValue, orderByChild, query, limitToLast, limitToFirst, orderByKey, orderByPriority,remove, off } from 'firebase/database';
import { concatMap, firstValueFrom, forkJoin, from, map, Observable, of, pipe, switchMap, take, takeLast, timestamp } from 'rxjs';
import { CALL, Callstatu, Chat, Message, statu } from '../models/chat';
import { ProfileUser, patientProfile } from '../models/user-profile';
import { UsersService } from './users/users.service';
import { FieldValue, Timestamp, limit } from 'firebase/firestore';
import { UserProfile, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { PresenceService } from './presence.service';

import 'firebase/database';
@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private db: any;
  private user!:ProfileUser
/*
  constructor(private usersService: UsersService, private router: Router,private presence : PresenceService) {
    this.db = getDatabase();
    this.usersService.currentUserProfile$.subscribe((k)=>{
      this.user=k!
    })
  }

  get myChats$(): Observable<Chat[]> {
    const reff = ref(this.db, 'chats');
    return this.usersService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) => {
        const myQuery = query(reff, orderByChild('userIds'));
        return new Observable<Chat[]>((observer) => {
          onValue(myQuery, (snapshot?) => {
            let chatsList:Chat[]=[]
            if(snapshot){
            if(user?.chats){
              for(let chatID of user?.chats){
                const chatsData = snapshot.val();
                snapshot.forEach((cht)=>{
                  if(cht.val().id ==chatID){
                    chatsList.push(cht.val())
                  }
                })

              }


            }
          for(let chat of chatsList){
            let msg: Message[] =[]
          
             
               chat.messages =[]
          }
          

          console.log(chatsList)
            
             
        
            const updatedChats = this.addChatNameAndPic(user?.uid, chatsList);
            observer.next(updatedChats);
            }
           
          });
        });
      })
    );
  }
  /*
  createChat(otherUserr: patientProfile): Observable<string> {
    let otherUser:ProfileUser={
      uid:otherUserr.id
    }
    console.log(otherUser)
    const reff = ref(this.db, 'chats');
    return this.usersService.currentUserProfile$.pipe(
      take(1),
      concatMap((user: ProfileUser | null) => {
        if (user) {
          const chatData = {
            id:"",
            userIds: [user.uid, otherUser?.uid],
            users: [
              {
                displayName: user.displayName ?? '',
                photoURL: user.photoURL ?? '',
              },
              {
                displayName: otherUser?.displayName ?? '',
                photoURL: otherUser?.photoURL ?? '',
              },
            ],
            messages:[]
          };
         
          const newChatRef = push(reff);
          return from(set(newChatRef, chatData)).pipe(map(() => {
            chatData.id=newChatRef.key as string
            update(newChatRef, chatData)
            if(user.chats){
               user.chats.push(chatData.id)
            }else{
              user.chats=[chatData.id]
            }
            if(otherUser.chats){
              otherUser.chats.push(chatData.id)
           }else{
            otherUser.chats=[chatData.id]
           }
           
            console.log(otherUser)
            this.usersService.updateUser( user).pipe()
            this.usersService.updateUser( otherUser).pipe()
            return newChatRef.key as string}));
        } else {
          // Handle the case when currentUserProfile$ emits null
          return new Observable<string>((observer) => {
            observer.error('User profile not available');
          });
        }
      })
    );
  }


  isExistingChat(otherUserId: string): Observable<string | null> {
    return this.myChats$.pipe(
      take(1),
      map((chats) => {
        for (let i = 0; i < chats.length; i++) {
          const userIds = chats[i].userIds;
          if (Array.isArray(userIds) && userIds.includes(otherUserId)) {
          
            return chats[i].id;
          }
        }
        return null;
      })
    );
  }
  
  addChatMessage(chatId: string, message: string): Observable<any> {
    const reff = ref(this.db, 'chats/' + chatId + '/messages');
    const chatRef = ref(this.db, 'chats/' + chatId);
    const currentDate = new Date();

// Format the date and time
const formattedDate = currentDate.toLocaleString('tn', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

  console.log(new Date(formattedDate))
    return this.usersService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) => {
        const newMessageRef = push(reff);
        const messageData = {
          text: message,
          senderId: user?.uid,
          sentDate: formattedDate,
        };
        console.log(newMessageRef);
        return from(set(newMessageRef, messageData)).pipe(
          concatMap(() =>
            update(chatRef, { lastMessage: message, lastMessageDate:new  Date( formattedDate )})
          )
        );
      })
    );
  }
  
  getChatMessages$(chatId: string,n:number): Observable<Message[]> {
    const reff = ref(this.db, 'chats/'+ chatId+'/messages');
    const queryAll = query(reff, orderByPriority() ,limitToLast(n));
    return new Observable<Message[]>((observer) => {
      onValue(queryAll, (snapshot) =>{
      const messages = snapshot.val();
      let m:Message[]=[]
      let counter=0
     
      snapshot.forEach((k)=>{
        counter++
       
            m.push(k.val())
        
      
      })
      
      const messageList = messages ? messages : [];
      observer.next(m);
    });
  });
}
addChatNameAndPic(currentUserId: string | undefined, chats: Chat[]): Chat[] {
  if (chats && Array.isArray(chats)) {
    chats.forEach((chat: Chat) => {
      let otherUserIndex = chat.userIds?.indexOf(currentUserId ?? '') === 0 ? 1 : 0;
      if(currentUserId==chat.userIds[0]){
        otherUserIndex=1
      }else{
        otherUserIndex=0
      }
      let otherUser = chat.users?.[otherUserIndex];
      let displayName = otherUser?.displayName ?? '';
      let photoURL = otherUser?.photoURL ?? '';

      chat.chatName = displayName;
      chat.chatPic = photoURL;
      chat.messages = chat.messages;
    });
  }
  return chats;
}



getMyUserChats(): Observable<Chat[]> {
  return this.usersService.currentUserProfile$.pipe(
    concatMap((user) => {
      if (user && user.chats) {
        const chatObservables = user.chats.map((chatId) => this.getChatById(chatId));
        return forkJoin(chatObservables).pipe(
          map((chats) => chats.filter((chat) => chat !== null) as Chat[]) // Filter out null values
        );
      } else {
        return of([]);
      }
    })
  );
}
private getChatById(chatId: string): Observable<Chat | null> {
  const chatRef = ref(this.db, 'chats/' + chatId);
  return new Observable<Chat | null>((observer) => {
    onValue(chatRef, (snapshot) => {
      const chatData = snapshot.val();
      console.log(chatData)
      if (chatData) {
        const messages$ = this.getChatMessages$(chatId,0);
        messages$.subscribe((messages) => {
          const chat: Chat = {
            id: chatId,
            userIds: chatData.userIds,
            users: chatData.users,
            messages: messages,
          };
          observer.next(chat);
        });
      } else {
        observer.next(null);
      }
    });
  });
}

async starCall(chat:Chat,user:ProfileUser){

 
  let user1=await firstValueFrom( this.usersService.getUserById(chat.userIds[0]).pipe(take(1)));
  let user2=await firstValueFrom( this.usersService.getUserById(chat.userIds[1]).pipe(take(1)));
  if(!(user1?.IncallId)){
    let emptyONCALL=""
    console.log("XXXXXXXXXXXX")
    let reff2=ref(this.db,'usersD/'+user1?.uid+'/IncallId/')
    set(reff2,emptyONCALL)
  }
  if(!(user2?.IncallId)){
    let emptyONCALL=""

    let reff2=ref(this.db,'usersD/'+user2!.uid+'/IncallId/')
    set(reff2,emptyONCALL)
  }
  if(((user1?.IncallId == "" && user2?.IncallId =='') )){
    console.log(user1?.IncallId)
    console.log(user2?.IncallId)
    const chatRef = ref(this.db, 'branche/' );
    const newref=push(chatRef)
    let bran={
      id:"",
      userIds:chat.userIds
    }
  
      let newid=newref.key as string
      if(user1?.uid==user?.uid){
        console.log(user)
        console.log(user1)
        user1!.IncallId=newref.key as string
                 
        user2!.IncallId=newref.key as string
        set(ref(this.db,"branche/"+newid+'/'),{
          id:newid,
          userIds:chat.userIds,
          starterId: user1?.uid,
          reciever:user2?.uid,
          statu:"requesting Call",
          chatid:chat.id
        })
       }else{
        user2!.IncallId=newref.key as string
          user1!.IncallId=newref.key as string
          set(ref(this.db,"branche/"+newid+'/'),{
            id:newid,
            userIds:chat.userIds,
            starterId: user2?.uid,
            reciever:user1?.uid,
            statu:"requesting Call",
            chatid:chat.id
          })
       }
   
     
     
       this.usersService.updateUser(user1!)
       this.usersService.updateUser(user2!)
   
    return ""
  }else{
    if(user?.IncallId!=""){
      return "you are in a call"
    }else{
      return "other user in a call"
    }
  }
  return
  
}
  
cancelCallAttempt(user : ProfileUser){


}

AccpectCall(callID:string){
const ref1=ref(this.db,'branche/'+callID)

let dbd= this.getOtheCallStat(callID).pipe(take(1),map((k=>{
  let kk = k
  kk.statu="accepted"
  set(ref1,kk)
})))
dbd.subscribe().unsubscribe()

}
setOnCall(callID : string){

  const ref1=ref(this.db,'branche/'+callID)

  let dbd= this.getOtheCallStat(callID).pipe(take(1),map((k=>{
    let kk = k
    kk.statu="On"
    set(ref1,kk)
  })))
  dbd.subscribe().unsubscribe()
  
  
}

getOtheruserPresence(callID:string){
 

}


getOtheCallStat(callID:string): Observable<CALL>{
  const ref1=ref(this.db,"branche/"+callID)
 return new Observable<CALL>((ob)=>{ 
  onValue(ref1,(k)=>{
 

  let X= k.val() as CALL
  ob.next(X )
 })
  
  })

  
 
 }
 setCallleft(user : ProfileUser){
    
}

setfree(user : ProfileUser){


}


checkCall(userr:ProfileUser){

const reff=ref(this.db,"branche/"+userr['IncallId']+"/")
  onValue(reff,(k)=>{
    if(!(k.val())){
         let emptyONCALL=""
         let reff2=ref(this.db,'usersD/'+userr?.uid+'/IncallId/')
         set(reff2,emptyONCALL)
     
    }else{
      let call= k.val() as CALL
      console.log(call)
      if(call.recieverStat=="On"&& call.starterStat=="On"){
        
      }
    }
  }

  )


}
destroyCall(callId:string){
  const reff=ref(this.db,"branche/"+callId)
  remove(reff)
  
}
setReciverOnWindow(callID:string){
  const ref1=ref(this.db,'branche/'+callID)

  let dbd= this.getOtheCallStat(callID).pipe(take(1),map((k=>{
    let kk = k
    kk.recieverStat="On"
    set(ref1,kk)
  })))
  dbd.subscribe().unsubscribe()
}
setSenderOnWindow(callID:string){
  const ref1=ref(this.db,'branche/'+callID)

  let dbd= this.getOtheCallStat(callID).pipe(take(1),map((k=>{
    let kk = k
    kk.starterStat="On"
    set(ref1,kk)
  })))
  dbd.subscribe().unsubscribe()
}
setReciverOFFWindow(callID:string){
  const ref1=ref(this.db,'branche/'+callID)

  let dbd= this.getOtheCallStat(callID).pipe(take(1),map((k=>{
    let kk = k
    if(kk.starterStat=="Off"){
      this.destroyCall(callID)
    }else{
      kk.starterStat="Off"
      set(ref1,kk)
    }
  
  })))
  dbd.subscribe().unsubscribe()
}
setSenderOFFWindow(callID:string){
  const ref1=ref(this.db,'branche/'+callID)

  let dbd= this.getOtheCallStat(callID).pipe(take(1),map((k=>{
    let kk = k
    if(kk.recieverStat=="Off"){
      this.destroyCall(callID)
    }else{
      kk.starterStat="Off"
      set(ref1,kk)
    }
  
  })))
 let x= dbd.subscribe()
 x.unsubscribe()
}
*/

}