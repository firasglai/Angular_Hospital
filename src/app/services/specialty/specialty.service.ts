import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpecialtyModel } from '../../models/specialty.model';
import { User } from '../../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {
  private apiUrl = 'http://localhost:8080/api/specialties';

  constructor(private http: HttpClient) { }

  getSpecialties(): Observable<SpecialtyModel[]> {
    return this.http.get<SpecialtyModel[]>(this.apiUrl);
  }

  addSpecialty(specialty: SpecialtyModel): Observable<SpecialtyModel> {
    return this.http.post<SpecialtyModel>(`${this.apiUrl}/add`, specialty);
  }

  addSpecialties(specialties: SpecialtyModel[]): Observable<SpecialtyModel[]> {
    return this.http.post<SpecialtyModel[]>(`${this.apiUrl}/addList`, specialties);
  }

  deleteSpecialty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getOneSpecialty(id: number): Observable<SpecialtyModel> {
    return this.http.get<SpecialtyModel>(`${this.apiUrl}/${id}`);
  }
  
  getDoctorsBySpeciality(specialityName: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${specialityName}/doctors`);
  }
  
  
}