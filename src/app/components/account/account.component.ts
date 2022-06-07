import {Component, Inject, OnInit} from '@angular/core';
import {PortfolioService} from "../../service/portfolio.service";
import {Portfolio} from "../../interface/portfolio";
import {AuthService} from "@auth0/auth0-angular";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  selectedOption: String = "";
  portfolioDataLoaded: boolean = false;
  portfolio: Portfolio | undefined
  profileImageUrl: string | undefined;
  profileJson: string | null = null;

  constructor(private portfolioService: PortfolioService, public auth: AuthService, @Inject(DOCUMENT) private doc: Document) {

  }

  ngOnInit(): void {

    this.auth.user$.subscribe(
      (profile) => {
        if(profile != null) {
          if(profile.email != null) {
            this.portfolioService.portfolio$(profile.email).subscribe(response => {
              if (response.data.portfolio) {
                this.portfolio = response.data.portfolio;
                console.log("PORTFOLIO LOADED")
                this.portfolioDataLoaded = true;
              }
            })
          }
        }
      }
    )


  }

  changeDefaultCurrency() {
    if (this.portfolioDataLoaded && this.portfolio != undefined) {
      this.portfolio.defaultCurrency = this.selectedOption;
      console.log("changed currency in UI");
      console.log(this.portfolio);
      this.portfolioService.update$(this.portfolio).subscribe(response => {
        console.log(response);
      });
      console.log("after update");
    }
  }


  logout(): void {
    this.auth.logout({returnTo: this.doc.location.origin})
  }
}
