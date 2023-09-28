import { Injectable } from '@angular/core';
import { equalTo, get, getDatabase, limitToLast, onValue, orderByChild, orderByPriority, push, query, ref, set, update } from 'firebase/database';
import { chatReq, message } from '../doctor/doctor-chat.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientChatService {
  private db: any;
  constructor() {
    this.db = getDatabase();
  }
  updateCallstatu(id:string,statu:string){
       const chatsRef = ref(this.db,"branche/"+id+'/')

    update(chatsRef,{statu:statu})
  }
  getCallId(uid:string){
    const chatsRef = ref(this.db, 'usersD/'+uid+"/IncallId");
    return get(chatsRef)
  }
  getMyAllchats(uid:string){
    const chatsRef = ref(this.db, 'chats');
    const chatQuery = query(chatsRef, orderByChild('patientid'), equalTo(uid));
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
  getcallById(id:string){


    const chatRef = ref(this.db, 'branche/'+id+"/" );
    return get(chatRef).then((res)=>{
      return res.val()
    })
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
      senderId: chat.patientid,
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
    const chatQuery = query(chatsRef, orderByChild('patientid'), equalTo(docid));

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
