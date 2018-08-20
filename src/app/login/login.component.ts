import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import instances from '../../resources/instances';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;

  // Set as env parameter
  supportedOrganizations = [
    'Broward County',
    'MIT Urban Risk Lab',
    'SFWMD'
  ];

  showSetPasswordMsg: boolean;
  exitLoginProcess: boolean;

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
    this.authService
    .retrieveUserFromStorage()
    .then((attributes) => {
      const userAttributes = {
        region: '',
        role: ''
      };

      for (const attribute of attributes) {
        if (attribute['Name'] === 'custom:region') {
          userAttributes.region = attribute['Value'];
        } else if (attribute['Name'] === 'custom:role') {
          userAttributes.role = attribute['Value'];
        }
      }

      this.redirect(true, userAttributes);
    })
    .catch((error) => {
      if (error) {
        if (error.hasOwnProperty('code')
        && error.code === 'NotAuthorizedException'
        && error.message === 'Refresh Token has expired') {
          // TODO: display message?
        } else {
          console.log(error);
        }
      }
    });

    this.loginFormGroup = new FormGroup({
      emailCtrl: new FormControl('', [
        Validators.required,
        Validators.email
      ]),

      passwordCtrl: new FormControl('', Validators.required)
    });
  }

  loginUser() {
    const email = this.loginFormGroup.controls.emailCtrl.value;
    const password = this.loginFormGroup.controls.passwordCtrl.value;

    this.authService.authenticateUser({
      email: email,
      password: password
    }, true)
    .then((payload) => {
      this.redirect(true, {
        region: payload['custom:region'],
        role: payload['custom:role']
      });
    })
    .catch((error) => {
      if (error.code === 'NotAuthorizedException') {
        this.loginFormGroup.controls.passwordCtrl.setValue(null);
        this.loginFormGroup.controls.passwordCtrl.setErrors({incorrect: true});
      } else if (error.code === 'UserNotFoundException') {
        this.loginFormGroup.controls.passwordCtrl.setValue(null);
        this.loginFormGroup.controls.emailCtrl.setErrors({noUser: true});
      } else if (error.code === 'PasswordResetRequiredException') {
        this.loginFormGroup.controls.passwordCtrl.setValue(null);
        this.showSetPasswordMsg = true;
      } else {
        console.log(error);
      }
    });
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

      this.exitLoginProcess = true;
    } else {
      this.router.navigate(['']);
    }
  }

  resetForm() {
    this.exitLoginProcess = false;
    this.loginFormGroup.reset();
  }
}
