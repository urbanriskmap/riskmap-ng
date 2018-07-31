import { Injectable } from '@angular/core';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool
} from 'amazon-cognito-identity-js';

import { environment as env } from '../../environments/environment';

// RESOURCE: https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js

@Injectable()
export class AuthService {
  poolData = {
    UserPoolId: env.authorization.userPoolId,
    ClientId: env.authorization.appClientId,
  };

  cognitoUser: CognitoUser;
  userPool: CognitoUserPool;
  authenticationDetails: AuthenticationDetails;

  isAuthorized: boolean;

  constructor( ) {
    this.userPool = new CognitoUserPool(this.poolData);
  }

  authenticateUser(userData: {
    email: string,
    password: string
  }, isLoggingIn?: boolean) {
    if (isLoggingIn) {
      this.cognitoUser = new CognitoUser({
        Username: userData.email,
        Pool: this.userPool
      });
    }

    const authenticationData = {
      Username: userData.email,
      Password: userData.password
    };
    this.authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) => {
      this.cognitoUser
      .authenticateUser(this.authenticationDetails, {
        onSuccess: (result) => {
          this.isAuthorized = true;

          resolve(result.getIdToken().decodePayload());
        },

        onFailure: (error) => {
          reject(error);
        }
      });
    });
  }

  validateUser(
    email: string
  ) {
    const userData = {
      Username: email,
      Pool: this.userPool
    };

    this.cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      this.cognitoUser.confirmRegistration('000000', true, (error, result) => {
        if (error) {
          if (error.code === 'NotAuthorizedException') {
            // User with email exists in pool
            resolve();
          } else {
            reject(error);
          }
        }

        // resolved unexpectedly, user already registered
        // forgot password?
        reject({registered: true});
      });
    });
  }

  registerNewPassword(
    password: string,
    email?: string
  ) {
    if (email) {
      const userData = {
        Username: email,
        Pool: this.userPool
      };

      this.cognitoUser = new CognitoUser(userData);
    }

    return new Promise((resolve, reject) => {
      this.cognitoUser
      .forgotPassword({
        onSuccess: (data) => {
          resolve(data);
        },

        onFailure: (error) => {
          reject(error);
        },

        inputVerificationCode: (data) => {
          resolve(data);
        }
      });
    });
  }

  verifyConfirmationCode(
    code: string,
    password: string,
    email?: string
  ) {
    if (email) {
      const userData = {
        Username: email,
        Pool: this.userPool
      };

      this.cognitoUser = new CognitoUser(userData);
    }

    return new Promise((resolve, reject) => {
      this.cognitoUser
      .confirmPassword(code, password, {
        onSuccess() {
          resolve();
        },
        onFailure(error) {
          reject(error);
        }
      });
    });
  }

  logoutUser() {
    this.isAuthorized = false;
    this.cognitoUser.signOut();
  }

  retrieveUserFromStorage(): Promise< CognitoUserAttribute[] > {
    this.cognitoUser = this.userPool.getCurrentUser();

    return new Promise((resolve, reject) => {
      if (this.cognitoUser !== null) {
        this.cognitoUser
        .getSession((error, session) => {
          if (error) {
            reject(error);
          }

          this.isAuthorized = true;

          this.cognitoUser
          .getUserAttributes((err, attributes) => {
            if (err) {
              reject(err);
            }

            resolve(attributes);
          });
        });
      } else {
        reject();
      }
    });
  }
}
