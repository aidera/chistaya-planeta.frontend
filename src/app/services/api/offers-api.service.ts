import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import ServerResponse from '../../models/ServerResponse';
import { environment } from '../../../environments/environment';
import { SimpleStatus } from '../../models/enums/SimpleStatus';
import { IOffer } from '../../models/Offer';
import Price from '../../models/types/Price';

export interface IGetOffersResponse extends ServerResponse {
  offers?: IOffer[];
  totalItemsCount?: number;
}

export interface IUpdateOfferResponse extends ServerResponse {
  updatedOffer?: IOffer;
}

export interface IAddOfferResponse extends ServerResponse {
  addedOffer?: IOffer;
}

export interface IRemoveOfferResponse extends ServerResponse {
  removedOffer?: IOffer;
}

@Injectable({
  providedIn: 'root',
})
export class OffersApiService {
  private path = 'offers';

  constructor(private http: HttpClient) {}

  get(): Observable<IGetOffersResponse> {
    return this.http.get<IGetOffersResponse>(
      `${environment.serverURL}/${this.path}/`
    );
  }

  update(
    id: string,
    fields: {
      name?: string;
      description?: string;
      status?: SimpleStatus;
      prices?: Price[];
    }
  ): Observable<IUpdateOfferResponse> {
    return this.http.patch<IUpdateOfferResponse>(
      `${environment.serverURL}/${this.path}/${id}`,
      { ...fields }
    );
  }

  add(fields: {
    name: string;
    description?: string;
    prices: Price[];
  }): Observable<IAddOfferResponse> {
    return this.http.put<IAddOfferResponse>(
      `${environment.serverURL}/${this.path}/`,
      { ...fields }
    );
  }

  remove(id: string): Observable<IRemoveOfferResponse> {
    return this.http.delete<IRemoveOfferResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }
}
