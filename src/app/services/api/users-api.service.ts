import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import ServerResponse from '../../models/ServerResponse';
import { environment } from '../../../environments/environment';
import { UserType } from '../../models/enums/UserType';
import { IEmployee } from '../../models/Employee';
import IClient from '../../models/Client';

export interface ILoginRequest extends ServerResponse {
  type: UserType;
  email: string;
  password: string;
}

export interface ILoginResponse extends ServerResponse {
  token?: string;
  expiresIn?: number;
  user?: IEmployee | IClient;
}

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private path = 'users';

  constructor(private http: HttpClient) {}

  login(credentials: ILoginRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(
      `${environment.serverURL}/${this.path}/login`,
      credentials
    );
  }
}
