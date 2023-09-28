import { AfterViewInit, Component } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { slideInAnimation } from './animations';
import { PresenceService } from './services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  public animationTrigger!: string; // Add the animationTrigger property

  public lottieConfig: AnimationOptions = {
    path: 'assets/animations/background.json',
    loop: true,
    autoplay: true,
  };

  constructor(private presnce:PresenceService) {}
}