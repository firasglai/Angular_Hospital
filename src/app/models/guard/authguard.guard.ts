import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, take } from 'rxjs';
import { SpringAuthService } from 'src/app/services/spring-auth.service';
import { User } from '../user.model';
import { AES } from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard implements CanActivate {
  constructor(private auth:SpringAuthService,private router:Router){

  }
  canActivate(){
    if(this.auth.isAuthenticated()){
      if(this.auth.GetToken()==""){
        return true
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
                path="doctor-register"
              }
            }
           }else{
            if(u.userRole=="DOCTOR"){
              path="doctor"
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
           window.location.href="/"+path
           return false
      
    
      }
     
      
    }else{
    
      return true
    }
    
  }
 
  
  
}
