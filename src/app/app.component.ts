import {Component, ViewChild} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {MatSidenav} from '@angular/material/sidenav';
import {delay, filter} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {PortfolioService} from "./service/portfolio.service";
import {Portfolio} from "./interface/portfolio";
import {AuthService} from "@auth0/auth0-angular";

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  portfolio!: Portfolio;
  profileJson: any;
  tempPortfolio!: Portfolio;

  constructor(private observer: BreakpointObserver, private router: Router, private portfolioService: PortfolioService, public auth: AuthService) {

  }


  ngOnInit(): void {
    this.auth.user$.subscribe(
      (profile) => {
        if(profile != undefined) {
          this.profileJson = profile;
          if (profile.email != null) {
            this.portfolioService.portfolio$(profile.email).subscribe(response => {
              if (response.data.portfolio) {
                this.portfolio = response.data.portfolio;

                if(profile.email != null && profile.name != null) {
                  this.tempPortfolio =  {
                    id: 0,
                    name: `${profile.name}'s portfolio`,
                    defaultCurrency: "eur",
                    email: profile.email
                  };
                }
              }
            })
          }
        }
      }
    )
  }


  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }

  loginWithRedirect(): void {

    if(this.portfolio == undefined) {
      console.log(this.tempPortfolio);
      this.portfolioService.save$(this.tempPortfolio);
      console.log("saving temp portfolio")
    }
    setTimeout(() => {
      console.log("Delayed for 1 second.");
    }, 30000)
    this.auth.loginWithRedirect();
  }
}
