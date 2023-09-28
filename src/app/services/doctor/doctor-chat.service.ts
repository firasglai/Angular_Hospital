import { Injectable } from '@angular/core';
import { equalTo, get, getDatabase, limitToLast, onValue, orderByChild, orderByPriority, push, query, ref, set, update } from 'firebase/database';
import { Observable } from 'rxjs';
import { Chat } from 'src/app/models/chat';
export interface chatReq {
  id: string,
  doctorid: string,
  patientid: string,
  latmsg?: message,
  messages: message[]
}
export interface message {
  senderId: string,
  text: string,
  date: string
}
export interface statu {
  last_changed: string,
  state: string
}
export interface call {
  id:string,
  starterId: string,
  reciever:string,
  statu:string,
}
@Injectable({
  providedIn: 'root'
})
export class DoctorChatService {
  private db: any;
  constructor() {
    this.db = getDatabase();
  }

 starCall(chat:chatReq){
  const chatRef = ref(this.db, 'branche/' );
  const newref=push(chatRef)
 

    let newid=newref.key as string
    let bran:call={
      id:newid,
      reciever:chat.patientid,
      starterId:chat.doctorid,
      statu:"requesting",
    }
    set(ref(this.db,"branche/"+newid+'/'),bran)
     

    const chatsRef2 = ref(this.db, 'usersD/'+chat.patientid);
    const chatsRef3 = ref(this.db, 'usersD/'+chat.doctorid);
   return update(chatsRef2,{IncallId:newid}).then(()=>{
    update(chatsRef3,{IncallId:newid})
   })
  }
    

 ISpatientAvailatbil(uid:string){
    const chatsRef = ref(this.db, 'status/'+uid);
    console.log(uid)
    return get(chatsRef).then((snaphot)=>{
       let stat=snaphot.val() as statu
       console.log(snaphot.val())
       if(stat.state!="offline"){
        const chatsRef2 = ref(this.db, 'usersD/'+uid+"/IncallId");
       return get(chatsRef2).then((snaphot2)=>{
          let call=snaphot2.val()
          if(call==""){
            return true
          }else{
            return true
          }
          
        })
       }else{
        return false
       }
    })
  }
  getMyAllchats(uid:string){
    const chatsRef = ref(this.db, 'chats');
    const chatQuery = query(chatsRef, orderByChild('doctorid'), equalTo(uid));

    return get(chatQuery)
      .then((snapshot) => {
        let exist = false;
        let id = '';
        let list:chatReq[]=[]
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const chat = childSnapshot.val()as chatReq ;
            list.push(chat)
          });
        }
        console.log("list")
        return list

      })
      .catch((error) => {
        console.error('Error querying chats:', error);
        throw error;
      });

  }
  sendMessage(chat: chatReq, message: string) {
    const reff = ref(this.db, 'chats/' + chat.id + '/messages');
    const chatRef = ref(this.db, 'chats/' + chat.id + "/latmsg");
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


    const newMessageRef = push(reff);
    const messageData = {
      text: message,
      senderId: chat.doctorid,
      sentDate: formattedDate,
    };
    console.log(newMessageRef);
    set(newMessageRef, messageData)
    set(chatRef, messageData)

  }

  getChatById(chatId: string): Observable<chatReq | null> {
    const chatRef = ref(this.db, 'chats/' + chatId);
    return new Observable<chatReq | null>((observer) => {
      onValue(chatRef, (snapshot) => {
        const chatData = snapshot.val()
        let chat = chatData as chatReq
        chat.messages = Object.entries(chat.messages).map(([key, value]) => ({ id: key, senderId: value.senderId, date: value.date, text: value.text }));
        console.log(chatData)
        observer.next(chatData)

      });
    });
  }

  getChatMessages$(chatId: string, n: number): Observable<message[]> {
    const reff = ref(this.db, 'chats/' + chatId + '/messages');
    const queryAll = query(reff, orderByPriority(), limitToLast(n));
    return new Observable<message[]>((observer) => {
      onValue(queryAll, (snapshot) => {
        const messages = snapshot.val();
        let m: message[] = []
        let counter = 0

        snapshot.forEach((k) => {
          counter++

          m.push(k.val())


        })

        const messageList = messages ? messages : [];
        observer.next(m);
      });
    });
  }
  createChat(patid: string, docid: string): Promise<string> {
    const chatsRef = ref(this.db, 'chats');
    const chatQuery = query(chatsRef, orderByChild('doctorid'), equalTo(docid));

    return get(chatQuery)
      .then((snapshot) => {
        let exist = false;
        let id = '';

        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const chat = childSnapshot.val();
            if (chat.patientid === patid) {
              id = chat.id;
              exist = true;
            }
          });
        }

        if (!exist) {
          const newChat: chatReq = {
            id: '', // Assign a unique id to the new chat
            doctorid: docid,
            patientid: patid,
            messages: []

          };

          const newChatRef = push(chatsRef);
          newChat.id = newChatRef.key!;

          return set(newChatRef, newChat)
            .then(() => {
              id = newChatRef.key!;
              return id;
            })
            .catch((error) => {
              console.error('Error creating chat:', error);
              throw error;
            });
        } else {
          return id;
        }
      })
      .catch((error) => {
        console.error('Error querying chats:', error);
        throw error;
      });
  }


}
