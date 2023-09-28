import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  isOn=false
  previewDoctors(){
    this.isOn=true
  }
  closeServiceTab(){
    this.isOn=false
  }
}
