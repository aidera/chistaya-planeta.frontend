import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import ServerResponse from '../../models/ServerResponse';
import { IDivision } from '../../models/Division';
import { environment } from '../../../environments/environment';

export interface IGetAllDivisionsResponse extends ServerResponse {
  divisions?: IDivision[];
}

@Injectable({
  providedIn: 'root',
})
export class DivisionService {
  private path = 'divisions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<IGetAllDivisionsResponse> {
    return this.http.get<IGetAllDivisionsResponse>(
      `${environment.serverURL}/${this.path}/all`
    );
  }
}
