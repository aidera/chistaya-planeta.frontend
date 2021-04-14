import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ServerResponse } from '../../models/ServerResponse';
import { environment } from '../../../environments/environment';
import { GetRouteParamsType } from '../../models/types/GetRouteParamsType';
import { ApiService } from './api.service';
import { IEmployee, IEmployeeLessInfo } from '../../models/Employee';
import { EmployeeStatus } from '../../models/enums/EmployeeStatus';
import { EmployeeRole } from '../../models/enums/EmployeeRole';

export interface IGetAllEmployeesResponse extends ServerResponse {
  employees?: IEmployeeLessInfo[];
}

export interface IGetEmployeesResponse extends ServerResponse {
  employees?: IEmployee[];
}

export interface IGetOneEmployeeResponse extends ServerResponse {
  employee?: IEmployee;
}

export interface ICheckEmployeeResponse extends ServerResponse {
  id?: string;
  responseCode?: string;
}

export interface IUpdateEmployeeResponse extends ServerResponse {
  updatedEmployee?: IEmployee;
}

export interface IAddEmployeeResponse extends ServerResponse {
  addedEmployee?: IEmployee;
}

export interface IRemoveEmployeeResponse extends ServerResponse {
  removedEmployee?: IEmployee;
}

export interface IGetEmployeesResponse extends ServerResponse {
  employees?: IEmployee[];
  totalItemsCount: number;
  totalPagesCount: number;
  currentPage: number;
  perPage: number;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeesApiService {
  private path = 'employees';

  constructor(private http: HttpClient, private api: ApiService) {}

  getAllLessInfo(): Observable<IGetAllEmployeesResponse> {
    return this.http.get<IGetAllEmployeesResponse>(
      `${environment.serverURL}/${this.path}/all-less-info`
    );
  }

  get(request: GetRouteParamsType): Observable<IGetEmployeesResponse> {
    const params = this.api.createGetRouteParams(request);
    return this.http.get<IGetEmployeesResponse>(
      `${environment.serverURL}/${this.path}/`,
      { params }
    );
  }

  checkEmail(email: string): Observable<ICheckEmployeeResponse> {
    return this.http.get<ICheckEmployeeResponse>(
      `${environment.serverURL}/${this.path}/check-email/${email}`
    );
  }

  checkPhone(phone: string): Observable<ICheckEmployeeResponse> {
    return this.http.get<ICheckEmployeeResponse>(
      `${environment.serverURL}/${this.path}/check-phone/${phone}`
    );
  }

  getOne(id: string): Observable<IGetOneEmployeeResponse> {
    return this.http.get<IGetOneEmployeeResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }

  update(
    id: string,
    fields: {
      status?: EmployeeStatus;
      role?: EmployeeRole;
      name?: string;
      surname?: string;
      patronymic?: string;
      phone?: string;
      email?: string;
      division?: string;
      locality?: string;
      cars?: string[];
    }
  ): Observable<IUpdateEmployeeResponse> {
    return this.http.patch<IUpdateEmployeeResponse>(
      `${environment.serverURL}/${this.path}/${id}`,
      { ...fields }
    );
  }

  add(fields: {
    role: EmployeeRole;
    name: string;
    surname: string;
    patronymic?: string;
    phone: string;
    email?: string;
    division: string;
    locality: string;
    cars?: string[];
  }): Observable<IAddEmployeeResponse> {
    return this.http.put<IAddEmployeeResponse>(
      `${environment.serverURL}/${this.path}/`,
      { ...fields }
    );
  }

  remove(id: string): Observable<IRemoveEmployeeResponse> {
    return this.http.delete<IRemoveEmployeeResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }
}
