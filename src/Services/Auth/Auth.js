/*
 * See: https://github.com/aws-amplify/amplify-js/tree/master/packages/amazon-cognito-identity-js
 * See: https://aws.amazon.com/blogs/mobile/accessing-your-user-pools-using-the-amazon-cognito-identity-sdk-for-javascript/
 *
 * The ID token ... contains claims about the identity of the authenticated user such as name, email,
 * and phone_number.
 *
 * The user pool access token contains claims about the authenticated user, a list of the user's
 * groups, and a list of scopes. The purpose of the access token is to authorize API operations in the
 * context of the user in the user pool.
 *
 * You can use the refresh token to retrieve new ID and access tokens. You can revoke a refresh token
 * for a user using the AWS API. When you revoke a refresh token, all access tokens that were
 * previously issued by that refresh token become invalid.
 */
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails
} from 'amazon-cognito-identity-js';

const POOL_DATA = {
    UserPoolId: 'eu-west-2_tLeLTu2WR',
    ClientId: '1u4b3ik06qff237gbsllutu6d1'
};
const userPool = new CognitoUserPool(POOL_DATA);

export function signUpUser(email, password) {
    return new Promise( (resolve, reject) => {
        console.debug(`signupUser(${email}, ${password})`);
        const emailAttribute = {Name: 'email', Value: email};
        const attributeList = [new CognitoUserAttribute(emailAttribute)];
        userPool.signUp(email, password, attributeList, null, (err, result) => {
            if (err) { console.debug(`signupUser.reject()`); reject(err); }
            else     { console.debug(`signupUser.resolve()`); resolve(result) }
        });
    });
}

export function resendConfirmationCode(username) {
    return new Promise( (resolve, reject) => {
        const cognitoUser = new CognitoUser({Username: username, Pool: userPool});
        cognitoUser.resendConfirmationCode(function(err, result) {
            if (err) { reject(err); }
            else     { resolve(result); }
        });
    });
}

export function confirmUser(username, code) {
    return new Promise( (resolve, reject) => {
        const cognitoUser = new CognitoUser({Username: username, Pool: userPool});
        cognitoUser.confirmRegistration(code, true, (err, result) => {
            if (err) { reject(err); }
            else     { resolve(result); }
        });
    });
}

export function userForgotPassword(username) {
    return new Promise( (resolve, reject) => {
        const cognitoUser = new CognitoUser({Username: username, Pool: userPool});
        cognitoUser.forgotPassword( {
            onSuccess: result =>  resolve(result),
            onFailure: err => reject(err)
        });
    });
}

export function signIn(username, password) {
    return new Promise( (resolve, reject) => {
        const authDetails = new AuthenticationDetails({Username: username, Password: password});
        const userData = {Username: username, Pool: userPool};
        const cognitoUser = new CognitoUser(userData);
        cognitoUser.authenticateUser(authDetails, {
            onSuccess : result => resolve(result),
            onFailure: err => reject(err)
        });
    });
}

export function signOut() {
    return new Promise( resolve => {
        const cognitoUser = userPool.getCurrentUser()
        if (cognitoUser !== null) {
            cognitoUser.signOut(() => resolve());
        }
        else {
            resolve();
        }
    });
}

export function globalSignOut() {
    return new Promise( (resolve, reject) => {
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser !== null) {
            cognitoUser.globalSignOut({
                onSuccess: msg => resolve(msg),
                onFailure: err => reject(err)
            });
        }
        else {
            resolve();
        }
    });
}

export function getCurrentUser() {
    const user = userPool.getCurrentUser();
    console.debug("USER IS ");
    console.debug(user);
    return user;
}
