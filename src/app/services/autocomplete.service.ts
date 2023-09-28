import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {
  private apiUrl = 'http://localhost:8080/cities/get';

  constructor(private http: HttpClient) { }

  searchCities(term: string): Observable<any[]> {
    const params = { term: term };
    return this.http.get<any[]>(this.apiUrl, { params: params });
  }
}
