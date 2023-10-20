import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { SpringAuthService  } from 'src/app/services/authentication/spring-auth.service';
import * as UserActions from '../actions/user-actions';
import { get } from 'firebase/database';


@Injectable()
export class UserEffects {
    constructor(
        private actions$: Actions,
        private auth: SpringAuthService // Assuming you have a UserService to fetch user data
      ) {}

  loadUser$ = createEffect(() => 
  this.actions$.pipe(
    ofType(UserActions.setCurrentUser), // Add an action for triggering this effect
    mergeMap(() => this.auth.getCurrentUser()
    .pipe(
      map(user => UserActions.setCurrentUser({ user })),
      catchError(() => EMPTY)
    ))
  ));


}
