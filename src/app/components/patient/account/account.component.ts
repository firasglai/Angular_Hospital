import { Component } from '@angular/core';
import { patientProfile } from 'src/app/models/user-profile';
import { patientService } from 'src/app/services/patientService';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  

  constructor(  
  

    private patientservice:patientService
     ) {

      }
  Onedit=false

  openedit(){
    this.Onedit=true
  }
  canceledit(){
    this.Onedit=false
  }
}
