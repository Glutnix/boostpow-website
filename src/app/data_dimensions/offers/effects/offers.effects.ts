import { Injectable } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { Observable, from } from 'rxjs';
import { AlertsActionTypes } from '@app/data_dimensions/alerts/actions/alerts';
import ErrorConstants from '@app/helpers/error-constants';
import { OffersActionTypes, RedirectAction,  GetStatus, GetStatusComplete, GetBoostJob, GetBoostJobComplete, GetBoostJobUtxos, GetBoostJobUtxosComplete, GetBoostSearch, GetBoostSearchComplete } from '../actions/offers.actions';
import { ApiService } from '@app/services/api.service';
import { ApplicationActionTypes } from '@application/actions/application';
import { environment } from '@environments/environment';
import { apiMapErrorString } from '@app/helpers/apiErrorMapper';
import { Router } from '@angular/router';
import { parseStatus } from '@offers/parsers/parse-status';
import { parseBoostJob } from '@offers/parsers/parse-boost-job';
import { parseBoostSearch } from '@offers/parsers/parse-boost-search';

@Injectable()
export class OffersEffects {

  @Effect()
  getStatus$: Observable<Action> = this.actions$.pipe(
    ofType<GetStatus>(OffersActionTypes.GetStatus),
    mergeMap(action => {
      return this.apiService
        .getStatus(action.payload)
        .pipe(
          mergeMap((r: any) => {
            return from([
              new GetStatusComplete(parseStatus(r.response)),
              { type: ApplicationActionTypes.hideLoading }
            ]);
          }),
          catchError((err) => {
            if (err.response.name === 'AuthorizationRequiredError') {
              return from([
                new RedirectAction(environment.redirect_after_account_logout),
                { type: ApplicationActionTypes.hideLoading }
              ]);
            } else {
              return from([
                {
                  type: AlertsActionTypes.PushAlert,
                  payload: {
                    type: 'danger',
                    message: apiMapErrorString(err.errorMessage),
                    id: 'accountLoginError',
                    permanent: false,
                    imperative: true
                  }
                },
                { type: ApplicationActionTypes.hideLoading }
              ]);
            }
          })
        );
    })
  );

  @Effect()
  getBoostJob$: Observable<Action> = this.actions$.pipe(
    ofType<GetBoostJob>(OffersActionTypes.GetBoostJob),
    mergeMap(action => {
      return this.apiService
        .getBoostJob(action.payload)
        .pipe(
          mergeMap((r: any) => {
            console.log('r', r);
            return from([
              new GetBoostJobComplete(parseBoostJob(r)),
              { type: ApplicationActionTypes.hideLoading }
            ]);
          }),
          catchError((err) => {
            if (err.response.name === 'AuthorizationRequiredError') {
              return from([
                new RedirectAction(environment.redirect_after_account_logout),
                { type: ApplicationActionTypes.hideLoading }
              ]);
            } else {
              return from([
                {
                  type: AlertsActionTypes.PushAlert,
                  payload: {
                    type: 'danger',
                    message: apiMapErrorString(err.errorMessage),
                    id: 'accountLoginError',
                    permanent: false,
                    imperative: true
                  }
                },
                { type: ApplicationActionTypes.hideLoading }
              ]);
            }
          })
        );
    })
  );

  @Effect()
  getBoostSearch$: Observable<Action> = this.actions$.pipe(
    ofType<GetBoostSearch>(OffersActionTypes.GetBoostSearch),
    mergeMap(action => {
      return this.apiService
        .getBoostSearch(action.payload)
        .pipe(
          mergeMap((r: any) => {
            return from([
              new GetBoostSearchComplete(parseBoostSearch(r)),
              { type: ApplicationActionTypes.hideLoading }
            ]);
          }),
          catchError((err) => {
            if (err.response.name === 'AuthorizationRequiredError') {
              return from([
                new RedirectAction(environment.redirect_after_account_logout),
                { type: ApplicationActionTypes.hideLoading }
              ]);
            } else {
              return from([
                {
                  type: AlertsActionTypes.PushAlert,
                  payload: {
                    type: 'danger',
                    message: apiMapErrorString(err.errorMessage),
                    id: 'accountLoginError',
                    permanent: false,
                    imperative: true
                  }
                },
                { type: ApplicationActionTypes.hideLoading }
              ]);
            }
          })
        );
    })
  );
  @Effect()
  getBoostJobUtxos$: Observable<Action> = this.actions$.pipe(
    ofType<GetBoostJobUtxos>(OffersActionTypes.GetBoostJobUtxos),
    mergeMap(action => {
      return this.apiService
        .getBoostJobUtxos(action.payload)
        .pipe(
          mergeMap((r: any) => {
            console.log('response from effect', r);
            return from([
              new GetBoostJobUtxosComplete(r),
              { type: ApplicationActionTypes.hideLoading }
            ]);
          }),
          catchError((err) => {
            if (err.response.name === 'AuthorizationRequiredError') {
              return from([
                new RedirectAction(environment.redirect_after_account_logout),
                { type: ApplicationActionTypes.hideLoading }
              ]);
            } else {
              return from([
                {
                  type: AlertsActionTypes.PushAlert,
                  payload: {
                    type: 'danger',
                    message: apiMapErrorString(err.errorMessage),
                    id: 'accountLoginError',
                    permanent: false,
                    imperative: true
                  }
                },
                { type: ApplicationActionTypes.hideLoading }
              ]);
            }
          })
        );
    })
  );

  @Effect()
  redirectToUrl$: Observable<Action> = this.actions$.pipe(
    ofType<RedirectAction>(OffersActionTypes.RedirectAction),
    map((action: RedirectAction) => action.payload),
    mergeMap((data) => {
      window.location.href = data;
      return from([]);
    })
  );

  constructor(private actions$: Actions, private router: Router, private store: Store<any>, private apiService: ApiService, private titleCasePipe: TitleCasePipe) {}
}
