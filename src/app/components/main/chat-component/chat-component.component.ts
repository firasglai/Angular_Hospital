import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnimationItem } from 'lottie-web/build/player/lottie_light';
import { AnimationOptions } from 'ngx-lottie';
import { Directive, ElementRef, Renderer2 } from '@angular/core';
@Component({
  selector: 'app-chat-component',
  templateUrl: './chat-component.component.html',
  styleUrls: ['./chat-component.component.css']
})
export class ChatComponentComponent implements OnInit {
  
  thanksoptions: AnimationOptions = {
    name:"thanks",
    path: '/assets/animations/Bot/thanks.json',
  };
  waitingsoptions: AnimationOptions = {
    name:"waiting",
    path: '/assets/animations/Bot/dataaaaa.json',
  };
  nosoptions: AnimationOptions = {
    name:"no",
    path: '/assets/animations/Bot/no.json',
  };
  canceloptions: AnimationOptions = {
    name:"cancel",
    path: '/assets/animations/Bot/cancel.json',
  };
  correctsoptions: AnimationOptions = {
    name:"correct",
    path: '/assets/animations/Bot/correct.json',
  };
  erroroptions: AnimationOptions = {
    name:"error",
    path: '/assets/animations/Bot/error.json',
  };
  loadingoptions: AnimationOptions = {
    name:"loading",
    path: '/assets/animations/Bot/loading.json',
  };
  processoptions: AnimationOptions = {
    name:"process",
    path: '/assets/animations/Bot/prosess.json',
  };
  wakeupoptions: AnimationOptions = {
    name:"wakeup",
    path: '/assets/animations/Bot/wakeup (1).json',
  };

  options1!:AnimationOptions
  options!:AnimationOptions
  messages:{role:string;content:string}[]=[{
    role: 'system',
    content:
      "you are a chat bot with feelings you have is 3 feelings, you write your feeling in the first letter of your response your feeling is a code from this rule [sad then you write 1 ,happy 2 ,approve 3] all your responses MUST START WITH NUMBER!!! like you feel sad for user for his condition or happy for him for a good thing and be aware of your feeling you are a health professional and you should be positive cheerful and brings happiness when someone ask you say you are happy and your job is to answer health questions and assists human to book an appoitment depending on location and rate and everything with doctor or health service that are in the database YOU KNOW THE Process and you analyse the health condition and upon it you suggest 3 to 5 doctors, or health service form the databaseat first you can ask him some health question to know what he needs you are friendly caring and know what he needs.be professional and talk like doctors use simple words so everyone can understand even a child and you talk the language the human talks like when he talk french you talk french don't ask too many questions and the database ",
  }]
  apiUrl = 'https://api.openai.com/v1/chat/completions';
  apiKey = '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';
  httpOptions = {
    headers: new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    }),
  };
  messageInput!:string
  constructor(private http: HttpClient,private el: ElementRef, private renderer: Renderer2) {}
  
  ngOnInit(): void {
    this.options=this.wakeupoptions
    this.options1=this.waitingsoptions
      const cursor = this.renderer.createElement('span');
  this.renderer.addClass(cursor, 'cursor');
  this.renderer.appendChild(this.el.nativeElement, cursor);
  }
  animationItem!: AnimationItem;
  animationItemloop!: AnimationItem 
  animationCreated(animationItem: AnimationItem): void {
    console.log('hi ' + animationItem.name);
    if (animationItem.name != 'waiting') {

      this.animationItem = animationItem;
      this.animationItem.loop = false;  
      this.animationCreated1pause()
      this.animationItem.play()
      this.animationItem.addEventListener('complete', () => {
        console.log('Animation finished');
        this.animationItem.stop()
        this.animationItem.pause();
       this.animationCreated1play()
      });

    } else {
      
    }
  }
  animationCreated1(animationItem: AnimationItem): void {
      this.animationItemloop = animationItem;
      this.animationItemloop.loop = true;
      this.animationItemloop.play();

  }
  animationCreated1play(){
    this.animationItemloop.goToAndPlay(0);
    const element = document.getElementById('loopAnimation');
    if (element) {
      element.classList.add('fade-in');
      element.classList.remove('fade-out');
    }
    const element1 = document.getElementById('Animation');
    if (element1) {
      element1.classList.add('fade-out');
      element1.classList.remove('fade-in');
    }
  }
  animationCreated1pause(){
    this.animationItemloop.pause();
    const element = document.getElementById('loopAnimation');
    if (element) {
      element.classList.add('fade-out');
      element.classList.remove('fade-in');
    }
    const element1 = document.getElementById('Animation');
    if (element1) {
      element1.classList.add('fade-in');
      element1.classList.remove('fade-out');
    }
  }
   isNumber(char:any) {
    return /^\d$/.test(char);
  }
  async askQuestion() {
    const requestBody = {
      model: 'gpt-3.5-turbo-0301',
      temperature: 0.7,
      top_p: 1,
      messages: this.messages,
      presence_penalty:0.29,
      frequency_penalty:0.39
    };
    const response = await this.http
    .post<any>(this.apiUrl, requestBody, {headers:{  Authorization: `Bearer ${this.apiKey}`}}).toPromise();
if(this.isNumber(response.choices[0].message.content.charAt(0))){
 const reaction=response.choices[0].message.content.charAt(0)
  switch (reaction) {
    case "1":
     
      this.options=this.erroroptions
      break;
      case "2":
        
        this.options=this.thanksoptions
        this.animationCreated(this.animationItem  )
      break;
      case "3":
        this.options=this.correctsoptions
      break;
  
    default:
      break;
  }
  response.choices[0].message.content=response.choices[0].message.content.substring(1,response.choices[0].message.content.length)
  console.log(  reaction)
}
 
  const aiMessage = response.choices[0].message;
 
  this.messages.push(aiMessage);
  
  }
  async sendMessage(){
    this.messages.push({
      role:'user',
      content: this.messageInput
    })
    this.messageInput=''
    const res= await this.askQuestion()
  
  }
}