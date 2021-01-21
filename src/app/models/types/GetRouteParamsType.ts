import { ServerPaginationRequest } from './ServerPaginationRequest';
import { ServerSortingRequest } from './ServerSortingRequest';
import { ServerFilterRequest } from './ServerFilterRequest';

export type GetRouteParamsType = {
  pagination?: ServerPaginationRequest;
  sorting?: ServerSortingRequest;
  search?: string;
  filter?: ServerFilterRequest;
};
