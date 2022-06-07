import {Observable} from "rxjs";
import {Coin} from "../interface/coin";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {PortfolioService} from "./portfolio.service";
import {Portfolio} from "../interface/portfolio";
import {AuthService} from "@auth0/auth0-angular";

@Injectable({
  providedIn: 'root'
})
export class CoinService {

  portfolio!: Portfolio;

  constructor(private http: HttpClient, private portfolioService: PortfolioService, public auth: AuthService) {

    this.auth.user$.subscribe(
      (profile) => {
        if(profile != undefined) {
          if (profile.email != null) {
            this.portfolioService.portfolio$(profile.email).subscribe(response => {
              if (response.data.portfolio) {
                this.portfolio = response.data.portfolio;
              }
            });
          }
        }
      }
    )


  }

  getCoinById(id: String): Observable<Coin> {
    return this.http.get<Coin>('https://api.coingecko.com/api/v3/coins/markets?vs_currency=' + this.portfolio.defaultCurrency + '&ids=' + id)
  }
}
