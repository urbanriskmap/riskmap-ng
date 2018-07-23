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

  constructor( ) {
    this.userPool = new CognitoUserPool(this.poolData);
  }

  registerUser(userData: {
    email: string,
    password: string,
    name: string,
    organization: string
  }) {
    console.log(userData);
    const attributeList = [];

    // const attributeEmail = new CognitoUserAttribute({
    //   Name: 'email',
    //   Value: userData.email
    // });
    const attributeName = new CognitoUserAttribute({
      Name: 'name',
      Value: userData.name
    });
    const attributeOrganization = new CognitoUserAttribute({
      Name: 'custom:organization', // Prefix custom: to custom attributes
      Value: userData.organization
    });

    attributeList.push(
      // attributeEmail,
      attributeName,
      attributeOrganization
    );

    this.userPool
    .signUp(
      userData.email,
      userData.password,
      attributeList,
      null,
      (error, result) => {
        if (error) {
          console.log(error);
          alert(error.message || JSON.stringify(error));
          return;
        }

        console.log(result);
        this.cognitoUser = result.user;
      }
    );
  }

  authenticateUser(userData: {
    email: string,
    password: string,
    name: string,
    organization: string
  }) {
    const authenticationData = {
      Username: userData.email,
      Password: userData.password
    };
    this.authenticationDetails = new AuthenticationDetails(authenticationData);
    this.cognitoUser = new CognitoUser({
      Username: authenticationData.Username,
      Pool: this.userPool
    });

    this.cognitoUser
    .authenticateUser(this.authenticationDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();

        console.log(accessToken);
      },

      onFailure: (error) => {
        alert(error.message || JSON.stringify(error));
      }
    })
  }

  checkUserOrganization(
    organization: string
  ) {
    this.cognitoUser
    .getUserAttributes((error, result) => {
      if (error) {
        alert(error.message || JSON.stringify(error));
        return;
      }

      for (const attribute of result) {
        // Filter attribute.getName() === 'organization' and check desired value
        console.log('Attribute: ' + attribute.getName() + ', Value: ' + attribute.getValue());
      }
    });
  }

  // Use case 23. Authenticate a user and set new password for a user that was created using AdminCreateUser API


}
