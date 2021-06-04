import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { EmployeeService } from './employee.service';
import { IEmployee } from './iemployee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  employees: IEmployee[];
  constructor(
    private employeeService: EmployeeService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(
      (data) => (this.employees = data),
      (err) => console.log(err)
    );
  }

  onEditButtonClick(employeeId: number) {
    this._router.navigate(['employees/edit', employeeId]);
  }
}
