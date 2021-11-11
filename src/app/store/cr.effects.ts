import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { UserSmall } from '../data';
import { currentEvents, currentEventSuccess, countryList, countryListSuccess, stateList, stateListSuccess } from './cr.actions';
import { DataService } from '../data.service';

@Injectable()
export class CrEffects {

  constructor(private actions$: Actions, private dataService: DataService) { }

  getCurrentEvent$ = createEffect(() => this.actions$.pipe(
    ofType(currentEvents),
    switchMap(payload =>
    this.dataService.getFrontPage(payload.userLoad).pipe(map(currentEvents =>
        currentEventSuccess({ allEvents: currentEvents }) // todo: add catchError
      )))));

  getCountryList$ = createEffect(() => this.actions$.pipe(
    ofType(countryList),
    switchMap(() =>
      this.dataService.getCountryCodes().pipe(map(countryList =>
        countryListSuccess({ allCountries: countryList }) // todo: add catchError
      )))));

  getStateList$ = createEffect(() => this.actions$.pipe(
    ofType(stateList),
    switchMap(() =>
      this.dataService.getState().pipe(map(stateList =>
        stateListSuccess({ allStates: stateList }) // todo: add catchError
      )))));
}
