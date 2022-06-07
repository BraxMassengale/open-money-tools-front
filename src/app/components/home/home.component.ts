import {Component, OnInit} from '@angular/core';
import {catchError, map, Observable, of, startWith} from "rxjs";
import {TransactionService} from "../../service/transaction.service";
import {AppState} from "../../interface/app-state";
import {CustomResponse} from "../../interface/custom-response";
import {DataState} from "../../enum/data-state.enum";
import {HoldingService} from "../../service/holding.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  appState$!: Observable<AppState<CustomResponse>>; // TODO: Should this be definitely assigned??
  readonly DataState = DataState;

  constructor(private holdingService: HoldingService) {
  }

  ngOnInit(): void {
    this.appState$ = this.holdingService.holdings$
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

}
