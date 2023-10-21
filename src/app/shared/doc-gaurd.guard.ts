import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SpringAuthService } from '../services/authentication/spring-auth.service';
import { TokenService } from '../services/authentication/token.service';

@Injectable({
  providedIn: 'root'
})
export class DocGuardGuard implements CanActivate {
  constructor(
    private auth: SpringAuthService,
     private router: Router,
     private tokenService:TokenService
     ) {}

  canActivate() {
    if (this.auth.isAuthenticated()) {
      const userRole = this.tokenService.getUserRole();
      if (!userRole) {
        this.router.navigate(['/login']); // Redirect to login if userRole is not found
        return false;
      }

      switch (userRole) {
        case "DOCTOR":
          this.router.navigate(['/doctor']);
          break;
        case "PATIENT":
          this.router.navigate(['/patient']);
          break;
        case "ADMIN":
          this.router.navigate(['/admin']);
          break;
        default:
          this.router.navigate(['/login']); // Redirect to login if invalid userRole
          return false;
      }

      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
