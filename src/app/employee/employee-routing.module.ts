import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list.component';
import { CreateComponent } from './create.component';

const appRoutes: Routes = [
  // {
  //     path: "employees", children: [ // for lazy loading
  //         { path: '', component: ListComponent },
  //         { path: 'create', component: CreateComponent },
  //         { path: 'edit/:id', component: CreateComponent },
  //     ]

  // }
  { path: '', component: ListComponent },
  { path: 'create', component: CreateComponent },
  { path: 'edit/:id', component: CreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule], // to make app-module use it
})
export class EmployeeRoutingModule {}
