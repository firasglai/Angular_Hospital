// medical-history.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalHistory } from 'src/app/models/medical-history';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {

  private apiUrl = 'http://localhost:8080/api/medical-histories'; // Adjust the URL based on your backend

  constructor(private http: HttpClient) { }

  createMedicalHistory(medicalHistory: MedicalHistory): Observable<MedicalHistory> {
    return this.http.post<MedicalHistory>(`${this.apiUrl}/add`, medicalHistory);
  }

  deleteMedicalHistory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getOneMedicalHistory(id: string): Observable<MedicalHistory> {
    return this.http.get<MedicalHistory>(`${this.apiUrl}/${id}`);
  }

  getMedicalHistories(): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(`${this.apiUrl}`);
  }
}
