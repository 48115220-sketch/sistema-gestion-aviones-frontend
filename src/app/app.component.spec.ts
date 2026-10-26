import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = `http://${window.location.hostname}:8080`;

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(this.baseUrl + '/auth/login', credentials);
  }

  guardarToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }

  getVuelos(): Observable<any> {
    return this.http.get(this.baseUrl + '/vuelos', { headers: this.getHeaders() });
  }

  crearVuelo(vuelo: any): Observable<any> {
    return this.http.post(this.baseUrl + '/vuelos', vuelo, { headers: this.getHeaders() });
  }

  getAviones(): Observable<any> {
    return this.http.get(this.baseUrl + '/aviones', { headers: this.getHeaders() });
  }

  getPersonal(): Observable<any> {
    return this.http.get(this.baseUrl + '/admin/personal', { headers: this.getHeaders() });
  }
}