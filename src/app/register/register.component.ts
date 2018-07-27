import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';

export const passwordConfirmationValidator = (control: FormGroup) => {
  const password = control.get('thirdCtrl');
  const confirmPassword = control.get('fourthCtrl');
  return password && confirmPassword && password.value !== confirmPassword.value
    ? { 'noMatch': true } : null;
}

export const passwordNumberValidator = (control: FormControl) => {
  const password = control.value;
  if (password.search(/\d/) === -1) {
    return { 'noNumber': true };
  }
  return null;
}

export const passwordLowerCaseValidator = (control: FormControl) => {
  const password = control.value;
  if (password.search(/[a-z]/) === -1) {
    return { 'noLowerCase': true };
  }
  return null;
}

export const passwordUpperCaseValidator = (control: FormControl) => {
  const password = control.value;
  if (password.search(/[A-Z]/) === -1) {
    return { 'noUpperCase': true };
  }
  return null;
}

export const codeNonNumeric = (control: FormControl) => {
  const code = control.value;
  const regEx = RegExp('^[0-9]*$');
  if (regEx.test(code)) {
    return null;
  } else {
    return { 'containsNonNumberic': true };
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userConfirmation: FormGroup;
  newPassword: FormGroup;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.userConfirmation = new FormGroup({
      'firstCtrl': new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      'secondCtrl': new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        codeNonNumeric
      ])
    });

    this.newPassword = new FormGroup({
      thirdCtrl: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        passwordNumberValidator,
        passwordLowerCaseValidator,
        passwordUpperCaseValidator
      ]),
      fourthCtrl: new FormControl()
    }, {
      validators: passwordConfirmationValidator
    });
  }

  confirmUser() {

  }

  storePassword() {

  }

  redirectAsAdmin() {

  }
}
