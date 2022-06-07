import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Transaction} from "../../interface/transaction";
import {TransactionService} from "../../service/transaction.service";
import {Portfolio} from "../../interface/portfolio";
import {PortfolioService} from "../../service/portfolio.service";
import {AuthService} from "@auth0/auth0-angular";
import {Router} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss']
})
export class TransactionTableComponent implements OnInit {

  dataSource!: MatTableDataSource<Transaction>;
  displayedColumns: string[] = ['transaction-id', 'transaction-asset-received', 'transaction-asset-taken', 'transaction-timestamp', 'delete'];
  dataLoaded: boolean = false;
  portfolio!: Portfolio;

  constructor(private transactionService: TransactionService, private portfolioService: PortfolioService, public auth: AuthService, private router: Router) {
  }

  ngOnInit(): void {

    this.auth.user$.subscribe(
      (profile) => {
        if(profile != undefined) {
          if (profile.email != null) {
            this.portfolioService.portfolio$(profile.email).subscribe(response => {
              if (response.data.portfolio) {
                this.portfolio = response.data.portfolio;
              }
              this.transactionService.transactions$.subscribe(response => {
                let transactionData = response.data.transactions.filter(transaction => {
                  return transaction.portfolioId == this.portfolio.id;
                })
                this.dataSource = new MatTableDataSource<Transaction>(transactionData);
                this.dataLoaded = true;
              })
            })
          }
        }
      }
    )

  }

  deleteTransaction(transaction: Transaction) {
    console.log("inside delete");
    if(transaction.id != undefined) {
      console.log("transaction id not undefined");
      this.transactionService.delete$(transaction.id).subscribe((res) => console.log(res));
    }
  }
}
