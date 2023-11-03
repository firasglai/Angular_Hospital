import { StatusAPT } from '../enum/status-apt';
import { Doctor } from './doctor';
import { Patient } from './patient';
export interface Appointment {
  id?: number;
  date: Date; 
  reason: string;
  statusAPT?: StatusAPT;
  doctor: Doctor;
  patient: Patient;
}
