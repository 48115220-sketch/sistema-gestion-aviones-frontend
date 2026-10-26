import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public apiService: ApiService, private router: Router) {}

  onLogout(): void {
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }
}