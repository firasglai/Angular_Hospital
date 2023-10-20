import { Component } from '@angular/core';
import { patientProfile } from 'src/app/models/user-profile';
import { patientService } from 'src/app/services/patientService';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  
  Patient!:patientProfile
  constructor(  
  

    private patientservice:patientService
     ) {// Get the current user profile once and map it to this.user1$ observable
    this.patientservice.patient.subscribe((k)=>{
        this.Patient=k
        console.log(this.Patient.medicalHistory.weight)   
      })}
  Onedit=false

  openedit(){
    this.Onedit=true
  }
  canceledit(){
    this.Onedit=false
  }
}
