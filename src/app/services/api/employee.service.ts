import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import ServerResponse from '../../models/ServerResponse';
import { environment } from '../../../environments/environment';
import { IEmployee } from '../../models/Employee';

export interface IGetAllEmployeesResponse extends ServerResponse {
  employees?: IEmployee[];
}

export interface IGetEmployeesResponse extends ServerResponse {
  employees?: IEmployee[];
  totalEmployeesCount?: number;
  totalPagesCount?: number;
  currentPage?: number;
  perPage?: number;
}

export interface IGetOneEmployeeResponse extends ServerResponse {
  employee?: IEmployee;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private path = 'employees';

  constructor(private http: HttpClient) {}

  getAll(): Observable<IGetAllEmployeesResponse> {
    return this.http.get<IGetAllEmployeesResponse>(
      `${environment.serverURL}/${this.path}/all`
    );
  }

  get(): Observable<IGetEmployeesResponse> {
    return this.http.get<IGetEmployeesResponse>(
      `${environment.serverURL}/${this.path}/`
    );
  }

  getOne(id: string): Observable<IGetOneEmployeeResponse> {
    return this.http.get<IGetOneEmployeeResponse>(
      `${environment.serverURL}/${this.path}/${id}`
    );
  }
}
