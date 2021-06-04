import { NgModule } from '@angular/core';

import { ListComponent } from './list.component';
import { CreateComponent } from './create.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CreateComponent,
    ListComponent
  ],
  imports: [
    SharedModule // this shared module contain (CommonModule and ReactiveFormModule)
  ]
})
export class EmployeeModule { }
