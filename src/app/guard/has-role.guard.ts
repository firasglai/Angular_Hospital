import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SpringAuthService } from '../services/authentication/spring-auth.service';
import { TokenService } from '../services/authentication/token.service';
@Injectable({
  providedIn: 'root'
})

export class HasRoleGuard implements CanActivate {
  constructor(private auth: SpringAuthService,
    private tokenService: TokenService
    
    ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log("this is the user"+this.auth.user['role'])
    return this.auth.user['role'].includes(route.data['role']);
  }
  
}
