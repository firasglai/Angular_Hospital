import { Component, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observer, map, switchMap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersService } from 'src/app/services/users.service';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { User, session } from 'src/app/models/user.model';
import { SpringAuthService } from 'src/app/services/spring-auth.service';
import { AES } from 'crypto-js';
export function passwordsMatchValidator(): ValidatorFn {
  
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return {
        passwordsDontMatch: true,
      };
    }

    return null;
  };
}
interface respo{
  token:string,
  user:User
}
interface ProfileUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  status?:string
  chats?:string[]
  IncallId?:string
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hide = true;
  hide1 = true;
  public lottieConfig: AnimationOptions = {
    path: 'assets/animations/registerAnimation.json',
    loop: true,
    autoplay: true,
  };
  user: User = {

    firstname: '',
    lastname:'',
    password: '',
    email: '',
    userRole: 'DOCTOR',
    user_status : "OnRegister",
    profileid:""
  };
  signUpForm = new FormGroup(
    {
    
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    },
    { validators: passwordsMatchValidator() }
  );
patientSelect=true
  constructor(
    private auth:SpringAuthService,
    private toastrService: ToastrService,
    private router: Router,
    private usersService: UsersService
  ) {
    
   
  }
  ngOnInit(): void {}
  
  get name() {
    return this.signUpForm.get('name');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }
 loading=false
submit() {
  console.log(this.signUpForm.valid)
  if (!this.signUpForm.valid) return;
  if(this.patientSelect){
    this.user.userRole="PATIENT"
  }else{
    this.user.userRole="DOCTOR"
  }
  
  const {  email, password } = this.signUpForm.value;
  const defaultImgurl='male.jpg'
  if (!email || !password) return; // Handle null or undefined email or password
 this.user.email=email
 this.user.firstname=""
 this.user.password=password
 this.loading=true
 this.auth.register(this.user).subscribe((k)=>{
  if(k!=null){
    let kk=k as respo
    localStorage.setItem('token',kk.token)
    
    const encryptionKey = '7azd45qsd646q5ddqs64fr6gerg7';
       
    const dataString = JSON.stringify(kk.user);

    // Encrypt the data string using AES encryption
    const encryptedData = AES.encrypt(dataString, encryptionKey).toString();
    
    // Store the hashed data in localStorage
    localStorage.setItem('udaw', encryptedData);
    this.auth.setuser(kk.user)
   if(kk.user.userRole=="DOCTOR"){
     window.location.href="/doctor-register"
   }
   if(kk.user.userRole=="PATIENT"){
     window.location.href="/user-register"
   }
   if(kk.user.userRole=="ADMIN"){
     window.location.href="/admin"
   }
  }else{
    this.signUpForm.setErrors({
      email:"email already exists"
    })
  }
  this.loading=false
},(erroe)=>{
  this.signUpForm.setErrors({
    email:"email already exists"
  })
  this.loading=false
})



}
  
}
