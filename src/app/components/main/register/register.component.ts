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
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { User, session } from 'src/app/models/user.model';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
import { AES } from 'crypto-js';

import { SpecialtyService } from 'src/app/services/specialty/specialty.service';
import { SpecialtyModel } from 'src/app/models/specialty.model';


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

//? TO INTEGRATE 
interface respo{
  token:string,
  user:User
}

//! DEPRECATED
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
 specialties: SpecialtyModel[] = [];
 getSpecialties() {
  this.specialtyService.getSpecialties().subscribe(
    data => {
      this.specialties = data;
    },
    error => {
      console.error('Error fetching specialties:', error);
    }
  );
}
  loading=false
  hide = true;
  hide1 = true;
  patientSelect=true
  
  public lottieConfig: AnimationOptions = {
    path: 'assets/animations/registerAnimation.json',
    loop: true,
    autoplay: true,
  };
  user: User = {
    fullName: '',
    password: '',
    email: '',
    role: '',
    gender: '',
    specialtyName:'',
  };
  signUpForm = new FormGroup(
    {
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      gender: new FormControl(''), 
      specialtyName: new FormControl('' ), 
    },
    { validators: passwordsMatchValidator() }
  );
  

  constructor(
    private authService:SpringAuthService,
    private specialtyService: SpecialtyService,
    private toastrService: ToastrService,
    private router: Router,
  ) {
    
   
  }
  ngOnInit(): void {
    this.getSpecialties();
  }
  
  get fullName() {
    return this.signUpForm.get('fullName');
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


  get gender() {
    return this.signUpForm.get('gender');
  }

  get specialtyName() {
    return this.signUpForm.get('specialtyName');
  }


submit() {
      if (!this.signUpForm.valid) return;
  
    const user = this.signUpForm.value as User;

  
    if (this.patientSelect) {
      user.role = 'PATIENT';
    } else {
     user.role = 'DOCTOR';
      if (!user.specialtyName) {
        console.error('Specialty is required for doctors');
        return;
      }
    }
   

    this.loading = true;
    


    setTimeout(() => {
      console.log(user);
      this.authService.register(user).subscribe(
        (response) => {
          console.log('Registration successful!', response);
          this.toastrService.success('Registration successful!');
          this.loading = false;
          this.router.navigate(['/login'], {
            queryParams: {
              email: user.email,
              password: user.password
            }
          });
       },
        (error) => {
          console.error('Error registering user', error);
          this.toastrService.error('Error registering user');
          this.loading = false;
        }
      );
    }, 1000); // Add a delay of 1 second (1000 milliseconds)
  }
  



  
}
