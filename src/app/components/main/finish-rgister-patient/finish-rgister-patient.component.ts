import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { patientProfile } from 'src/app/models/user-profile';
import { SpringAuthService } from 'src/app/services/spring-auth.service';

@Component({
  selector: 'app-finish-rgister-patient',
  templateUrl: './finish-rgister-patient.component.html',
  styleUrls: ['./finish-rgister-patient.component.css']
})
export class FinishRgisterPatientComponent implements OnInit {
  searchControll: FormControl = new FormControl();
  searchKeyword: string = '';
  searchResults: any[] = [];
  isDescriptionOn=false

  nameControll: FormControl = new FormControl(  "");
  lastnameControll: FormControl = new FormControl("");
  WeightControll: FormControl = new FormControl("");
  heigthControll: FormControl =new FormControl("");
  phoneControll: FormControl = new FormControl("");
  dateControll:FormControl = new FormControl("");
  allergiesControll:FormControl = new FormControl("");
  GenderControll:FormControl = new FormControl("");
  LocationControll:FormControl = new FormControl("");
  daterror=""
  nameerror=""
  lastnameerror=""
  Weighterror=""
  heigtherror=""
  phoneerror=""
  specialityerror=""
  gendererror=""

  phoneNumber: string = '';
  locationerror=""

constructor(private auth:SpringAuthService){
 
  if(localStorage.getItem("token")){
    if(localStorage.getItem("token")!.length==0){
      window.location.href=""
    }
  }else{
    window.location.href=""
  }
  this.WeightControll.setValue("0")
  this.heigthControll.setValue("0")
  this.nameControll.valueChanges.subscribe((value:string)=>{
    this.nameerror=""
   if(value.length>0&&value.length<3){
    this.nameerror="Please enter a valid name: length more than 2 characters"
   }
   if(value.length>0&& !/^[a-zA-Z]+$/.test(value)){
    this.nameerror="Please enter a valid name: no special characters"
   }
  })
    this.dateControll.valueChanges.subscribe((value:string)=>{
    this.daterror=""
  })
  this.GenderControll.valueChanges.subscribe((value:string)=>{
    this.gendererror=""
  })
  this.LocationControll.valueChanges.subscribe((value:string)=>{
    this.locationerror=""
  })
  this.heigthControll.valueChanges.subscribe((value:string)=>{
   if(value){
    if(value=="0" ){
      this.heigtherror="Please enter your heigth"
    }else{
      this.heigtherror=""
      
    }
   }else{
    this.heigtherror="Please enter your heigth"
   }
   let h=parseInt(this.heigthControll.value)
   console.log(h)
 
   if (h < 0) {
     // 'num' is negative
     this.heigtherror="Please enter your heigth  ( should be Positive number )"
    
   } else {

   }
   
  })
  this.WeightControll.valueChanges.subscribe((value:string)=>{
  
    if(value){
      if(value=="0" ){
        this.Weighterror="Please enter your weight"
      }else{
        this.Weighterror=""
        
      }
     }else{
      this.Weighterror="Please enter your weight"
     }
     let h=parseInt(this.WeightControll.value)
     console.log(h)
   
     if (h < 0) {
       // 'num' is negative
       this.Weighterror="Please enter your weight ( should be Positive number )"
      
     } else {
  
     }
  })
  this.lastnameControll.valueChanges.subscribe((value:string)=>{
    this.lastnameerror=""
   if(value.length>0&&value.length<3){
    this.lastnameerror="Please enter a valid last name: length more than 2 characters"
   }
   if(value.length>0&& !/^[a-zA-Z]+$/.test(value)){
    this.lastnameerror="Please enter a valid last name: no special characters or numbers"
   }
  })
  this.phoneControll.valueChanges.subscribe((value: string) => {
    this.phoneerror = "";
  
    if (value.length > 0 && value.length < 8) {
      this.phoneerror = "Please enter a valid phone number: length should be 8 digits";
    } 
    if (value.length > 0 && !/^\d+$/.test(value)) {
      this.phoneerror = "Please enter a valid phone number: only digits are allowed";
    } 
     if (value.length > 8) {
      this.phoneerror = "Please enter a valid phone number: length should be 8 digits";
    }
  });
}
  ngOnInit(): void {
    if(this.auth.getUserData()?.user_status=="done"){
    
      window.location.href="doctor"
    }
    console.log(this.auth.user)}

checkinputs():boolean{
let result=true

if (this.nameControll.value) {
    
  this.nameerror=""
   if(this.nameControll.value.length>0&&this.nameControll.value.length<3){
    this.nameerror="Please enter a valid name: length more than 2 characters"
    result= false;
  }
   if(this.nameControll.value.length>0&& !/^[a-zA-Z]+$/.test(this.nameControll.value)){
    this.nameerror="Please enter a valid name: no special characters"
    result= false;
  }
}else{
  result= false;
  this.nameerror="Please enter name"
}
   
if (this.lastnameControll.value ) {
  this.lastnameerror=""
  
  if(/^[a-zA-Z]+$/.test(this.lastnameControll.value)){
    if(this.lastnameControll.value.length>0&&this.lastnameControll.value.length<3){
      result= false;
      this.lastnameerror="Please enter a valid last name: length more than 2 characters"
     }
  }else{
    if(this.lastnameControll.value.length>0&& !/^[a-zA-Z]+$/.test(this.lastnameControll.value)){
      this.lastnameerror="Please enter a valid last name: no special characters or numbers"
      result= false; 
    }
  
  }
 
  
  
}else{
  this.lastnameerror="Please enter last name"
 
}

if (this.phoneControll.value && /^\d+$/.test(this.phoneControll.value)) {
  if(this.phoneControll.value.length!=8){
    this.phoneerror="Please enter valid phone number: 8 digits"
    result= false;
  }
}else{
  this.phoneerror="Please enter valid phone number"
  result= false;
}
console.log(this.dateControll.value.length)
if(this.dateControll.value==0){
  this.daterror="Please enter your bith date"
  result= false;
}


if(this.heigthControll.value){
  let h=parseInt(this.heigthControll.value)
  console.log(h)

  if (h < 0) {
    // 'num' is negative
    this.heigtherror="Please enter your heigth  ( should be Positive number )"
    result= false;
    console.log("The number is negative.");
  } else {
    // 'num' is non-negative (zero or positive)
    console.log("The number is non-negative.");
  }
  if(this.heigthControll.value=="0" ){
    this.heigtherror="Please enter your heigth"
    result= false;
  }else{
  
  }
 }else{
  this.heigtherror="Please enter your heigth"
  result= false;
 }



if(this.WeightControll.value){
  let h=parseInt(this.WeightControll.value)
  if(h<0){
    this.Weighterror="Please enter your weight  ( should be Positive number )"
    result= false;
  }
  if(this.WeightControll.value=="0" ){
    this.Weighterror="Please enter your weight"
   
    result= false;
  }else{

  }
 }else{
  this.Weighterror="Please enter your weight"
  result= false;
 }
  
 
if(this.LocationControll.value){
 
  if(this.WeightControll.value.length==0 ){
    this.locationerror="Please enter your location"
    result= false;
  }else{

  }
 }else{
  this.locationerror="Please enter your location"
  result= false;
 }
 if(this.GenderControll.value){
  
  if(this.GenderControll.value.length==0 ){
    this.gendererror="Please select your gender"
    result= false;
  }else{

  }
 }else{
  this.gendererror="Please enter your gender"
  result= false;
 }
return result
}
savePatient(){
  console.log(this.checkinputs())

  
  if(this.checkinputs()){
    let pic
    if(this.GenderControll.value=="Male"){
      pic="assets/avatars/patient/pp3.jpg"
    }else{
      pic="assets/avatars/patient/fpp8.jpg"
    }
  let alle=""

    let p : patientProfile={
      id:"",
      doctors:[],
      name:this.nameControll.value,
      lastname:this.lastnameControll.value,
      address:this.LocationControll.value,
      dateOfBirth:this.dateControll.value,
      email:this.auth.user.email,
      gender:this.GenderControll.value,
      phone:this.phoneControll.value,
      appointments:[],
      profilePic:pic,
      medicalHistory:{
        allergies:this.allergiesControll.value,
        height:this.heigthControll.value,
        weight:this.WeightControll.value,
        id:""
      }
  
    }
   
    this.auth.addPatient(p).pipe(take(1)).subscribe((k)=>{
      let user= k as patientProfile
      if(user.id){
        this.auth.updateuser(user.id).subscribe((k)=>{
          if(k){
           window.location.href="/patient"
          }
        })
      }
    })
  }
 
}
logout(){
  localStorage.setItem('token','')
  window.location.href="/"
}
}
