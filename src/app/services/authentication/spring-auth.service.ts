import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, catchError, config, of, switchMap, take, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { patientProfile } from '../../models/user-profile';
import { TokenService } from './token.service';
import { UsersService } from '../users/users.service';
import { Profile } from 'src/app/models/profile';
import { CookieService } from 'ngx-cookie-service';
import { Doctor } from 'src/app/models/doctor';
import { Patient } from 'src/app/models/patient';
@Injectable({
  providedIn: 'root',
})
export class SpringAuthService {
  private apiUrl = 'http://localhost:8080/api'; 
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  private _currentUser$ = new BehaviorSubject<Profile | null>(null);
  currentUser$ = this._currentUser$.asObservable(); 
  private _userDetails$ = new BehaviorSubject<Patient | Doctor | null>(null);
  userDetails$ = this._userDetails$.asObservable();
  currentUser : Profile | null = null;
  user!: User;

  constructor(private http: HttpClient,
    private tokenService: TokenService,
    private userService: UsersService,
    private cookieService: CookieService,
  ) {
    this._isLoggedIn$.next(!!tokenService.getToken());
  }
  
  register(user: User) {
    console.log(user);
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  login(user: Profile) {
    return this.http.post(`${this.apiUrl}/auth/login`, user)
  }


 

getActiveUser(): Observable<{ currentUser: Profile | null, userDetails: Patient | Doctor | null }> {
  const currentUserData = this.cookieService.get('currentUser');
  const userDetailsData = this.cookieService.get('userDetails');

  const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
  const userDetails = userDetailsData ? JSON.parse(userDetailsData) : null;

  this._currentUser$.next(currentUser);
  this._userDetails$.next(userDetails);

  return of({ currentUser, userDetails });
}


  //? A FUTURE FUNCTION TO STORE CURRENT DOCTOR/PATIENT/ADMIN IN COOKIES STORAGE
  getUserDetails(uid: string) {

  }
  

  isAuthenticated() {
    if (this.tokenService.getToken() == '') {
      this.tokenService.removeToken();
    }
    return this.tokenService.getToken() !== null;
  }
  
  isPatient() {
    if (this.tokenService.getUserRole() == 'PATIENT') {
      return true;
    }
    return false;
  }
  isDoctor() {
    if (this.tokenService.getUserRole() == 'DOCTOR') {
      return true;
    }
    return false;
  }
  isAdmin() {
    if (this.tokenService.getUserRole() == 'ADMIN') {
      return true;
    }
    return
  }

  logout() {
    this.tokenService.removeToken();
   this.tokenService.removeUserRole();
   this.cookieService.delete('currentUser');
   this.cookieService.delete('userDetails');
  }

  updateuser(uid: string) {
    return this.http.get(`${this.apiUrl}/auth/update/${uid}`);
  }

  addPatient(ex: patientProfile) {
    return this.http.post(`${this.apiUrl}/patients/add`, ex);
  }
}
