import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BlogComponent } from './components/main/blog/blog.component';
import { BookAppoitmentComponent } from './components/main/book-appoitment/book-appoitment.component';
import { DoctorsComponent } from './components/main/doctors/doctors.component';
import { GalleryComponent } from './components/main/gallery/gallery.component';
import { HomeComponent } from './components/main/home/home.component';
import { ServicesComponent } from './components/main/services/services.component';
import { LoginComponent } from './components/main/login/login.component';
import { RegisterComponent } from './components/main/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/doctor/dashboard/dashboard.component';
import { AccountComponent } from './components/doctor/account/account.component';
import { AnalyticsComponent } from './components/doctor/analytics/analytics.component';
import { InboxComponent } from './components/doctor/inbox/inbox.component';
import { MainComponent } from './components/main/main.component';
import { DoctorComponent } from './components/doctor/doctor.component';
import { TransactionComponent } from './components/doctor/transaction/transaction.component';
import { AppoitmentComponent } from './components/doctor/appoitment/appoitment.component';
import { PatientlistComponent } from './components/doctor/patientlist/patientlist.component';
import { ChatWindowComponent } from './components/main/chat-window/chat-window.component';

import { DashboardComponent as DashboardComponentp } from './components/patient/dashboard/dashboard.component';
import { AccountComponent as AccountComponentp } from './components/patient/account/account.component';
import { AnalyticsComponent as AnalyticsComponentp } from './components/patient/analytics/analytics.component';
import { InboxComponent as InboxComponentp} from './components/patient/inbox/inbox.component';

import { TransactionComponent as TransactionComponentp} from './components/patient/transaction/transaction.component';
import { AppoitmentComponent as AppoitmentComponentp } from './components/patient/appoitment/appoitment.component';
import { PatientlistComponent as  PatientlistComponentp} from './components/patient/patientlist/patientlist.component';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { PatientComponent } from './components/patient/patient.component';
import { AuthguardGuard } from './models/guard/authguard.guard';
import { FinishRgisterDoctorComponent } from './components/main/finish-rgister-doctor/finish-rgister-doctor.component';
import { FinishRgisterPatientComponent } from './components/main/finish-rgister-patient/finish-rgister-patient.component';
import { DocGaurdGuard } from './shared/doc-gaurd.guard';
import { PatGuardGuard } from './shared/pat-guard.guard';
import { SearchDoctorComponent } from './components/patient/search-doctor/search-doctor.component';


const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['doctor']);
const routes: Routes = [
 
  {path:"",component:MainComponent,children:[
    {path:"",component:HomeComponent,canActivate: [AuthguardGuard]},
    {path:"book", component:BookAppoitmentComponent,canActivate: [AuthguardGuard]},
    {path:"doctors",component:DoctorsComponent,canActivate: [AuthguardGuard]},
    {path:"services",component:ServicesComponent,canActivate: [AuthguardGuard]},
    {path:"gallery",component:GalleryComponent,canActivate: [AuthguardGuard]},
    {path:"blog",component:BlogComponent,canActivate: [AuthguardGuard]},
    {path:"login",component:LoginComponent,canActivate: [AuthguardGuard]},
    {path:"CreateAccount",component:RegisterComponent,canActivate: [AuthguardGuard]},

  ]},
  {
    path : "chat", component:ChatWindowComponent
  }
  ,
  {
    path : "doctor-register", component:FinishRgisterDoctorComponent ,canActivate: [DocGaurdGuard],
  }
  ,
  {
    path : "user-register", component:FinishRgisterPatientComponent ,canDeactivate: [PatGuardGuard]
  }
  ,
  {path:"doctor",component:DoctorComponent , canActivate: [DocGaurdGuard],
   children : [{
    path : "", component:DashboardComponent, canActivate: [DocGaurdGuard]
   },
   {
    path : "account", component:AccountComponent, canActivate: [DocGaurdGuard]
   },
   {
    path : "analytics", component:AnalyticsComponent, canActivate: [DocGaurdGuard]
   },
   {
    path : "inbox", component:InboxComponent, canActivate: [DocGaurdGuard]
   },
   {
    path : "transaction", component:TransactionComponent, canActivate: [DocGaurdGuard]
   },
   {
    path : "appoitment", component:AppoitmentComponent, canActivate: [DocGaurdGuard]
   },
   {
    path : "patientlist", component:PatientlistComponent, canActivate: [DocGaurdGuard]
   }]},
   {
    path:"patient", component:PatientComponent,
    children : [{
      path : "", component:DashboardComponentp,canActivate: [PatGuardGuard]
     },
     {
      path : "search", component:SearchDoctorComponent,canActivate: [PatGuardGuard]
     },
     {
      path : "account", component:AccountComponentp,canActivate: [PatGuardGuard]
     },
     {
      path : "analytics", component:AnalyticsComponentp,canActivate: [PatGuardGuard]
     },
     {
      path : "inbox", component:InboxComponentp,canActivate: [PatGuardGuard]
     },
     {
      path : "transaction", component:TransactionComponentp,canActivate: [PatGuardGuard]
     },
     {
      path : "appoitment", component:AppoitmentComponentp,canActivate: [PatGuardGuard]
     },
     {
      path : "patientlist", component:PatientlistComponentp,canActivate: [PatGuardGuard]
     }]
   }, { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
