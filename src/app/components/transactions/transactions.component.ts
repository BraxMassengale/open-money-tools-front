import {Component, OnInit} from '@angular/core';
import {catchError, map, Observable, of, startWith} from "rxjs";
import {DataState} from "../../enum/data-state.enum";
import {TransactionService} from "../../service/transaction.service";
import {AppState} from "../../interface/app-state";
import {CustomResponse} from "../../interface/custom-response";
import {Transaction} from "../../interface/transaction";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  appState$!: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  toggleNewTransaction: boolean = false;

  constructor(private transactionService: TransactionService) {
  }

  ngOnInit(): void {

    this.appState$ = this.transactionService.transactions$
      .pipe(
        map(response => {
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE}),
        catchError((error: String) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      );
  }

  toggleNewTransactionForm(): void {
    this.toggleNewTransaction = !this.toggleNewTransaction;
    console.log(this.toggleNewTransaction);
  }
}
