import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// reactive form module
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { EmployeeRoutingModule } from './employee/employee-routing.module';

import { EmployeeService } from './employee/employee.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    EmployeeRoutingModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [EmployeeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
