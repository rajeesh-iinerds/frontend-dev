import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import * as constant from '../shared/config';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
@Injectable()
export class CommonService {
  jwtToken: any;
  constructor(private http: Http) { }

  /* 
    STORE TOKEN IN SERVICE
  */
  setJwtToken(jwt) {
    this.jwtToken = jwt;
  }


  /* 
    GET TOKEN FROM SERVICE IF AVAILABLE OR GET IT THROUGH API CALL
  */

  getJwtToken(){
    {
      return Observable.create(observer => {
        if (this.jwtToken == null || this.jwtToken == '' || this.jwtToken == undefined) {
          this.getSessionToken().subscribe((response) => {
            if (response.getIdToken().getJwtToken()) {
              this.jwtToken = response.getIdToken().getJwtToken();
              observer.next(this.jwtToken);
              observer.complete();
            }
          }, (err) => {
            console.log(err);
          });
        }
       
      }, err => {
        console.log("error on user", err)
      })
    }
  }


  /**
   * CLIENT CALL FOR GETTING JWT TOKEN
   */


  getSessionToken(): Observable<any> {
    var self = this;
    return Observable.create(observer => {
      var cognitoUser = new CognitoUserPool(constant.userPoolData).getCurrentUser();
      if (cognitoUser != null) {
        cognitoUser.getSession(function (err, session) {
          if (err) {
            err => err.json();
            console.log(err);
            observer.next(err);
            observer.complete();
          }
          if (session && session.isValid()) {
            session => session.json();
            observer.next(session);
            observer.complete();
          } else {
            self.userLogout();
          }
        });
      }
    }, err => {
      console.log("error on session", err)
    })
  }

  /**
   * INVALIDATING USER SESSION
   */

  userLogout = function () {
    var userPool = new CognitoUserPool(constant.userPoolData);
    this.userSession = userPool.getCurrentUser();
    if (this.userSession) {
      let userData = {
        Username: this.userSession.username,
        Pool: userPool
      };
      new CognitoUser(userData).signOut();
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('tokenExpiryTime');
      localStorage.removeItem('userGroup');
      localStorage.removeItem('User_Information');
      localStorage.removeItem('userData');
      localStorage.removeItem('isLoggedIn');
      this.router.navigate(['']);
    }
  }


}