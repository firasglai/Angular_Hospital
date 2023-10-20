import { Token } from "@angular/compiler"
import { patientProfile } from "./user-profile"
import { Doctor } from "../services/doctor-services.service"
export interface User {
    id?: string;
    fullName?: string;
    email: string;
    password: string;
    role: string;
    user_status?: string;
    address?: string; 
    gender?: string; 
    phone?: string; 
    specialtyName?: string; 
  }
export interface session{
    token:string,
    user:User
}
export interface Appoitment{
    id:number,
    date:Date,
    reason:string,
    statusAPT:string
    patient?:patientProfile
    consultation?:Consultation
    doctor?:Doctor
}

export interface Consultation{
    id:string,
    dateConsultation:string,
    title:string,
    rapport:string,
    treatment:Treatment
  }
  interface Treatment{
    id:string,
    description:string,
    medicin?:string,
    duration?:string
  }
  