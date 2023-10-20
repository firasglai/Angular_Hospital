import { createAction } from '@ngrx/store';
import { props } from '@ngrx/store';
import { Profile } from 'src/app/models/profile';

export const setCurrentUser = createAction(
    '[User] Set Current User',
    props<{ user: Profile }>()
  );
export const clearCurrentUser = createAction(
    '[User] Clear Current User'
  );
  export const setAuthenticated = createAction(
    '[User] Set Authenticated'
    );
