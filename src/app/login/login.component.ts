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

  exitProcess: boolean;

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
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
    })
    .then((payload) => {
      this.redirect(true, {
        region: payload['custom:region'],
        role: payload['custom:role']
      });
    })
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

      this.exitProcess = true;
    } else {
      this.router.navigate(['']);
    }
  }
}
