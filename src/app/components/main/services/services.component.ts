import { Component, OnInit } from '@angular/core';
import { SpecialtyService } from 'src/app/services/specialty/specialty.service';
import { SpecialtyModel } from 'src/app/models/specialty.model';
import { User } from 'src/app/models/user.model';
import { specialty } from './../../../services/doctor-services.service';
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  isOn=false
  specialties: SpecialtyModel[] = []; // Define an array to hold specialties
  doctors: User[] = []; // Define an array to hold doctors

  constructor(private specialtyService: SpecialtyService) { }
  ngOnInit(): void {
    this.getSpecialities();
  }

  previewDoctors(specialty: SpecialtyModel){
    this.isOn = true;
    this.specialtyService.getDoctorsBySpeciality(specialty.name).subscribe(data => {
      this.doctors = data;
    });
  }
  
  closeServiceTab(){
    this.isOn=false
  }

  getSpecialities() {
    this.specialtyService.getSpecialties().subscribe(data => {
      this.specialties = data;
      this.specialties.forEach(specialty => {
        specialty.image = `http://localhost:8080/${specialty.image}`;
      });
    });
  }
  
}
