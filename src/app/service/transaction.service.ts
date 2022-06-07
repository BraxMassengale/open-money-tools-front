import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {CustomResponse} from "../interface/custom-response";
import {catchError, Observable, tap, throwError} from "rxjs";
import {Transaction} from "../interface/transaction";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private readonly apiUrl = 'https://open-money-tools.herokuapp.com';

  transactions$ = <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUrl}/transactions/list`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  constructor(private http: HttpClient) {

  }

  save$ = (transaction: Transaction) => <Observable<CustomResponse>>
    this.http.post<CustomResponse>(`${this.apiUrl}/transactions/save`, transaction)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  transaction$ = (id: number) => <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUrl}/transactions/transaction/${id}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  delete$ = (id: number) => <Observable<CustomResponse>>
    this.http.delete<CustomResponse>(`${this.apiUrl}/transactions/transaction/${id}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occurred - Error code: ${error.status}`);
  }
}
