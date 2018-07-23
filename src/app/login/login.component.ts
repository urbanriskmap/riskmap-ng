import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { AuthService } from '../services/auth.service';

export class EmailErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

// export class PasswordErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     // VALIDATE entered password
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  emailMatcher = new EmailErrorStateMatcher();
  // passwordMatcher = new PasswordErrorStateMatcher();
  selectedOrg: string;

  userData = {
    email: '',
    organization: '',
    password: '',
    name: ''
  };

  // Set as env parameter
  supportedOrganizations = [
    'Broward County',
    'MIT Urban Risk Lab',
    'SFWMD'
  ];

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

  updateValues(attribute: string, value: string) {
    this.userData[attribute] = value;
  }
}
