// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable} from 'rxjs';




  
@Injectable({
  providedIn: 'root'
})

export class tokenInterceptor implements HttpInterceptor {

  constructor() {
 
      
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token=""
    let jwttoken= req.clone({
      setHeaders:{
        Autorization:'Bearer '+token
      }
    })
    return next.handle(jwttoken)
  }
}
