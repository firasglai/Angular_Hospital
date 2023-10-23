import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/main/home/home.component';
import { FormsModule } from '@angular/forms';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';

import { BlogComponent } from './components/main/blog/blog.component';
import { GalleryComponent } from './components/main/gallery/gallery.component';
import { ServicesComponent } from './components/main/services/services.component';
import { DoctorsComponent } from './components/main/doctors/doctors.component';
import { RegisterComponent } from './components/main/register/register.component';
import { LoginComponent } from './components/main/login/login.component';
import { HeaderComponent } from './components/main/header/header.component';
import { BookAppoitmentComponent } from './components/main/book-appoitment/book-appoitment.component';
import { LottieModule } from 'ngx-lottie';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ChatComponentComponent } from './components/main/chat-component/chat-component.component';
import { CursorEffectDirective } from './cursor-effect.directive';
import { DashboardComponent } from './components/doctor/dashboard/dashboard.component';
import { DashboardComponent as DashboardComponentp } from './components/patient/dashboard/dashboard.component';
import { AccountComponent } from './components/doctor/account/account.component';
import { InboxComponent } from './components/doctor/inbox/inbox.component';

import { AccountComponent as AccountComponentp } from './components/patient/account/account.component';
import { InboxComponent as InboxComponentp } from './components/patient/inbox/inbox.component';
import { TransactionComponent as TransactionComponentp } from './components/patient/transaction/transaction.component';
import { PatientlistComponent as PatientlistComponentp } from './components/patient/patientlist/patientlist.component';

import { MainComponent } from './components/main/main.component';
import { DoctorComponent } from './components/doctor/doctor.component';
import { TransactionComponent } from './components/doctor/transaction/transaction.component';
import { PatientlistComponent } from './components/doctor/patientlist/patientlist.component';
import { NgChartsModule } from 'ng2-charts';
import { environment } from 'src/environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { ChatsService } from './services/chats.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateDisplayPipe } from './models/pipes/date-display.pipe';
import { ToastrModule } from 'ngx-toastr';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { PresenceService } from './services/presence.service';
import { ChatWindowComponent } from './components/main/chat-window/chat-window.component';
import { AppoitmentComponent } from './components/doctor/appoitment/appoitment.component';
import { MatSelectModule } from '@angular/material/select';
import { AppoitmentComponent as AppoitmentComponentp } from './components/patient/appoitment/appoitment.component';
import { PatientComponent } from './components/patient/patient.component';
import { MatRadioModule } from '@angular/material/radio';
import { TokenInterceptorService } from './services/authentication/token-interceptor.service';
import { FinishRgisterDoctorComponent } from './components/main/finish-rgister-doctor/finish-rgister-doctor.component';
import { FinishRgisterPatientComponent } from './components/main/finish-rgister-patient/finish-rgister-patient.component';
import { PatGuardGuard } from './shared/pat-guard.guard';
import { DocGuardGuard } from './shared/doc-gaurd.guard';
import { DoctorServicesService } from './services/doctor-services.service';
import { SearchDoctorComponent } from './components/patient/search-doctor/search-doctor.component';
import { FilterAppointmentsPipe } from './models/pipes/filter-appointments.pipe';
import {MatStepperModule} from '@angular/material/stepper';
import { StepperComponent } from './components/patient/stepper/stepper.component';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './store/reducers/user-reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

//? MDB IMPORTS

//import { EffectsModule } from '@ngrx/effects';
//import { UserEffects } from './store/effects/user-effects';
export function playerFactory() {
  return import('lottie-web');
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BlogComponent,
    GalleryComponent,
    ServicesComponent,
    DoctorsComponent,
    RegisterComponent,
    LoginComponent,
    HeaderComponent,
    BookAppoitmentComponent,
    ChatComponentComponent,
    CursorEffectDirective,
    DashboardComponent,
    AccountComponent,
    InboxComponent,
    MainComponent,
    DoctorComponent,
    TransactionComponent,
    AppoitmentComponent,
    PatientlistComponent,
    DateDisplayPipe,
    ChatWindowComponent,
    PatientComponent,
    AccountComponentp,
    InboxComponentp,
    TransactionComponentp,
    PatientlistComponentp,
    AppoitmentComponentp,
    DashboardComponentp,
    FinishRgisterDoctorComponent,
    FinishRgisterPatientComponent,
    SearchDoctorComponent,
    FilterAppointmentsPipe,
    StepperComponent,
  ],
  imports: [
    StoreModule.forRoot({currentUser : userReducer}, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
    }),
    MatMenuModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    MatRadioModule,
    AppRoutingModule,
    FontAwesomeModule,
    FontAwesomeModule,
    LottieModule.forRoot({ player: playerFactory }),
    NgChartsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatListModule,
    MatSelectModule,
    MatIconModule,
    ToastrModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
    MatStepperModule,
    //? MDB IMPORTS


  ],
  providers: [
    FaIconLibrary,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
