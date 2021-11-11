import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromcr from './cr.reducer';

export interface State {
  Cr: fromcr.State
}

export const reducers: ActionReducerMap<State> = {
  Cr: fromcr.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const crState = createFeatureSelector<fromcr.State>(fromcr.crFeatureKey);
export const getCurrentEvent = createSelector(crState, (state: fromcr.State) => state.currentEvents);
export const getCountryList = createSelector(crState, (state: fromcr.State) => state.allCountries);
export const getStateList = createSelector(crState, (state: fromcr.State) => state.allStates);
