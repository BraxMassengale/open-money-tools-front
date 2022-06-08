import {Component, OnInit} from '@angular/core';
import {TransactionService} from "../../service/transaction.service";
import {PortfolioService} from "../../service/portfolio.service";
import {MatTableDataSource} from "@angular/material/table";
import {Portfolio} from "../../interface/portfolio";
import {Transaction} from "../../interface/transaction";
import {Holding} from "../../interface/holding";
import {HoldingService} from "../../service/holding.service";
import {CoinService} from "../../service/coin.service";
import {Router} from "@angular/router";
import {AuthService} from "@auth0/auth0-angular";

@Component({
  selector: 'portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {


  portfolio!: Portfolio;
  transactions!: Transaction[];
  holdings: Holding[] = [];
  holdingData: Holding[] = [];
  dataSource!: MatTableDataSource<Holding>;
  portfolioDataLoaded: boolean = false;
  transactionDataLoaded: boolean = false;
  holdingDataLoaded: boolean = false;
  displayedColumns: string[] = ['holding-name', 'holding-amount', 'holding-value'];
  portfolioTotalValue: number = 0;
  holdingToAdd: Holding | undefined;
  chartData: any[] = [];
  options: Object | undefined;
  profileJson: string | null = null;

  constructor(private portfolioService: PortfolioService, private transactionService: TransactionService, private holdingService: HoldingService, private coinService: CoinService, private router: Router, public auth: AuthService) {

  }

  ngOnInit(): void {
    this.auth.user$.subscribe(
      (profile) => {
        if(profile != undefined) {
          console.log("Inside profile not undefined")
          if (profile.email != null) {
            console.log("Inside profile email not null")
            this.portfolioService.portfolio$(profile.email).subscribe(response => {
              console.log("Inside portfolio subscribe")
              if (response.data.portfolio) {
                console.log("there is portfolio data")
                this.portfolio = response.data.portfolio;
              }
              this.portfolioDataLoaded = true;
            }, err => {
              if(err.status==500) {
                console.log("There's no registry of that portfolio")
                if(profile.name && profile.email) {
                  console.log("Ok, saving portfolio!!!")
                  this.portfolioService.save$(
                    {
                      id: 0,
                      name: profile.name,
                      email: profile.email,
                      defaultCurrency: "eur"
                    }
                  )
                }
              }
            })
          }
        }
      }
    )

    this.transactionService.transactions$.subscribe(response => {
      if (response.data.transactions) {
        this.transactions = response.data.transactions;
        console.log("TRANSACTIONS");
        console.log(this.transactions);
      }
      this.transactionDataLoaded = true;

      this.holdingService.holdings$.subscribe(response => {
        if (response.data.holdings) {
          console.log("holdings data exists..")
          response.data.holdings.forEach((holding, index) => {
            console.log(holding);
            this.holdingData.push(holding);
            console.log(this.holdingData[index]);
          });
          console.log("here's the response data: " + response.data.holdings);
          console.log(response.data.holdings);
          console.log("here's the holding data: " + this.holdingData);
          console.log(this.holdingData);

          // Set holdings equal to only holdings associated with this portfolio's id
          this.holdings = this.holdingData.filter((holding) => holding.portfolioId === this.portfolio.id);
          console.log("here's the filtered holding data: ");
          console.log(this.holdings);
        }

        this.holdingDataLoaded = true;

        this.transactions.forEach((transaction) => {
          console.log(transaction);
          // Search for holding if that holding exists, add or subtract
          this.holdings.forEach(holding => {
            console.log("holding name: " + holding.holdingName + " and transaction asset received: " + transaction.assetReceived);
            if (holding.holdingName == transaction.assetReceived) {
              console.log("holding name and asset received match");
              holding.holdingAmount += transaction.amountReceived;
            } else if (holding.holdingName == transaction.assetTaken) {
              console.log("holding name and asset taken match");
              holding.holdingAmount -= transaction.amountTaken;
            }
          })
        })

        for (let holding of this.holdings) {
          if(holding.holdingAmount <= 0) {
            if(holding.id != undefined) {
              console.log("going to delete holding");
              this.holdingService.delete$(holding.id).subscribe((res) => console.log(res));
              location.reload();
            }
          }
          this.convertHoldingToUSD(holding);
        }
        this.dataSource = new MatTableDataSource(this.holdings);
      })
    })
  }


  private convertHoldingToUSD(holding: Holding): number {

    console.log("inside convertHoldingsToUSD");

    let identifier = holding.holdingName;
    console.log("identifier --> ", identifier)

    if (identifier != null) {
      this.coinService.getCoinById(identifier).subscribe((coinData: any) => {
        if (!coinData) {
          return this.router.navigateByUrl('/');
        }

        console.log("Coin --> ", coinData)
        console.log("Coin Price ", coinData[0].current_price)

        holding.holdingValue = (Math.round(((coinData[0].current_price * holding.holdingAmount) + Number.EPSILON) * 100) / 100);
        this.portfolioTotalValue += (Math.round((holding.holdingValue + Number.EPSILON) * 100) / 100);

          console.log("HOLDING VALUE!!!!");
          console.log(holding.holdingValue);
          let y = holding.holdingValue;
          let name = holding.holdingName;
          let data = {y: y, name: name}

          this.chartData.push(data);

        this.configureChart();
        return holding.holdingValue;
      })
    }

    return 0;
  }

  private configureChart() {
    this.options = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Portfolio Diversity'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: '% of your portfolio',
        colorByPoint: true,
        data: this.chartData
      }]
    };
  }
}
