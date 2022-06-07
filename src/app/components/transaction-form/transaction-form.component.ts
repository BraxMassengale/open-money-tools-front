import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Transaction} from "../../interface/transaction";
import {TransactionService} from "../../service/transaction.service";
import {Observable} from "rxjs";
import {AppState} from "../../interface/app-state";
import {CustomResponse} from "../../interface/custom-response";
import {DataState} from "../../enum/data-state.enum";
import {Router} from "@angular/router";
import {HoldingService} from "../../service/holding.service";
import {Holding} from "../../interface/holding";
import {Portfolio} from "../../interface/portfolio";
import {PortfolioService} from "../../service/portfolio.service";
import {AuthService} from "@auth0/auth0-angular";

@Component({
  selector: 'transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {
  appState$!: Observable<AppState<CustomResponse>>; // TODO: Should this be definitely assigned??
  readonly DataState = DataState;
  transaction: Transaction;
  assetReceived: FormControl;
  assetTaken: FormControl;
  amountReceived: FormControl;
  amountTaken: FormControl;
  transactionTime: FormControl;
  transactionForm: FormGroup;
  isValidForm: boolean | null;
  holdings: Holding[] = [];
  holdingData: Holding[] = [];
  portfolio!: Portfolio;
  profileJson: string | null = null;


  constructor(private formBuilder: FormBuilder, private transactionService: TransactionService, private holdingService: HoldingService, private portfolioService: PortfolioService, private router: Router,  public auth: AuthService) {
    this.isValidForm = null;
    this.transaction = new class implements Transaction {
      amountReceived = 0;
      amountTaken = 0;
      assetReceived = "";
      assetTaken = "";
      portfolioId = 0;
      transactionTime = 0;
    }

    this.assetReceived = new FormControl(this.transaction.assetReceived, [
      Validators.required,
    ]);

    this.assetTaken = new FormControl(this.transaction.assetTaken, [
      Validators.required,
    ]);

    this.amountReceived = new FormControl(this.transaction.amountReceived, [
      Validators.required,
      Validators.min(0)
    ]);

    this.amountTaken = new FormControl(this.transaction.amountTaken, [
      Validators.required,
      Validators.min(0)
    ]);

    this.transactionTime = new FormControl(this.transaction.transactionTime, [
      Validators.required,
      Validators.min(0)
    ]);

    this.transactionForm = this.formBuilder.group({
      assetReceived: this.assetReceived,
      assetTaken: this.assetTaken,
      amountReceived: this.amountReceived,
      amountTaken: this.amountTaken,
      transactionTime: this.transactionTime,
    });
  }

  ngOnInit(): void {

    this.auth.user$.subscribe(
      (profile) => {
        if(profile != undefined) {
          if(profile.email != null) {
            this.portfolioService.portfolio$(profile.email).subscribe(response => {
              if (response.data.portfolio) {
                this.portfolio = response.data.portfolio;
              }
              this.holdingService.holdings$.subscribe(res => {
                if (res.data.holdings) {
                  this.holdings =  res.data.holdings.filter(holding => {
                    return holding.portfolioId == this.portfolio.id;
                  })
                }
              })
            })
          }
        }
      }
    )



  }

  saveTransaction() {
    let transactionFormValue = this.transactionForm.value;

    this.transaction.transactionTime = new Date(transactionFormValue.transactionTime).getTime();
    this.transaction.assetReceived = transactionFormValue.assetReceived;
    this.transaction.amountReceived = transactionFormValue.amountReceived;
    this.transaction.assetTaken = transactionFormValue.assetTaken;
    this.transaction.amountTaken = transactionFormValue.amountTaken;
    this.transaction.portfolioId = this.portfolio.id;

    let names: String[] = [];

    this.holdings.forEach(holding => {
      names.push(holding.holdingName);
    })

    if(transactionFormValue.assetTaken != " " && names.indexOf(transactionFormValue.assetTaken) == -1)  {
      alert("Can't subtract an asset that's not in your holdings");
      return;
    }

    if(transactionFormValue.transactionTime == 0) {
      alert("You must select a date for the transaction");
      return;
    }

    console.log("NAMES ARRAY");
    console.log(names);
    if (names.indexOf(transactionFormValue.assetReceived) == -1) {

      let portfolioId: number = this.portfolio.id;
      let holdingToAdd = new class implements Holding {
        holdingValue: number = 0;
        holdingAmount: number = 0;
        holdingName: String = transactionFormValue.assetReceived;
        portfolioId: number = portfolioId;
      }

      console.log(">>>>>>>>>>>>> adding holding: ");
      console.log(holdingToAdd);

      if (holdingToAdd.holdingName != null && holdingToAdd.holdingName != ' ') {
        this.holdingService.save$(holdingToAdd).subscribe(response => {
          console.log(response);
        });
      }
    }
    this.transactionService.save$(this.transaction).subscribe(response => {
      console.log(response);
    });

    this.transactionForm.reset();
  }
}

