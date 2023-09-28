import { AfterViewInit, Component } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { slideInAnimation } from '../../animations';
import { ChangeDetectorRef } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [slideInAnimation]
})
export class MainComponent implements AfterViewInit {
  inn=false
  public lottieConfig: AnimationOptions = {
    path: 'assets/animations/background.json',
    loop: true,
    autoplay: true,
  };
  constructor(private changeDetectorRef: ChangeDetectorRef,private router:Router) {}
  ngAfterViewInit(): void {
this.inn=true
this.router.getCurrentNavigation()
  }
  
  
}
