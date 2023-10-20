import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
import { TokenService } from 'src/app/services/authentication/token.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard {
  constructor(private authService: SpringAuthService
    , private toastr: ToastrService, private router: Router) { }
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
   return this.authService.isLoggedIn$.pipe(
    tap((isLoggedIn) => {
      if (!isLoggedIn) {
        this.toastr.error('You are not authorized to access this page');
        this.router.navigate(['login']);
      }
    }))
  }
}