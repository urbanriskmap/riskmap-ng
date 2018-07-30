import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import instances from '../../resources/instances';
import { AuthService } from '../services/auth.service';

export const passwordConfirmationValidator = (control: FormGroup) => {
  const password = control.get('passwordCtrl');
  const confirmPassword = control.get('confirmPassCtrl');
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
    return { 'containsNonNumeric': true };
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  validUserFormGroup: FormGroup;
  confirmationFormGroup: FormGroup;
  passwordFormGroup: FormGroup;

  exitSigninProcess: boolean;

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
    this.validUserFormGroup = new FormGroup({
      'emailCtrl': new FormControl('', [
        Validators.required,
        Validators.email
      ])
    });

    this.passwordFormGroup = new FormGroup({
      passwordCtrl: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        passwordNumberValidator,
        passwordLowerCaseValidator,
        passwordUpperCaseValidator
      ]),
      confirmPassCtrl: new FormControl()
    }, {
      validators: passwordConfirmationValidator
    });

    this.confirmationFormGroup = new FormGroup({
      'numCodeCtrl': new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        codeNonNumeric
      ])
    });
  }

  validateUser(stepper) {
    const email = this.validUserFormGroup.controls.emailCtrl.value;

    this.authService.validateUser(email)
    .then(() => {
      stepper.next();
    })
    .catch((error) => {
      if (error.registered) {
        this.router.navigate(['login']);
        return;
      }

      if (error.code && error.code === 'UserNotFoundException') {
        // TODO: show notification, with redirect button?
        alert('User not found, please contact admin');
      } else {
        console.log(error);
      }
    });
  }

  storePassword(stepper) {
    const password = this.passwordFormGroup.controls.passwordCtrl.value;

    this.authService.registerNewPassword(password)
    .then((result) => {
      stepper.next();
    })
    .catch((error) => console.log(error));
  }

  verifyCode(stepper) {
    const email = this.validUserFormGroup.controls.emailCtrl.value;
    const password = this.passwordFormGroup.controls.passwordCtrl.value;
    const code = this.confirmationFormGroup.controls.numCodeCtrl.value;

    this.authService.verifyConfirmationCode(code, password)
    .then(() => {
      this.authService.authenticateUser({
        email: email,
        password: password
      })
      .then((payload) => {
        this.redirect(true, {
          region: payload['custom:region'],
          role: payload['custom:role']
        });
      })
      // TODO: error automatically logging in, redirect to /login
      .catch((error) => console.log(error));
    })
    // TODO: go to step 2? back to webapp?
    .catch((error) => console.log(error));
  }

  redirect(authorized?: boolean, attributes?: {
    region: string,
    role: string
  }) {
    if (authorized) {
      for (const region of instances.regions) {
        if ((attributes.region === region.code
          || attributes.region === 'all')
          && attributes.role === 'write'
        ) {
          this.router.navigate([region.name], { queryParams: { admin: true } });
          break;
        }
      }

      this.exitSigninProcess = true;
    } else {
      this.router.navigate(['']);
    }
  }
}
