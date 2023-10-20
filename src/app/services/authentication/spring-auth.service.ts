import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, catchError, config, of, switchMap, take, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { patientProfile } from '../../models/user-profile';
import { TokenService } from './token.service';
import { UsersService } from '../users/users.service';
import { Profile } from 'src/app/models/profile';

@Injectable({
  providedIn: 'root',
})
export class SpringAuthService {
  private apiUrl = 'http://localhost:8080/api'; 
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  private _currentUser$ = new BehaviorSubject<Profile | null>(null);
  currentUser$ = this._currentUser$.asObservable();
  user!: User;

  constructor(private http: HttpClient,
    private tokenService: TokenService,
    private userService: UsersService
    
   
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

  getCurrentUser(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/users/me`);
  }

  //! DEPRECATED the cuurentUser$ is not updated after login [object,object]
  updateCurrentUser(user: Profile | null) {
    this._currentUser$.next(user);
    console.log("currentUser object "+JSON.stringify(this._currentUser$.value));
  }
  
  

  isAuthenticated() {
    if (this.tokenService.getToken() == '') {
      this.tokenService.removeToken();
      this.tokenService.removeUserData();
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
    this.tokenService.removeUserData();
   this.tokenService.removeUserRole();
  }

  updateuser(uid: string) {
    return this.http.get(`${this.apiUrl}/auth/update/${uid}`);
  }

  addPatient(ex: patientProfile) {
    return this.http.post(`${this.apiUrl}/patients/add`, ex);
  }
}
