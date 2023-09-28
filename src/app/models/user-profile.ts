import { Timestamp } from "firebase/firestore";
import { Doctor } from "../services/doctor-services.service";
import { Appoitment } from "./user.model";

export interface ProfileUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  status?:string
  chats?:string[]
  IncallId?:string
}
export interface patientDetails {
  patientid: String
  adress: String,
  weight: String,
  gender: String,
  heigth: String,
  appointmenthistory: appointmentHistory,


}

export interface patient {
  id: String
  name: String,
  lastname: String,
  title:String,
  profilePhoto:String,
  email: String,
  phone: String,
  patientDetails:patientDetails
}
interface appointmentHistory {
  history: AppointmentRecord[]
}
interface AppointmentRecord {
  date: Date;
  patientName: string;
  providerName: string;
  reasonForVisit: string;
  diagnoses: string[];
  treatments: string[];
  followUpInstructions: string;
}
export interface patientProfile{
  
    id: string,
    name: string,
    dateOfBirth: string,
    doctors:Doctor[],
    email: string,
    phone: string,
    address: string,
    gender: string,
    lastname:string,
    profilePic:string,
    appointments:Appoitment[]
    medicalHistory: {
    id:string,
    height:string,
    weight:string,
    allergies: string,
 
   

  }
  
}