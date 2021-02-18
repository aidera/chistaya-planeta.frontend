import { Action, createReducer, on } from '@ngrx/store';

import * as ServicesActions from './services.actions';
import { ServerError } from '../../models/ServerResponse';
import { IService } from '../../models/Service';

export const servicesInitialState = {
  services: null as IService[] | null,

  getServicesIsFetching: false,
  getServicesError: null as ServerError | null,

  updateServiceIsFetching: false,
  updateServiceError: null as ServerError | null,
  updateServiceSucceed: false as boolean,

  addServiceIsFetching: false,
  addServiceError: null as ServerError | null,
  addServiceSucceed: false as boolean,

  removeServiceIsFetching: false,
  removeServiceError: null as ServerError | null,
  removeServiceSucceed: false as boolean,
};
export type ServicesState = typeof servicesInitialState;

const _servicesReducer = createReducer(
  servicesInitialState,

  /* -------------------- */
  /* --- Get Services --- */
  /* -------------------- */

  on(ServicesActions.getServicesRequest, (state) => ({
    ...state,
    getServicesIsFetching: true,
    getServicesError: null,
  })),
  on(ServicesActions.getServicesSuccess, (state, payload) => ({
    ...state,
    services: payload.services,
    getServicesIsFetching: false,
    getServicesError: null,
  })),
  on(ServicesActions.getServicesFailure, (state, payload) => ({
    ...state,
    getServicesIsFetching: false,
    getServicesError: payload.error,
  })),

  /* ---------------------- */
  /* --- Update Service --- */
  /* ---------------------- */

  on(ServicesActions.updateServiceRequest, (state) => ({
    ...state,
    updateServiceIsFetching: true,
    updateServiceError: null,
  })),
  on(ServicesActions.updateServiceSuccess, (state, payload) => ({
    ...state,
    services: state.services.map((el) => {
      if (el._id === payload.service._id) {
        return payload.service;
      }
      return el;
    }),
    updateServiceIsFetching: false,
    updateServiceError: null,
    updateServiceSucceed: true,
  })),
  on(ServicesActions.updateServiceFailure, (state, payload) => ({
    ...state,
    updateServiceIsFetching: false,
    updateServiceError: payload.error,
  })),
  on(ServicesActions.refreshUpdateServiceSucceed, (state) => ({
    ...state,
    updateServiceSucceed: false,
  })),
  on(ServicesActions.refreshUpdateServiceFailure, (state) => ({
    ...state,
    updateServiceError: null,
  })),

  /* ------------------- */
  /* --- Add Service --- */
  /* ------------------- */

  on(ServicesActions.addServiceRequest, (state) => ({
    ...state,
    addServiceIsFetching: true,
    addServiceError: null,
  })),
  on(ServicesActions.addServiceSuccess, (state, payload) => ({
    ...state,
    services: [payload.service, ...state.services],
    addServiceIsFetching: false,
    addServiceError: null,
    addServiceSucceed: true,
  })),
  on(ServicesActions.addServiceFailure, (state, payload) => ({
    ...state,
    addServiceIsFetching: false,
    addServiceError: payload.error,
  })),
  on(ServicesActions.refreshAddServiceSucceed, (state) => ({
    ...state,
    addServiceSucceed: false,
  })),
  on(ServicesActions.refreshAddServiceFailure, (state) => ({
    ...state,
    addServiceError: null,
  })),

  /* ---------------------- */
  /* --- Remove Service --- */
  /* ---------------------- */

  on(ServicesActions.removeServiceRequest, (state) => ({
    ...state,
    removeServiceIsFetching: true,
    removeServiceError: null,
  })),
  on(ServicesActions.removeServiceSuccess, (state, payload) => ({
    ...state,
    services: state.services.filter((el) => el._id !== payload.service._id),
    removeServiceIsFetching: false,
    removeServiceError: null,
    removeServiceSucceed: true,
  })),
  on(ServicesActions.removeServiceFailure, (state, payload) => ({
    ...state,
    removeServiceIsFetching: false,
    removeServiceError: payload.error,
  })),
  on(ServicesActions.refreshRemoveServiceSucceed, (state) => ({
    ...state,
    removeServiceSucceed: false,
  })),
  on(ServicesActions.refreshRemoveServiceFailure, (state) => ({
    ...state,
    removeServiceError: null,
  }))
);

export function servicesReducer(
  state: ServicesState | undefined,
  action: Action
): ServicesState {
  return _servicesReducer(state, action);
}
