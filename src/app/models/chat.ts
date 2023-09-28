import { Timestamp } from '@angular/fire/firestore';
import { ProfileUser } from './user-profile';

export interface Chat {
  id: string;
  lastMessage?: string;
  lastMessageDate?: Date & Timestamp;
  userIds: string[];
  users: ProfileUser[];
  statu?:string,
  // Not stored, only for display
  chatPic?: string;
  chatName?: string;
  messages?:Message[]
}

export interface Message {
  text: string;
  senderId: string;
  sentDate: Date & Timestamp;
}
export interface Call{
  id:string
  chatid:string
  userIds: string[];
}
export interface statu {
  statu:string,
  date:string
}
export interface Callstatu {
  id:string,
  statu:string
}
export interface CALL {
  id:string,
  chatId:string,
reciever:string,
starterId:string,
  statu:string,
  userIds:string
  recieverStat?:string,
  starterStat?:string
  starteCallWindows?:callWindow,
  recieverCallWindows?:callWindow
}
export interface callWindow{
  currentCallwindowID:string,
  callwindows:WindowI[]
}
export interface WindowI{
   id:string,
   statu:string
}