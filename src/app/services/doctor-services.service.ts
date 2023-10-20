import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpringAuthService } from './authentication/spring-auth.service';
import { patientProfile } from '../models/user-profile';
import { Observable, take } from 'rxjs';
import { User } from '../models/user.model';
export interface specialty {
  id: string;
  name: string;
  description: string;
}
export interface Day {
  name: string;
  selected: boolean;
}
export interface ShiftHours {
  name: string;
  start: string; // Start time of the shift (e.g., "9:00 AM")
  end: string; // End time of the shift (e.g., "5:00 PM")
  days: Day[];
  errors: string[];
}
export interface Doctor {
  id: string;
  name: string;
  lastname: string;
  description: string;
  email: string;
  profilepic: string;
  lat: number;
  lon: number;
  specialty: specialty;
  patients: patientProfile[];
  phone: string;
  shiftHours: ShiftHours[];
}
@Injectable({
  providedIn: 'root',
})
export class DoctorServicesService {
  currentdoc: Doctor | undefined;
  user!: User;
  private apiUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient, private auth: SpringAuthService) {
    if (auth.isLoggedIn$) {
      if (auth.user?.user_status == 'done') {
      }
    }
  }
  createDoctor(doc: Doctor) {
    return this.http.post(this.apiUrl + '/doctors/add', doc);
  }
  get doctor$(): Observable<Doctor> {
    return this.http.get<Doctor>(this.apiUrl + '/doctors/');
  }

  getallspecialities() {
    return this.http.get(this.apiUrl + '/specialties');
  }
  getMypatients() {
    return this.http.get<patientProfile[]>(this.apiUrl + '/doctors/mypatients');
  }
  getappoitmentsById(id: String) {
    return this.http.get(this.apiUrl + '/appointments/' + id);
  }
  getappoitmentsByIds(id: number[]) {
    const params = {
      ids: id, // Format the dates as ISO strings
    };

    return this.http.get(this.apiUrl + '/appointments/List', { params });
  }
  getAppointmentsByDates(d1: Date, d2: Date) {
    const params = {
      date1: d1.toISOString(), // Format the dates as ISO strings
      date2: d2.toISOString(),
    };

    return this.http.get(this.apiUrl + '/doctors/Listbydate/' + d1 + '/' + d2);
  }

  updateappoitment(id: string, statu: string) {
    const params = {
      status: statu, // Format the dates as ISO strings
    };

    return this.http.put(
      this.apiUrl + '/appointments/' + id + '/updateStatus?status=' + statu,
      params
    );
  }
  approve(id: string, data: any) {
    return this.http.post(
      this.apiUrl + '/appointments/' + id + '/updateStatus1',
      data
    );
  }
}
