import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpringAuthService } from 'src/app/services/authentication/spring-auth.service';
import { Profile } from 'src/app/models/profile';
import { Observable, Subject, of, takeUntil } from 'rxjs';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(
    private authService: SpringAuthService,
    private router: Router,
  ) {
    
  }
  private unsubscribe$ = new Subject<void>();
  isActive = false;
  isActive1 = false;
  user: Profile | null = {};

  ngOnInit(): void {
    this.authService.getActiveUser()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(
  ({ currentUser, userDetails }) => {
    if (currentUser) {
      this.user = currentUser;
      console.log("this is the user id: " + this.user.id);

      if (userDetails) {
        // Handle userDetails if needed
      }
    }
  },
  (error) => {
    console.error('Error getting active user', error);
  }
);
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
 
 

  toggleActive() {
    this.isActive = !this.isActive;
  }

  toggleActive1() {
    this.isActive1 = !this.isActive1;
  }
  
  SignOut(){
    this.authService.logout();
    this.router.navigate(['']);
  }

  
}
