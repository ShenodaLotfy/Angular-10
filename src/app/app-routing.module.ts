import { NgModule } from '@angular/core';
import { PreloadingStrategy, RouterModule, Routes } from '@angular/router'

import { CustomPreloadingService } from './custom-preloading.service';

import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found.component';

const appRoutes: Routes = [
  // preload data is to determine if this lazy module has a preloading strategy or not (preload: true or preload: false)
  { path: "employees", data: { preload: true } ,loadChildren:  () => import('./employee/employee.module').then(m => m.EmployeeModule) },
  { path: 'home' , component: HomeComponent },
  { path: '', redirectTo: "list", pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {preloadingStrategy: CustomPreloadingService} )
  ],
  exports: [ RouterModule ] // to make app-module use it
})

export class AppRoutingModule { }
