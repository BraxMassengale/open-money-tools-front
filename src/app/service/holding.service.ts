import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {CustomResponse} from "../interface/custom-response";
import {catchError, Observable, tap, throwError} from "rxjs";
import {Holding} from "../interface/holding";

@Injectable({
  providedIn: 'root'
})
export class HoldingService {

  private readonly apiUrl = 'https://open-money-tools.herokuapp.com';

  holdings$ = <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUrl}/holding/list`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  constructor(private http: HttpClient) {

  }

  save$ = (holding: Holding) => <Observable<CustomResponse>>
    this.http.post<CustomResponse>(`${this.apiUrl}/holding/save`, holding)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  holding$ = (id: number) => <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUrl}/holding/${id}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  delete$ = (id: number) => <Observable<CustomResponse>>
    this.http.delete<CustomResponse>(`${this.apiUrl}/holding/${id}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occurred - Error code: ${error.status}`);
  }
}
