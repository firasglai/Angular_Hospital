import { createAction,props } from '@ngrx/store';

export const LoginRequest = createAction(
    '[Auth] Login Request',
 props<{ credentials: {username: string, password: string} }>()
 );
