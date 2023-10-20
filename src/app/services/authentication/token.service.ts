import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly TOKEN_KEY = 'token';
  private readonly USER_DATA_KEY = 'userdata';
  private readonly USER_ROLE= "role" // New key for user data

  constructor() {}

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getUserData(): string | null {
    return localStorage.getItem(this.USER_DATA_KEY);
  }

  setUserData(userData: string): void {
    localStorage.setItem(this.USER_DATA_KEY, userData);
  }

  getUserRole(): string | null{
  return localStorage.getItem(this.USER_ROLE);
  }
  setUserRole(role:string):void {
     localStorage.setItem(this.USER_ROLE, role);
    }
    removeUserRole(): void {
    localStorage.removeItem(this.USER_ROLE);
    }
  

  
  removeUserData(): void {
    localStorage.removeItem(this.USER_DATA_KEY);
  }

}
