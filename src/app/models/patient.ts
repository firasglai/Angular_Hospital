import { Gender } from '../enum/gender';
import { MedicalHistory } from './medical-history';
export interface Patient {
  id?: number;
  fullName: string;
  dateOfBirth: string; 
  email: string;
  address: string;
  gender: Gender;
  phone: string;
  medicalHistory: MedicalHistory;
  userId: number;
}
