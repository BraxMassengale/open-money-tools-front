import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {CustomResponse} from "../interface/custom-response";
import {catchError, Observable, tap, throwError} from "rxjs";
import {Transaction} from "../interface/transaction";
import {Portfolio} from "../interface/portfolio";

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private readonly apiUrl = 'https://open-money-tools.herokuapp.com';

  constructor(private http: HttpClient) {

  }

  save$ = (portfolio: Portfolio) => <Observable<CustomResponse>>
    this.http.post<CustomResponse>(`${this.apiUrl}/portfolio/save`, portfolio)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  update$ = (portfolio: Portfolio) => <Observable<CustomResponse>>
    this.http.put<CustomResponse>(`${this.apiUrl}/portfolio/update`, portfolio)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  portfolio$ = (email: string) => <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUrl}/portfolio/`, { params: {
        email: email
      }})
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  delete$ = (id: number) => <Observable<CustomResponse>>
    this.http.delete<CustomResponse>(`${this.apiUrl}/portfolio/${id}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occurred - Error code: ${error.status}`);
  }
}
