import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SpringAuthService } from '../services/authentication/spring-auth.service';
import { TokenService } from '../services/authentication/token.service';

@Injectable({
  providedIn: 'root'
})
export class PatGuardGuard implements CanActivate {
  constructor(
    private auth: SpringAuthService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      if (this.tokenService.getToken() == "") {
        this.router.navigate(['/']);
        return false;
      } else {
        const userRole = this.tokenService.getUserRole();
        console.log(userRole)
        let path = "";
        if (userRole === "DOCTOR") {
          path = "doctor";
        } else if (userRole === "PATIENT") {
          path = "patient";
        } else if (userRole === "ADMIN") {
          path = "admin";
        }

        if (!window.location.href.includes(path)) {
          this.router.navigate([`/${path}`]);
        }

        return true;
      }
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
