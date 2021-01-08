import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import ServerResponse from '../../models/ServerResponse';
import { ILocality } from '../../models/Locality';
import { environment } from '../../../environments/environment';

export interface IGetAllLocalitiesResponse extends ServerResponse {
  localities?: ILocality[];
}

@Injectable({
  providedIn: 'root',
})
export class LocalityService {
  private path = 'localities';

  constructor(private http: HttpClient) {}

  getAll(): Observable<IGetAllLocalitiesResponse> {
    return this.http.get<IGetAllLocalitiesResponse>(
      `${environment.serverURL}/${this.path}/all`
    );
  }
}
