import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc,DocumentData, setDoc, collection, serverTimestamp , Timestamp } from '@angular/fire/firestore';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, from, of } from 'rxjs';
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication/auth2.service';
import { getDatabase, ref, onDisconnect, onValue, Database, get, DatabaseReference, set } from 'firebase/database';
import { User } from '../models/user.model';
import { DocumentReference, DocumentSnapshot, getDoc } from 'firebase/firestore';
import { ProfileUser } from '../models/user-profile';
import { Router } from '@angular/router';
import { list } from 'firebase/storage';
import { SpringAuthService } from './authentication/spring-auth.service';
import { DoctorServicesService } from './doctor-services.service';
import { patientService } from './patientService';
import { Profile } from '../models/profile';


interface status{
  
    state: string,
    last_changed: Database & Timestamp,

}
@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  userID?:number | undefined
  userpresence$!:Observable<any>
  constructor(
    private auth: SpringAuthService,
    private firestore: Firestore,
    private router : Router,
   

  ) {
    const app = initializeApp(environment.firebase);
    this.db = getDatabase(app);
 

    this.updateOnUser().subscribe()
   
    this.updateOnAway()
    this.auth.currentUser$.subscribe((k)=>{
      if(k?.id){
        this.userID=k?.id
      }else{
        this.userID=0
      }
     
   
      this.setPresenceOn(k?.id!).subscribe((l)=>{
 
      })
     })
   
  }
  updateontherway(){
    if(this.userpresence$){
       return   this.userpresence$.subscribe((k)=>{

    })
    }else{
      return
    }

  }
  getPresenceO(uid:string):Observable<any>{
    if(uid==""){
       return new Observable
    }else{
      return new Observable<any>((observer)=>{
         
        const connection = ref(this.db, 'users/'+uid);
    onValue(connection, (snapshot)=>{
      observer.next(snapshot.val())
      return snapshot.val()
    })
        })
    }
   
  }

  private db: Database;

  updateOnUser(): Observable<any> {

   
    const connection = ref(this.db, '.info/connected');
    
   
    var isOfflineForDatabase = {
      state: 'offline',
      last_changed: this.timestamp(),
  };
  
  var isOnlineForDatabase = {
      state: 'online',
      last_changed: this.timestamp(),
  };
    return new Observable<string>((observer) => {
      onValue(connection, (snapshot) => {
        this.auth.currentUser$.subscribe((user)=>{
         

        const connected = snapshot.val();
        if (snapshot.val() == false) {
          return;
      };
      
      const userStatusDatabaseRef =ref(this.db,'/status/' +  user!.id); 
        onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase).finally(() => {
          // The promise returned from .onDisconnect().set() will
          // resolve as soon as the server acknowledges the onDisconnect() 
          // request, NOT once we've actually disconnected:
          // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect
  
          // We can now safely set ourselves as 'online' knowing that the
          // server will mark us as offline once we lose connection.
        
          
          return set(userStatusDatabaseRef,isOnlineForDatabase);
          
      }); 
        const status = connected ? 'online' : 'offline';
        
        observer.next(status);})
      });
    }).pipe(
      switchMap((status: string) => {
        if (status === 'online') {

          this.auth.currentUser$.subscribe((user)=>{
          this.setPresenceOn(user?.id!)
          })
          return this.auth.currentUser$;

          
        } else {
          return of(null);
        }
      }),
      tap((user) => {
        if (user) {
        
        }
      })
    );
  }

  updateOnAwayOther(){
       
    const connection = ref(this.db, '/status/' + this.userID);
  
return new Observable<string>((observer) => {

  
  onValue(connection, (snapshot) => {

    observer.next(snapshot.val())

  })})
  }
  updateOnAway(): void {
    var isOfflineForDatabase = {
      state: 'away',
      last_changed : this.timestamp(),
  };
  
  var isOnlineForDatabase = {
      state: 'online',
      last_changed: this.timestamp(),
  };
    document.onvisibilitychange = () => {
      if (document.visibilityState !== 'visible') {
        this.auth.currentUser$.subscribe((user: Profile | null) => {
          this.auth.currentUser$
          if (user) {
            const userStatusDatabaseRef =ref(this.db,'/status/' +  user!.id); 
            set(userStatusDatabaseRef,isOfflineForDatabase)
          }
        });
      } else {
        this.auth.currentUser$.subscribe((user: Profile | null) => {
          if (user) {
            const userStatusDatabaseRef =ref(this.db,'/status/' +  user!.id); 
            set(userStatusDatabaseRef,isOnlineForDatabase)
          }
        });
      }
    };
  }

getPresence(uid:string):Observable<string>{

  const userStatusDatabaseRef =ref(this.db,'/status/' + uid);
  return  new Observable<string>((observer) => {
    onValue(userStatusDatabaseRef, (snapshot) => {
      observer.next(snapshot.val()["state"])
      return observer
    })

  })
}
setPresence(uid:string):Observable<string>{
  
  var isOfflineForDatabase = {
    state: 'offline',
    last_changed: this.timestamp(),
};

  const userStatusDatabaseRef =ref(this.db,'/status/' + uid);
return  new Observable<string>(() => { set(userStatusDatabaseRef,isOfflineForDatabase).then(()=>{
  this.router.navigate(['']);
})

}
)

}

setPresenceOn(uid:number):Observable<string>{
  
  var isOfflineForDatabase = {
    state: 'online',
    last_changed: this.timestamp(),
};

  const userStatusDatabaseRef =ref(this.db,'/status/' + uid);
return  new Observable<string>(() => { set(userStatusDatabaseRef,isOfflineForDatabase).then(()=>{
 
})

}
)

}
  private timestamp(): any {

    const timestamp = new Date;
 

   return   timestamp.toUTCString().toString();
    
    
  }


}
