import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormArray,
} from '@angular/forms';
import { CustomValidator } from '../shared/custom.validators';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmployee } from './iemployee';
import { ISkills } from './iskills';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  createFormGroup: FormGroup;
  updatedEmployee: IEmployee;
  pageTitle: string;

  validationMessages = {
    fullName: {
      required: 'Full Name is required!',
      minlength: 'Full Name must be at least 2 characters',
      maxlength: 'Full Name must less than 10 characters',
    },
    Email: {
      required: 'Email is required!',
      emailDomain: 'Email domain must me @dell.com',
    },
    confirmEmail: {
      required: 'Confirm Email is required!',
    },
    emailGroup: {
      EmailMismatch: 'Email and Confirm Email do not match',
    },
    phone: {
      required: 'Phone is required!',
    },
  };

  formErrors = {
    fullName: '',
    Email: '',
    confirmEmail: '',
    emailGroup: '',
    phone: '',
  };
  // injecting service
  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private employeeService: EmployeeService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // this.createFormGroup = new FormGroup({
    //   fullName: new FormControl(),
    //   Email: new FormControl(),
    //   skills: new FormGroup({
    //     skillName: new FormControl,
    //     experience: new FormControl,
    //     proficiency: new FormControl
    //   })
    // })

    this.createFormGroup = this._fb.group({
      // use Validatior class to use of [required,minLength,min,max etc]
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
      // group this two controls to check the matching and mismatching of them
      emailGroup: this._fb.group(
        {
          Email: [
            '',
            [Validators.required, CustomValidator.emailDomain('dell.com')],
          ], // our custom validator class
          confirmEmail: ['', Validators.required],
        },
        { validator: EmailMatch } // tie our custom matching function EmailMatch
      ),
      contactPreference: ['email'],
      phone: [''],
      // skills: this._fb.group({
      //   skillName: ["", [Validators.required]],
      //   experience: ["", [Validators.required]],
      //   proficiency: ["", [Validators.required]]
      // })
      // make the same skill form group using form array
      skills: this._fb.array([
        this.addSkillsFormGroup(), // function to create the form group
      ]),
    });

    // to keep track of contactPreference control changes
    this.createFormGroup
      .get('contactPreference')
      .valueChanges.subscribe((data) => {
        this.setRequiredProperty(data);
      });

    this._route.paramMap.subscribe((params) => {
      const id = +params.get('id');
      if (id) {
        this.pageTitle = ' Edit Employee';
        // pass the employee with specified id to bindToForm function
        this.employeeService.getEmployee(id).subscribe(
          (emp: IEmployee) => {
            this.bindEmployeeToForm(emp);
            this.updatedEmployee = emp;
          },
          (error) => console.log(error)
        );
      } else {
        this.pageTitle = ' Create Employee';
        this.updatedEmployee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: [],
        };
      }
    });

    // to keep track of formgroup controls changes
    this.createFormGroup.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.createFormGroup);
    });
  }

  bindEmployeeToForm(employee: IEmployee) {
    this.createFormGroup.patchValue({
      fullName: employee.fullName,
      emailGroup: {
        Email: employee.email,
        confirmEmail: employee.email,
      },
      phone: employee.phone,
      contactPreference: employee.contactPreference,
    });
    // remove current skills FormArray and replace it with this.setSkillsFormArray(), that will generate a new FormArray from json server
    this.createFormGroup.setControl(
      'skills',
      this.setSkillsFormArray(employee.skills)
    ); // using setControl method to bind FormArray to html Form
  }

  // replacing Current skills FormArray with a new formArray
  setSkillsFormArray(employeeSkills: ISkills[]): FormArray {
    const formArray = new FormArray([]);
    employeeSkills.forEach((skill) => {
      formArray.push(
        this._fb.group({
          skillName: skill.skillName,
          experience: skill.experience,
          proficiency: skill.proficiency,
        })
      );
    });

    return formArray;
  }

  addSkillButtonClick(): void {
    // we have to type cast from AbstractControl to FormArrayControl
    (<FormArray>this.createFormGroup.get('skills')).push(
      this.addSkillsFormGroup()
    ); // passing function of creating FormGroup control
  }

  deleteSkillButtinClick(skillIndex: number): void {
    const formArray = <FormArray>this.createFormGroup.get('skills');
    formArray.removeAt(skillIndex); // remove formgroup with index passed to the function
    formArray.markAsDirty(); // to reflect status to the html when deleting from the form
    formArray.markAsTouched(); // to reflect status to the html when deleting from the form
  }

  setRequiredProperty(contact: string) {
    const phoneControl = this.createFormGroup.get('phone');
    const emailControl = this.createFormGroup.get('emailGroup').get('Email');
    const confirmEmailControl = this.createFormGroup
      .get('emailGroup')
      .get('confirmEmail');
    if (contact == 'phone') {
      phoneControl.setValidators(Validators.required);
      emailControl.clearValidators();
      confirmEmailControl.clearValidators();
    } else {
      phoneControl.clearValidators();
      emailControl.setValidators(Validators.required);
      confirmEmailControl.setValidators(Validators.required);
    }
    // then apply changes
    phoneControl.updateValueAndValidity();
    emailControl.updateValueAndValidity();
    confirmEmailControl.updateValueAndValidity;
  }

  onLoadDataClick() {
    // We can use patchValue() method to set a subset of FormControl values
    // this.createFormGroup.setValue({
    //   fullName: "Shenoda",
    //   Email: "Shenoda@gamil.com",
    //   skills: {
    //     skillName: "C#",
    //     experience: 5,
    //     proficiency: "advanced"
    //   }
    // })

    // we can use FormBuilder service to do the same
    // this.createFormGroup = this._fb.group({
    //   // use Validatior class to use of [requiire,minLength,min,max etc]
    //   fullName: ["aa", [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
    //   Email: ["sssss"],
    //   skills: this._fb.group({
    //     skillName: ["sss"],
    //     experience: ["ssss"],
    //     proficiency: ["beginner"]
    //   })
    // })

    this.logValidationErrors(this.createFormGroup);
  }

  // recursive form control loop
  logValidationErrors(group: FormGroup = this.createFormGroup): void {
    // using Object.ke to get all keys of all controls
    // controls may contain nested form groups, so recursive loop is useful in this case
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';

      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.dirty ||
          abstractControl.touched ||
          abstractControl.value !== '')
      ) {
        const messages = this.validationMessages[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        // if its form group then call the function again to get all controls inside it
        this.logValidationErrors(abstractControl);
      }
      // if the control is formArray
      // check if the control is form group
      // if (abstractControl instanceof FormArray) {
      //   for (const control of abstractControl.controls) {
      //     if (control instanceof FormGroup) {
      //       this.logValidationErrors(control);
      //     }
      //   }
      // }
    });
  }

  onSubmit() {
    this.updateEmployeeInfo();
    if (this.updatedEmployee.id) {
      this.employeeService.updateEmployee(this.updatedEmployee).subscribe(
        () => this._router.navigate(['employees']),
        (error) => console.log(error)
      );
    } else {
      this.employeeService.addEmployee(this.updatedEmployee).subscribe(
        () => this._router.navigate(['employees']),
        (error) => console.log(error)
      );
    }
  }

  updateEmployeeInfo() {
    this.updatedEmployee.fullName = this.createFormGroup.value.fullName;
    this.updatedEmployee.contactPreference =
      this.createFormGroup.value.contactPreference;
    this.updatedEmployee.email = this.createFormGroup.value.emailGroup.Email;
    this.updatedEmployee.phone = this.createFormGroup.value.phone;
    this.updatedEmployee.skills = this.createFormGroup.value.skills;
  }

  // function to create skills form controls
  addSkillsFormGroup(): FormGroup {
    return this._fb.group({
      skillName: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      proficiency: ['', [Validators.required]],
    });
  }
}

function EmailMatch(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('Email'); // control
  const confirmEmailControl = group.get('confirmEmail'); // control

  if (
    emailControl.value.toUpperCase() ===
      confirmEmailControl.value.toUpperCase() ||
    (confirmEmailControl.pristine &&
      confirmEmailControl.value ===
        '') /*the user didnt has the chance to write inside it */
  ) {
    return null;
  } else {
    return { EmailMismatch: true };
  }
}
