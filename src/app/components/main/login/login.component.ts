import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router , ActivatedRoute} from '@angular/router';
import { AnimationItem } from 'lottie-web/build/player/lottie_light';
import { AnimationOptions } from 'ngx-lottie';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
import { AES } from 'crypto-js';
import { TokenService } from 'src/app/services/authentication/token.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Profile } from 'src/app/models/profile';
import { Store,select } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';

import * as UserActions from '../../../store/actions/user-actions'
interface response{
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
  //? Loading spinner
  loading=false
  //? Password visibility
  hide = true;


  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private auth:SpringAuthService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private toast: ToastrService,
    private tokenService: TokenService,
    private userService: UsersService,
    private store:Store,
    private cookieService: CookieService,
  ) {
  }
  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe(params => {
      const email = params['email'];
      const password = params['password'];

      if (email && password) {
        this.loginForm.patchValue({
          email: email,
          password: password
        });
      }
    });
  }


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
    const user: Profile = { email: email!, password: password! };
  
    this.loading = true; //? Show loading spinner
  
    setTimeout(() => {
      this.auth.login(user).subscribe(
        (response) => {
          if (response && 'token' in response) {
            this.toast.success('Login successful welcome!', 'Welcome!', {progressBar:true});
            const resp = response as { token: string, userRole: string };
            this.tokenService.setToken(resp.token);
            this.tokenService.setUserRole(resp.userRole);
  
            this.userService.getCurrentUser().subscribe(
              (user) => {
                if (user) {
                  this.cookieService.set('currentUser', JSON.stringify(user));
                }
              },
              (error) => {
                console.error('Error getting current user', error);
                this.toast.error('Error getting current user');
              }
            );
            if (resp.userRole === "DOCTOR") {
              this.router.navigate(['/doctor']);
            } else if (resp.userRole === "PATIENT") {
              this.router.navigate(['/patient']);
            } else if (resp.userRole === "ADMIN") {
              this.router.navigate(['/admin']); 
            }
          }
        },
        (error) => {
          console.error('Error logging in', error);
          this.toast.error('Error logging in', 'Error Logging In', {progressBar:true} );
        }
      );
  
      this.loading = false; 
    }, 1000); 
  }
  
}
