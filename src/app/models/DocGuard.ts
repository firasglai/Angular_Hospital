import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SpringAuthService } from '../services/spring-auth.service';
import { AES } from 'crypto-js';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class DocGuard implements CanActivate {
  constructor(private auth:SpringAuthService,private router:Router){

  }
  canActivate( ){
    if(this.auth.isAuthenticated()){
      if(this.auth.GetToken()==""){
        return false
      }else{
        let path=""
        const CryptoJS = require('crypto-js');
        const encryptionKey = '7azd45qsd646q5ddqs64fr6gerg7';
        const decryptedData = AES.decrypt( localStorage.getItem("udaw")!, encryptionKey).toString(CryptoJS.enc.Utf8);
        // Convert the decrypted string back to the original object
        const decryptedObject = JSON.parse(decryptedData);
            let u =decryptedObject as User
           if(u.user_status=="OnRegister"){
            if(u.userRole=="DOCTOR"){
              path="doctor-register"
              
            }else{
              if(u.userRole=="PATIENT"){
                path="user-register"
              }
            }
           }else{
            if(u.userRole=="DOCTOR"){
              path="doctor-register"
              
              return true
           }else{
 
            if(u.userRole=="PATIENT"){
              path="patient"
            }
            if(u.userRole=="ADMIN"){
              path="ADMIN"
            }
           }
           }
           console.log(path)
           window.location.href=path
           return true
      
    
      }
     
      
    }else{
    
      return false
    }
    
  }
    
  
}
