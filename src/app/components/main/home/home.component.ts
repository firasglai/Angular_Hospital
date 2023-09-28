import { Component,OnInit } from '@angular/core';
import {faCaretDown ,faPhone,faEnvelope,faLocationDot} from '@fortawesome/free-solid-svg-icons'
import { faInstagram , faFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { trigger, state, style, animate, transition ,keyframes} from '@angular/animations';
import { AfterViewInit ,ViewChild, ElementRef } from '@angular/core';
import  * as chatbotService  from '../chat-component/openai.service';

import { HttpClient } from '@angular/common/http';
import { AnimationItem } from 'lottie-web/build/player/lottie_light';
import { AnimationOptions } from 'ngx-lottie';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  
})


export class HomeComponent implements OnInit {
  options: AnimationOptions = {
    path: '/assets/animations/thanks.json',
  };
  faCaretDown=faCaretDown
  services = [{serviceName:'General check-ups' ,serviceImage:'/assets/icons/stethoscope.png'},
  {serviceName:'Vaccinations and immunizations',serviceImage:'/assets/icons/syringe.png'},
  {serviceName:'Diagnosis and treatment'       ,serviceImage:'/assets/icons/medical-history.png'},
  {serviceName:"Women's health"                ,serviceImage:'/assets/icons/female.png'},
  {serviceName:"Men's health"                  ,serviceImage:'/assets/icons/male.png'},
  {serviceName:'Chronic disease'               ,serviceImage:'/assets/icons/heart.png'},
  {serviceName:'Mental health'                 ,serviceImage:'/assets/icons/mental-health.png'},
  {serviceName:'Pediatric care'                ,serviceImage:'/assets/icons/baby.png'},
  {serviceName:'Geriatric care'                ,serviceImage:'/assets/icons/wheelchair.png'},
];
 
  animationItem!: AnimationItem;
 
  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    this.animationItem.loop = true;
    this.animationItem.play();
  }
  faLocationDot=faLocationDot
  faEnvelope=faEnvelope
  faPhone=faPhone
  faYoutube=faYoutube
  faFacebook=faFacebook
  faInstagram=faInstagram
  messageHistory: string[] = [];
  inputMessage: string = '';
  inputVal:any = "";
 dataText: string[] = ['Easily locate and book appointments with qualified healthcare professionals in your area using our online search bar.', 'Take control of your healthcare journey and book your next appointment online today.'];
 textToDisplay = '';
 messages: string[] = ['Hello', 'How are you?', 'I am fine, thank you.'];
 currentMessageIndex: number = 0;
 @ViewChild('videoPlayer', { static: false }) videoplayer!: ElementRef
 @ViewChild('lottieContainer', {static: true}) private lottieContainer!: ElementRef;


 constructor() {}


  ngOnInit(): void {
    this.displayNextMessage();
 
  
  }
  displayNextMessage(): void {
    if (this.currentMessageIndex < this.messages.length) {
      setTimeout(() => {
        this.currentMessageIndex++;
        this.displayNextMessage();
      }, 3500);
    }
  }
  typeWriter(text: string, i: number, fnCallback: () => void) {
    if (i < text.length) {
      if (text[i] === '\n') {
        this.textToDisplay += '<br>';
      } else {
        this.textToDisplay += text[i];
      }
  
      setTimeout(() => {
        this.typeWriter(text, i + 1, fnCallback);
      }, 100);
    } else if (typeof fnCallback === 'function') {
      setTimeout(fnCallback, 700);
    }
  }
  
  StartTextAnimation(i: number) {
    if (typeof this.dataText[i] === 'undefined') {
      setTimeout(() => {
        this.StartTextAnimation(0);
      }, 20000);
    }
  
    if (i < this.dataText[i].length) {
      this.typeWriter(this.dataText[i], 0, () => {
        this.StartTextAnimation(i + 1);
      });
    }
  }
  
  
}