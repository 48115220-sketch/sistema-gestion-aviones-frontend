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
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  guardarToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  obtenerToken(): string | null {
    return this.getToken();
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
  }

  getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  obtenerRol(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = JSON.parse(atob(payloadBase64));
      const userRoles: string[] = payloadDecoded.roles || payloadDecoded.authorities || [];
      if (userRoles.length > 0) {
        return userRoles[0].replace('ROLE_', '');
      }
      return payloadDecoded.sub || '';
    } catch (e) {
      return '';
    }
  }

  tieneRol(rolesEsperados: string[]): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadDecoded = JSON.parse(atob(payloadBase64));
      const userRoles: string[] = payloadDecoded.roles || payloadDecoded.authorities || [];
      return rolesEsperados.some(role => 
        userRoles.some(uRole => uRole === role || uRole === `ROLE_${role}`)
      );
    } catch (e) {
      return true;
    }
  }
}