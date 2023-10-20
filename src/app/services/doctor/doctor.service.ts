// doctor.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from 'src/app/models/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = 'http://localhost:8080/api/doctors'; // Adjust the URL based on your backend

  constructor(private http: HttpClient) { }

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}`);
  }

  getDoctor(doctorId: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${doctorId}`);
  }

  createDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.apiUrl}/add`, doctor);
  }

  saveDoctors(doctors: Doctor[]): Observable<Doctor[]> {
    return this.http.post<Doctor[]>(`${this.apiUrl}/addList`, doctors);
  }

  updateDoctor(doctorId: string, doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/${doctorId}`, doctor);
  }

  deleteDoctor(doctorId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${doctorId}`);
  }

  getDoctorsBySpeciality(specialityName: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/specialty/${specialityName}`);
  }
  
  getByEmail(email: string): Observable<Doctor> {
  return this.http.get<Doctor>(`${this.apiUrl}/find-email/${email}`);
  }
}
