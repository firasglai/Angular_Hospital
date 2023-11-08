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
import { AppoitmentComponent  as DoctorAppointments} from './components/doctor/appoitment/appoitment.component';
import { PatientlistComponent } from './components/doctor/patientlist/patientlist.component';
import { ChatWindowComponent } from './components/main/chat-window/chat-window.component';
import { DashboardComponent as DashboardComponentp } from './components/patient/dashboard/dashboard.component';
import { AccountComponent as PatientAccount} from './components/patient/account/account.component';
import { AnalyticsComponent as AnalyticsComponentp } from './components/patient/analytics/analytics.component';
import { InboxComponent as InboxComponentp } from './components/patient/inbox/inbox.component';
import { TransactionComponent as TransactionComponentp } from './components/patient/transaction/transaction.component';
import { PatientlistComponent as PatientlistComponentp } from './components/patient/patientlist/patientlist.component';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { PatientComponent } from './components/patient/patient.component';
import { StepperComponent } from './components/patient/stepper/stepper.component';
import { AuthguardGuard } from './guard/authguard.guard';
import { FinishRgisterDoctorComponent } from './components/main/finish-rgister-doctor/finish-rgister-doctor.component';
import { FinishRgisterPatientComponent } from './components/main/finish-rgister-patient/finish-rgister-patient.component';
import { DocGuardGuard } from './shared/doc-gaurd.guard';
import { PatGuardGuard } from './shared/pat-guard.guard';
import { SearchDoctorComponent } from './components/patient/search-doctor/search-doctor.component';
import { HasRoleGuard } from './guard/has-role.guard';
import { ProfilePageComponent } from './components/global/profile-page/profile-page.component';
import { CalendarComponent as PatientCalendar } from './components/patient/calendar/calendar.component';
import { AppointmentsComponent } from './components/patient/appointments/appointments.component';
import { DoctorCalendarComponent } from './components/doctor/doctor-calendar/doctor-calendar.component';
import { ConsultationComponent as DoctorConsultation } from './components/doctor/consultation/consultation.component';
import { ConsultationComponent as PatientConsultation } from './components/patient/consultation/consultation.component';
const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['doctor']);
const routes: Routes = [
  //? Checking the guard routes and the token, role passed in the interceptor 
    {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: HomeComponent, },
      {
        path: 'book',
        component: BookAppoitmentComponent,
       
      },
      {
        path: 'doctors',
        component: DoctorsComponent,
       
      },
      {
        path: 'services',
        component: ServicesComponent,
   
      },
      {
        path: 'gallery',
        component: GalleryComponent,
       
      },
      { path: 'blog', component: BlogComponent },
      {
        path: 'login',
        component: LoginComponent,
 
      },
      {
        path: 'CreateAccount',
        component: RegisterComponent,
   
      },
    ],
  },
  {
    path: 'chat',
    component: ChatWindowComponent,
  },

  {
    path: 'doctor',
    component: DoctorComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
    
      },
     
      {
        path: 'account',
        component: ProfilePageComponent,
  
      },
      {
        path: 'analytics',
        component: AnalyticsComponent,
      
      },
      {
        path: 'calendar',
        component: DoctorCalendarComponent,
      
      },
     
      {
        path: 'transaction',
        component: TransactionComponent,
    
      },
      {
        path: 'appointments',
        component: DoctorAppointments,
     
      },
      {
        path: 'consultation',
        component: DoctorConsultation,
     
      },
      {
        path: 'patientlist',
        component: PatientlistComponent,
   
      },
    ],
  },
  {
    path: 'patient',
    component: PatientComponent,
    children: [
      {
        path: '',
        component: DashboardComponentp,
     
      },
      {
        path: 'complete-register',
        component: StepperComponent,
      },
      {
        path: 'search',
        component: SearchDoctorComponent,
        canActivate: [PatGuardGuard],
      },
      {
        path: 'account',
        component: ProfilePageComponent,
        canActivate: [PatGuardGuard],
      },
      {
        path: 'analytics',
        component: AnalyticsComponentp,
        canActivate: [PatGuardGuard],
      },
      {
        path: 'appointments',
        component: AppointmentsComponent,
        canActivate: [PatGuardGuard],
      },
      
      {
        path: 'consultation',
        component: PatientConsultation,
        canActivate: [PatGuardGuard],
      },
      {
        path: 'transaction',
        component: TransactionComponentp,
        canActivate: [PatGuardGuard],
      },
      {
        path: 'calendar',
        component: PatientCalendar,
        canActivate: [PatGuardGuard],
      },
      {
        path: 'patientlist',
        component: PatientlistComponentp,
        canActivate: [PatGuardGuard],
      },
    ],
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule],
})
export class AppRoutingModule {}
