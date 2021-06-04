import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { IEmployee } from './iemployee';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class EmployeeService {
  constructor(private _http: HttpClient) {}
  baseUrl: string = 'http://localhost:3000/employees';

  getEmployees(): Observable<IEmployee[]> {
    return this._http
      .get<IEmployee[]>(this.baseUrl)
      .pipe(catchError(this.errorHandler));
  }

  getEmployee(employeeId: number): Observable<IEmployee> {
    return this._http
      .get<IEmployee>(`${this.baseUrl}/${employeeId}`)
      .pipe(catchError(this.errorHandler));
  }

  updateEmployee(employee: IEmployee): Observable<void> {
    return this._http
      .put<void>(`${this.baseUrl}/${employee.id}`, employee, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.errorHandler));
  }

  addEmployee(employee: IEmployee): Observable<void> {
    return this._http
      .post<void>(`${this.baseUrl}`, employee, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(errorRespone: HttpErrorResponse) {
    return throwError('Error in the service try again later');
  }
}
