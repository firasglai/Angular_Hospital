import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../reducers/user-reducer';
import { Profile } from 'src/app/models/profile';

const selectUserState = createFeatureSelector<UserState>('currentUser');

export const selectCurrentUser = createSelector(
  selectUserState,
  (state) => state.currentUser
);
