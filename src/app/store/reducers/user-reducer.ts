import { createReducer, on } from '@ngrx/store';
import { Profile } from 'src/app/models/profile';
import * as UserActions from '../actions/user-actions';
import { setCurrentUser,clearCurrentUser,setAuthenticated } from '../actions/user-actions';



export interface UserState {
  currentUser : Profile | null;
  isAuthenticated: boolean; 
 
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
};


export const userReducer = createReducer(
  initialState,
  on(setCurrentUser, (state, { user }) => {
    return {
      ...state,
      currentUser: user,
    
    };
  }),
  on(clearCurrentUser, (state) => {
    return {
      ...state,
      currentUser: null
    };
  }),
  on(setAuthenticated, (state) => {
    return {
      ...state,
      isAuthenticated: true, // Set isAuthenticated to true
    };
  })
);


      
