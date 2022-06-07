import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {TransactionTableComponent} from './components/transaction-table/transaction-table.component';
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {HomeComponent} from './components/home/home.component';
import {RouterModule, Routes} from "@angular/router";
import {PortfolioComponent} from './components/portfolio/portfolio.component';
import {MatDividerModule} from "@angular/material/divider";
import {TransactionsComponent} from './components/transactions/transactions.component';
import {MatButtonModule} from "@angular/material/button";
import {TransactionFormComponent} from './components/transaction-form/transaction-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {AccountComponent} from './components/account/account.component';
import {ChartModule} from 'angular2-highcharts';
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {AuthModule} from "@auth0/auth0-angular";
import {environment as env} from "../environments/environment";
import {MatPaginatorModule} from "@angular/material/paginator";

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'transactions', component: TransactionsComponent},
  {path: 'account', component: AccountComponent}]
;

@NgModule({
  declarations: [
    AppComponent,
    TransactionTableComponent,
    HomeComponent,
    PortfolioComponent,
    TransactionsComponent,
    TransactionFormComponent,
    AccountComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    NgxSkeletonLoaderModule,
    RouterModule.forRoot(routes),
    MatDividerModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    ChartModule.forRoot(require('highcharts')),
    MatCardModule,
    MatSelectModule,
    MatAutocompleteModule,
    AuthModule.forRoot({
      ...env.auth
    }),
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
