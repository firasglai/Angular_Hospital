import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Injectable, OnInit } from '@angular/core';
import { Observable, catchError, of, take } from 'rxjs';
import { User } from '../models/user.model';
import { AES } from 'crypto-js';
import { patientProfile } from '../models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class SpringAuthService {
  private apiUrl = 'http://localhost:8080/api'; // Replace with your Spring Boot API URL
  user: User = { id: '', email: '', password: '' }
  currentUser$: Observable<User> = new Observable<User>((ob) => {
    if (this.isAuthenticated()) {
      if (this.GetToken() != "") {
        this.getUser().pipe(
          take(1),
          catchError((error) => {
            console.log('Error occurred:', error);

            const status = error.status; // 403


            console.log('Status:', status == 403);
            if (status == 403) {
              localStorage.setItem('token', '')
              localStorage.setItem('udaw', '');
            }

            // Return a default user object
            return of({ id: '', email: '', password: '' });
          })
        ).subscribe((k) => {
          console.log(k);
          if (k != null) {
            let kk = k as User;
            this.user = kk
            const encryptionKey = '7azd45qsd646q5ddqs64fr6gerg7';
           

            const dataString = JSON.stringify(kk);

            // Encrypt the data string using AES encryption
            const encryptedData = AES.encrypt(dataString, encryptionKey).toString();
            
            // Store the hashed data in localStorage
            localStorage.setItem('udaw', encryptedData);
            ob.next(kk)
            this.currentUser$ = new Observable<User>((ob) => {
              ob.next(kk);
              ob.complete();
            });
          } else {
            // The error handler above will handle the case where k is null,
            // so you don't need to handle it separately here.
          }
        });
      }
    }
  });

  constructor(private http: HttpClient) {



  }



  register(user: User) {
    console.log(user);
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  login(user: User) {
    console.log(user);
    return this.http.post(`${this.apiUrl}/auth/authenticate`, user);
  }

  isAuthenticated() {
    if(localStorage.getItem('token') == ""){
              localStorage.setItem('token', '')
              localStorage.setItem('udaw', '');
    }
    return localStorage.getItem('token') !== null;
  }

  GetToken() {
    return localStorage.getItem('token') || '';
  }

  setuser(user: User) {
    this.currentUser$ = new Observable<User>((ob) => {
      ob.next(user);
      ob.complete(); // Add complete() to indicate the completion of the observable
    });
    this.currentUser$.subscribe();
  }

  getUser() {
    return this.http.get<User>(`${this.apiUrl}/auth/get`);
  }
  private encryptionKey = '7azd45qsd646q5ddqs64fr6gerg7';

  decryptUserData(encryptedData: string): User {
    const decryptedData = AES.decrypt(encryptedData, this.encryptionKey).toString();
    let user=JSON.parse(decryptedData) as User
   
    return JSON.parse(decryptedData) as User;
  }
  getUserData(): User | null {
    const encryptedData = localStorage.getItem('udaw');
    const CryptoJS = require('crypto-js');
    const encryptionKey = '7azd45qsd646q5ddqs64fr6gerg7';
    const decryptedData = AES.decrypt( localStorage.getItem("udaw")!, encryptionKey).toString(CryptoJS.enc.Utf8);
    // Convert the decrypted string back to the original object
    const decryptedObject = JSON.parse(decryptedData);
        let u =decryptedObject as User
 

    if (u) {
      return u
    }
    return null;
  }
  logout(){
    localStorage.setItem('token', '')
    localStorage.setItem('udaw', '');
  }
  updateuser(uid:string){

    return this.http.get(`${this.apiUrl}/auth/update/${uid}`)
  }
  addPatient(ex:patientProfile){
    
    return this.http.post(`${this.apiUrl}/patients/add`,ex)
  }
}
