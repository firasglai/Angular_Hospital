
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultation } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  private apiUrl = 'http://localhost:8080/api/consultations';

  constructor(private http: HttpClient) { }

  addConsultation(consultation: Consultation): Observable<Consultation> {
    return this.http.post<Consultation>(`${this.apiUrl}/add`, consultation);
  }

  editConsultation(consultation: Consultation): Observable<Consultation> {
    return this.http.put<Consultation>(`${this.apiUrl}/update`, consultation);
  }

  deleteConsultation(consultationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${consultationId}`);
  }

  getConsultations(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}`);
  }

  getOneConsultation(consultationId: number): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.apiUrl}/${consultationId}`);
  }
}
