import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Profile } from 'src/app/models/profile';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:8080/api/users'; // Adjust the URL to match your backend API endpoint

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }
  getCurrentUser(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/me`);
  }

  getOneUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/find-email/${email}`);
  }
  
  updateUser(userId: number, updatedUser: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, updatedUser);
  }

  uploadProfileImage(userId: number, file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<string>(`${this.apiUrl}/${userId}/profile-image`, formData);
  }

  getProfileImage(userId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${userId}/profile-image`, { responseType: 'blob' });
  }
}