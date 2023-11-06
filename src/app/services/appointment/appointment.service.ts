// appointment.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from 'src/app/models/appointment';
import { StatusAPT } from 'src/app/enum/status-apt';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = 'http://localhost:8080/api/appointments'; // Adjust the URL based on your backend

  constructor(private http: HttpClient) { }

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getOneAppointment(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  saveAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/add`, appointment);
  }

  editAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/update`, appointment);
  }

  changeStatus(appointmentId: number, status: StatusAPT): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${appointmentId}/updateStatus?status=${status}`, null);
  }

  getPatientAppointments(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getDoctorAppointments(doctorId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  getUpcomingPatientAppointments(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/approved-appointments/patient/${patientId}`);
  }

  searchAppointments(patientName?: string, doctorName?: string): Observable<Appointment[]> {
    const params = {
      patientName: patientName || '',
      doctorName: doctorName || ''
    };
    return this.http.get<Appointment[]>(`${this.apiUrl}/search`, { params });
  }

  sendEmail(notificationEmail: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/send-email`, notificationEmail);
  }

  deleteAppointment(appointmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${appointmentId}`);
  }

  getUserAppointments(userId: number, status?: StatusAPT, date?: string): Observable<Appointment[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    if (date) {
      params = params.set('date', date);
    }
  
    return this.http.get<Appointment[]>(`${this.apiUrl}/user-appointments/${userId}`, { params });
  }
  getUserTodaysAppointments(userId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/user-appointments/today/${userId}`);
  }
  
}
