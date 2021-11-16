import { createAction, props } from '@ngrx/store';
import { frontPage, CountryList, StateList, UserSmall } from '../data';


export const currentEvents = createAction(
  '[Cr] getCurrentEvent',
  props<{ userLoad: UserSmall }>()
  );

export const currentEventSuccess = createAction(
  '[Cr] LoadCurrentEvent',
  props<{ allEvents: frontPage }>()
);

export const countryList = createAction(
  '[Cr] getCountryList');

export const countryListSuccess = createAction(
  '[Cr] LoadCountryList',
  props<{ allCountries: CountryList[] }>()
);

export const stateList = createAction(
  '[Cr] getStateList');

export const stateListSuccess = createAction(
  '[Cr] LoadStateList',
  props<{ allStates: StateList[] }>()
);
