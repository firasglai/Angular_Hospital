import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { from, map, Observable, of, switchMap, timestamp } from 'rxjs';
import { ProfileUser } from '../models/user-profile';
import { AuthenticationService } from './authentication.service';
import { initializeApp } from 'firebase/app';
import { Database, get, getDatabase, onValue, ref, set, update } from 'firebase/database';
import { environment } from 'src/environments/environment';
import { SpringAuthService } from './spring-auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.getUser()!.pipe(
      switchMap((user) => {
        if (!user?.profileid) {
          return of(null);
        }

        return   this.getUserById(user.profileid!)
      })
    );
  }

  get allUsers$(): Observable<ProfileUser[]> {
    const reff = ref(this.db, 'usersD/');
    return new Observable<ProfileUser []> ( (ob)=> onValue(reff,(snap)=>{
      let users:ProfileUser[]=[]
     snap.forEach((k)=>{
      this.currentUserProfile$.subscribe(((kk)=>{
      
        if(k.val()["uid"] !=kk?.uid){
          users.push(k.val() as ProfileUser)
        }
      }))

     })
    ob.next(users)

    }))  
  }

  private db: Database;
  constructor(
    private authService: SpringAuthService
  ) {
    const app = initializeApp(environment.firebase);
    this.db = getDatabase(app);

  }

  addUser(user: ProfileUser): Observable<any> {
    const reff = ref(this.db, 'usersD/'+ user?.uid);
    return from(set(reff, user));
  }

  updateUser(user: ProfileUser): Observable<any> {
    const reff = ref(this.db, 'usersD/'+ user?.uid);
   
    return from(update(reff, { ...user }));
  }
  getUserById(userId: string): Observable<ProfileUser | null> {
    const reff = ref(this.db, 'usersD/' + userId);
    return new Observable<ProfileUser | null>((ob) => {
      onValue(reff, (snapshot) => {
           
        const user = snapshot.val();
        if(user==null){
          let userr:ProfileUser = {
               uid:userId
          }
          this.addUser(userr).subscribe((kk)=>{
            ob.next(kk);
          })
        }else{
 ob.next(user ? user : null);
        }
       
      });
    });
  }
  
  
}
