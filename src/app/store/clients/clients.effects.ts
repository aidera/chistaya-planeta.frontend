import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as ClientsActions from './clients.actions';
import { ClientsApiService } from '../../services/api/clients-api.service';

@Injectable()
export class ClientsEffects {
  constructor(
    private actions$: Actions,
    private clientsApi: ClientsApiService
  ) {}

  getClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.getClientsRequest),
      switchMap((action) => {
        return this.clientsApi
          .get({
            pagination: action.params.pagination,
            sorting: action.params.sorting,
            filter: action.params.filter,
            search: action.params.search,
          })
          .pipe(
            map((resData) => {
              if (resData && resData.clients) {
                return ClientsActions.getClientsSuccess({
                  clients: resData.clients,
                  pagination: {
                    perPage: resData.perPage,
                    page: resData.currentPage,
                    totalItemsCount: resData.totalItemsCount,
                    totalPagesCount: resData.totalPagesCount,
                  },
                });
              }
              return ClientsActions.getClientsFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                ClientsActions.getClientsFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );

  getClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.getClientRequest),
      switchMap((action) => {
        return this.clientsApi.getOne(action.id).pipe(
          map((resData) => {
            if (resData && resData.client) {
              return ClientsActions.getClientSuccess({
                client: resData.client,
              });
            }
            return ClientsActions.getClientFailure({
              error: resData.error,
            });
          }),
          catchError((errorRes) => {
            return of(
              ClientsActions.getClientFailure({
                error: errorRes.error.error,
              })
            );
          })
        );
      })
    )
  );

  updateClientsStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.updateClientStatusRequest),
      switchMap((action) => {
        return this.clientsApi
          .updateStatus(action.id, action.status, action.blockReason)
          .pipe(
            map((resData) => {
              if (resData && resData.updatedClient) {
                return ClientsActions.updateClientSuccess({
                  client: resData.updatedClient,
                });
              }
              return ClientsActions.updateClientFailure({
                error: resData.error,
              });
            }),
            catchError((errorRes) => {
              return of(
                ClientsActions.updateClientFailure({
                  error: errorRes.error.error,
                })
              );
            })
          );
      })
    )
  );
}
