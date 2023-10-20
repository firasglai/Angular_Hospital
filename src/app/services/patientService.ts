import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { SpringAuthService } from './authentication/spring-auth.service';
import { patientProfile } from '../models/user-profile';
import {Doctor}from './doctor-services.service'
import { TokenService } from './authentication/token.service';
export interface respage{
  content:Doctor[],
  number:number,
  totalPages:number
}
@Injectable({
  providedIn: 'root'
})
export class patientService {
  private dataUrl = 'assets/patients.json'; // Path to the patients.json file
  private apiUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient,
    private tokenService: TokenService,
    private auth: SpringAuthService) {}

  get patient():Observable<patientProfile>{
    let uid= this.tokenService.getUserData()
   
    return this.http.get<patientProfile>(`${this.apiUrl}/patients/patient`) 
  }

  getPatients(): Observable<any[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(response => {
        if (response && Array.isArray(response.patients)) {
          return response.patients
        } else {
          return []; // Return an empty array if the patients array is not present or not an array
        }
      })
    );
  }
  getSuggestedPatients(): Observable<any[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(response => {
        if (response && Array.isArray(response.patients)) {
          return response.patients.slice(0, 5);
        } else {
          return []; // Return an empty array if the patients array is not present or not an array
        }
      })
    );
  }
  searchbydate(term1: string[] ): Observable<any[]> {
    const params = { array: term1};
    return this.http.get<any[]>(this.apiUrl+"/doctors/find", { params: params });
  }
  searchbydateandlocation(term1: string[] ,latt :number,lonn:number,dist:number): Observable<any[]> {
    const params = { array: term1,
      lat:latt,
      lon:lonn,
      distance:dist/115999};
    return this.http.get<any[]>(this.apiUrl+"/doctors/find-location", { params: params });
  }
  getalldoctors(i:number,sizee:number){
    
     const params = new HttpParams()
     .set('page', String(i))
     .set('size', String(sizee));
     return this.http.get<any[]>(this.apiUrl+"/doctors/getall", { params });
  }
  submitappoitment(datee:Date,reasonn:string,doctorr:Doctor,patientt:patientProfile){
    
    const params = { 
      id:'',
      date:datee,
      reason:reasonn,
      statusAPT:"PENDING",
      doctor:doctorr,
      patient:patientt

    };
    return this.http.post<any[]>(this.apiUrl+"/appointments/add", params);
 }
 subscribetodoctor(id:string,did:string){
  const params = { 
    id:id,
    did:did

  };
  return this.http.get<any[]>(this.apiUrl+`/doctors/${did}/addPatient/${id}`);
 }
 unsubscribetodoctor(id:string,did:string){
  const params = { 
    id:id,
    did:did

  };
  return this.http.get<any[]>(this.apiUrl+`/doctors/${did}/removePatient/${id}`);
 }
 getmyAllAppointments(id:string){
  return this.http.get<any[]>(this.apiUrl+`/appointments/patient/${id}`);
 }

 getMyDoctors(){
  return this.http.get<Doctor[]>(this.apiUrl+"/patients/mydoctors")
  }
}
