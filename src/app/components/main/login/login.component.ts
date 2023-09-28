import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AnimationItem } from 'lottie-web/build/player/lottie_light';
import { AnimationOptions } from 'ngx-lottie';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { SpringAuthService } from 'src/app/services/spring-auth.service';
import { AES } from 'crypto-js';
interface resp{
  token:string,
  user:User
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
 
})
export class LoginComponent {
    public lottieConfig: AnimationOptions = {
    path: 'assets/animations/LoginAnimation.json',
    loop: true,
    autoplay: true,
  };


  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private auth:SpringAuthService,
    private router: Router,
    private toast: ToastrService
  ) {
  }
  ngOnInit(): void {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }
  
    const { email, password } = this.loginForm.value;
    const user: User = {email:email!, password:password!}
    this.auth.login(user).subscribe((k)=>{
      if(k!=null){
        let kk=k as resp
        localStorage.setItem('token',kk.token)
        
        const encryptionKey = '7azd45qsd646q5ddqs64fr6gerg7';
           
        const dataString = JSON.stringify(kk.user);

        // Encrypt the data string using AES encryption
        const encryptedData = AES.encrypt(dataString, encryptionKey).toString();
        
        // Store the hashed data in localStorage
        localStorage.setItem('udaw', encryptedData);
        this.auth.setuser(kk.user)
        if(kk.user.userRole=="DOCTOR"){
          window.location.href="/doctor"
        }
        if(kk.user.userRole=="PATIENT"){
          window.location.href="/patient"
        }
        if(kk.user.userRole=="ADMIN"){
          window.location.href="/admin"
        }
      }
    })
  }
  
}
