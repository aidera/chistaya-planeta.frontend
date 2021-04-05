import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ServerResponse } from '../../models/ServerResponse';
import { environment } from '../../../environments/environment';
import { UserType } from '../../models/enums/UserType';
import { IEmployee } from '../../models/Employee';
import { IClient } from '../../models/Client';

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

export interface IGetUserResponse extends ServerResponse {
  user?: IEmployee | IClient;
  type?: UserType;
}

export interface IUpdateUserResponse extends ServerResponse {
  updatedUser?: IEmployee | IClient;
}

export interface IResetPasswordResponse extends ServerResponse {
  updatedUserId?: string;
}

export interface IRegisterClientResponse extends ServerResponse {
  token?: string;
  expiresIn?: number;
  user?: IClient;
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

  getUser(): Observable<IGetUserResponse> {
    return this.http.get<IGetUserResponse>(
      `${environment.serverURL}/${this.path}/`
    );
  }

  updateUser(fields: {
    name?: string;
    surname?: string;
    patronymic?: string;
    phone?: string;
    email?: string;
  }): Observable<IUpdateUserResponse> {
    return this.http.patch<IUpdateUserResponse>(
      `${environment.serverURL}/${this.path}/`,
      { ...fields }
    );
  }

  changeUserPassword(password: string): Observable<ServerResponse> {
    return this.http.patch<ServerResponse>(
      `${environment.serverURL}/${this.path}/password`,
      { password }
    );
  }

  registerClient(fields: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Observable<IRegisterClientResponse> {
    return this.http.post<IRegisterClientResponse>(
      `${environment.serverURL}/${this.path}/register-client`,
      fields
    );
  }

  resetClientsPassword(email: string): Observable<IResetPasswordResponse> {
    return this.http.post<IResetPasswordResponse>(
      `${environment.serverURL}/${this.path}/reset-client-password`,
      { email }
    );
  }
}
