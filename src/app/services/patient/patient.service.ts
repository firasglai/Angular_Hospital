import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from 'src/app/models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:8080/api/patients'; // Adjust the URL based on your backend

  constructor(private http: HttpClient) { }

  createPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/add`, patient);
  }

  savePatients(patients: Patient[]): Observable<Patient[]> {
    return this.http.post<Patient[]>(`${this.apiUrl}/addList`, patients);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getOnePatient(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}`);
  }

  editPatient(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/edit/${id}`, patient);
  }
  getByEmail(email: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/find-email/${email}`);
  }
}
