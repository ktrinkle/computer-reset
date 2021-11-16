import { Action, createReducer, on } from '@ngrx/store';
import { frontPage, CountryList, StateList } from '../data';
import { currentEventSuccess, stateListSuccess, countryListSuccess } from './cr.actions';

export const crFeatureKey = 'Cr';

export interface State {
  currentEvents: frontPage,
  allCountries: Array<CountryList>,
  allStates: Array<StateList>
}

export const initialState: State = {
  currentEvents: undefined,
  allCountries: new Array<CountryList>(),
  allStates: new Array<StateList>()
};


export const crReducer = createReducer(
  initialState,

  on(currentEventSuccess, (state, { allEvents }) => ({
    ...state,
    currentEvents: allEvents
  })),

  on(countryListSuccess, (state, { allCountries }) => ({
    ...state,
    allCountries: allCountries
  })),

  on(stateListSuccess, (state, { allStates }) => ({
    ...state,
    allStates: allStates
  }))
);


export function reducer(state: State | undefined, action: Action): any {
  return crReducer(state, action);
}
