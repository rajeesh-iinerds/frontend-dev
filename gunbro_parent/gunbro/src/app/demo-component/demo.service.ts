import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession} from 'amazon-cognito-identity-js';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import {JwtHelper} from 'angular2-jwt/angular2-jwt';

import * as constant from '../shared/config';

@Injectable()
export class DemoService {
	userSession: any;
	isLoggedIn = false;
	productInfo: any;
	globalresultForLoop: any;
	results :any;
	resultCount: number;
	resultForloop :any;
	jwt:any;
	productsearch_name ? : any;
	showclickorder :any;
	productsearch_type ? :any;
	body: Object = {};
	usersList :any;
  resultsdb :any;

	loading :boolean = false;
  	subMenuToggle : boolean = false;
  	showNav : boolean = false;
  	showPopup: boolean = false;
	orderId: number;
	public demoService: DemoService;

	constructor(private http: Http, private router: Router) {
		console.log(constant.appcohesionURL);
		this.showclickorder = false;
		this.resultCount = 0;
		this.subMenuToggle = false;
		this.showPopup = false;
		this.router = router;
		if(localStorage.getItem('tokenExpiryTime')) {
			const epxiryTime = localStorage.getItem('tokenExpiryTime');
			const now = new Date();
			const exp = new Date(parseInt(epxiryTime));
			// if (exp.valueOf() < now.valueOf()) {
			//     exp.setDate(exp.getDate() + 1);
			// }
			const expiryValue = exp.valueOf();
			const nowValue = now.getTime();
			const diff = expiryValue-nowValue;
			console.log('diff', diff);
           	let intervalId = setInterval(() => {
				console.log('inside interval');
				if (exp.valueOf() < now.valueOf()) {
				    // exp.setDate(exp.getDate() + 1);
				    clearInterval(intervalId);
					this.userLogout();
				}
			}, diff);
		}
	}

	/*useJwtHelper() {
		var token = localStorage.getItem('id_token');
		console.log(
			this.jwtHelper.decodeToken(token),
		    this.jwtHelper.getTokenExpirationDate(token),
		    this.jwtHelper.isTokenExpired(token)
		);
	}*/

	userLogin (name, password): Observable<any> {
		return Observable.create(observer => {
			var self = this;
		   	// var poolData = {
		    //     UserPoolId : 'us-east-1_Q3sA5af5A',
		    //     ClientId : '7iaf7o5ja7su88mjb8du0pqigv',
		    // };
		    var poolData = constant.userPoolData;
		    var userPool = new CognitoUserPool(poolData);
			var authenticationData = {
		        Username : name,
		        Password : password
		    };
		    const authDetails = new AuthenticationDetails(authenticationData);
			var userData = {
		        Username : name,
		        Pool : userPool
		    };
		    var userCognito = new CognitoUser(userData);

		    userCognito.authenticateUser(authDetails, {
		       	onSuccess: function (result) {
		       		console.log(result);
		       		this.jwt = result.getIdToken().getJwtToken();
		       		localStorage.setItem('isLoggedIn', 'true');

					const idEpxiry = result.getIdToken().getExpiration();
					const str =  idEpxiry + "";
					const pad = "0000000000000";
					// timestamp by default should have 13 digits.
					const epxiryTime = str + pad.substring(0, pad.length - str.length);
					localStorage.setItem('tokenExpiryTime', epxiryTime);
					console.log(epxiryTime);

					const now = new Date();
					const exp = new Date(parseInt(epxiryTime));
					// if (exp.valueOf() < now.valueOf()) {
					//     exp.setDate(exp.getDate() + 1);
					// }
					const expiryValue = exp.valueOf();
					const nowValue = now.getTime();
					const diff = expiryValue-nowValue;
					console.log('diff', diff);
		           	let intervalId = setInterval(() => {
						console.log('inside interval');
						if (exp.valueOf() < now.valueOf()) {
							clearInterval(intervalId);
						    // exp.setDate(exp.getDate() + 1);
						    self.userLogout();
						}
					}, diff);

		           	/*cognitoUser.getUserAttributes(function(err, result) {
					    if (err) {
					        alert(err);
					        return;
					    }
					    for (i = 0; i < result.length; i++) {
					        console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
					    }
					});*/

     				var group = new JwtHelper().decodeToken(this.jwt);
     				if(group['cognito:groups'] && group['cognito:groups'][0]) {
     					localStorage.setItem('userGroup', group['cognito:groups'][0]);
     				}
     				else {
     					localStorage.setItem('userGroup', '');
     				}


		       		result=>result.json();
					observer.next(result);
	      			observer.complete();
		        },
		        onFailure: function(err) {
				   	console.log(err);
				   	observer.next(err);
	      			observer.complete();
		        },
		    });
		}, err =>{console.log("error on user",err)})
	};

	userLogout = function() {
	 	// var poolData = {
	  //       UserPoolId : 'us-east-1_Q3sA5af5A',
	  //       ClientId : '7iaf7o5ja7su88mjb8du0pqigv',
	  //   };
	  	var poolData = constant.userPoolData;
	    // this.jwt = '';
	    var userPool = new CognitoUserPool(poolData);
	    this.userSession = userPool.getCurrentUser();
	    console.log(this.userSession);
	    if(this.userSession) {
	    	let userData = {
		        Username : this.userSession.username,
		        Pool : userPool
	    	};
	    	new CognitoUser(userData).signOut();
	    	// this.isLoggedIn = false;
	    	localStorage.setItem('isLoggedIn', 'false');
	    	localStorage.removeItem('tokenExpiryTime');
	    	localStorage.removeItem('userGroup');
	    	this.router.navigate(['']);
	    }
	}

	getLoggedInState() {
		return this.isLoggedIn;
	}

	setProductDetails(data) {
		this.productInfo = data;
	}

	getSessionToken (): Observable<any> {
		var self = this;
		this.loading = true;
		return Observable.create(observer => {
		// var poolData = {
	 //        UserPoolId : 'us-east-1_Q3sA5af5A',
	 //        ClientId : '7iaf7o5ja7su88mjb8du0pqigv',
	 //    };
	 	var poolData = constant.userPoolData;
	    var userPool = new CognitoUserPool(poolData);
	    var cognitoUser = userPool.getCurrentUser();

	    if (cognitoUser != null) {
	        cognitoUser.getSession(function(err, session) {
	        	console.log('session validity: ' + session.getIdToken().getJwtToken());

	        	/*const sessionData = {
				    IdToken: session.getIdToken(),
				    AccessToken: session.getAccessToken(),
				    RefreshToken: session.getRefreshToken()
				  };
				  const cachedSession = new CognitoUserSession(sessionData);

				  if (cachedSession.isValid()) {
				    console.log('validdddddddddd');
				  }
				  else {
				  	console.log('errrrrrrr');
				  }*/




	        	if (err) {
	        		console.log(err);
	        		err=>err.json();
					observer.next(err);
	      			observer.complete();
	        	}
	        	if (session && session.isValid()) {
	        		// var RefreshToken = session.getRefreshToken();
	        		// cognitoUser = self.getCognitoUser();
	        		// cognitoUser.refreshSession(RefreshToken, (err, session) => {
	        		// 	console.log('refreshhhhhhhhhhh', session);
	        		// });
	        		session=>session.json();
					observer.next(session);
	      			observer.complete();
	        	}
	        	else { // session false OR token expired
	        		self.userLogout();
	        	}
	        });
	    }
		}, err =>{console.log("error on session",err)})
	}

	getCognitoUser = function() {
		// const poolData = {
		// 	UserPoolId : 'us-east-1_Q3sA5af5A',
		//     ClientId : '7iaf7o5ja7su88mjb8du0pqigv'
		// };
		var poolData = constant.userPoolData;
		const userPool = new CognitoUserPool(poolData);
		this.userSession = userPool.getCurrentUser();
		const userData = {
		    Username : this.userSession.username,
		    Pool : userPool
		};
		return new CognitoUser(userData);
	};

	productSearchfromService(request_productsearch_type, request_productsearch_name, jwt) {
		this.body= {};
		this.results = '';
		this.globalresultForLoop = '';
		var data = '';
		this.productsearch_name = request_productsearch_name ? request_productsearch_name : "";
		this.productsearch_type = request_productsearch_type ? request_productsearch_type : "";
        let headers = new Headers({ 'Authorization': jwt});
        let options = new RequestOptions({ headers: headers });
        // var reqBody = {this.productsearch_type : this.productsearch_name};
        this.body[this.productsearch_type] = this.productsearch_name;
        var reqBody = this.body;

        // const url = 'https://api.appcohesion.io/searchProduct';
        const url = constant.appcohesionURL.productSearch_URL;
        this.http
            .post(url, reqBody, options)
            .subscribe(data => {
            	this.loading = false;
                this.results = data ? data.json() : {};

                if(this.results && this.results.status) {
                	if(this.results.status.code == constant.statusCode.success_code) {
                		this.resultForloop = this.results.stockDetails;
                		this.resultCount = this.results.totalResults;
                	}
                	else if(this.results.status.code == constant.statusCode.empty_code) {
                		this.resultForloop = [];
                		this.resultCount = 0;
                	}
                	this.router.navigate(['/dashboard/search'],{ queryParams: reqBody});
                }
            }, error => {
            	this.loading = false;
                console.log(JSON.stringify(error));
            });
    }

    confirmOrderfromService (orderInfo, jwt): Observable<any>  {
    	this.loading = true;

      return Observable.create(observer => {
    	let headers = new Headers({'Content-Type': 'application/json', 'Authorization': jwt });
		let options = new RequestOptions({ headers: headers });
		alert("product info"+ JSON.stringify(this.productInfo));
		console.log("product info"+ this.productInfo);
	   	let req_body = {
			"Quantity": orderInfo.Quandity?orderInfo.Quandity:"",
			"ShippingMethod": orderInfo.ShippingMethod?orderInfo.ShippingMethod:"",
			"ShipToStreetLine2": "ShipToStreetLine2",
			"ecomdashID": "ecomdashID",
			"BuyerType": "Retailer",
			"ShipToStreetLine1": orderInfo.ShipToStreetLine1?orderInfo.ShipToStreetLine1:"",
			"ShipToCity": orderInfo.ShipToCity?orderInfo.ShipToCity:"",
			"ConsumerName": orderInfo.ConsumerName?orderInfo.ConsumerName:"",
			"ProductPrice": orderInfo.ProductPrice?orderInfo.ProductPrice:"",
			"FFL": orderInfo.FFL?orderInfo.FFL:"",
			"CustomerPrice": "123.35",
			"SellerType": "Distributor",
			"GSIN": this.productInfo && this.productInfo.gsin ? this.productInfo.gsin : "",
			"Custom4": "Custom4",
			"ShipToPostalCode": orderInfo.ShipToPostalCode?orderInfo.ShipToPostalCode:"",
			"Custom3": "Custom3",
			"Custom2": "Custom2",
			"Custom1": "Custom1",
			"ShipToState": orderInfo.ShipToState?orderInfo.ShipToState:"",
			"BuyerID": "1",
			"Phone": orderInfo.Phone?orderInfo.Phone:"",
			"SellerID": "3",
			"distributor_name" : this.productInfo && this.productInfo.distributor_name ? this.productInfo.distributor_name : "",
			"product_name" : this.productInfo && this.productInfo.product_Name ? this.productInfo.product_Name : "",			
			// "manufacturer_partnumber" : this.productInfo && this.productInfo.mpn ? this.productInfo.mpn : "",
			// "manufacturer" : this.productInfo && this.productInfo.manufacturerName ? this.productInfo.manufacturerName : "",
			"action": "processNewOrder",

		};
		 //let req_body = {  "ecomdashID": "ecomdashID",  "Quandity": orderInfo.Quandity?orderInfo.Quandity:"",  "ShippingMethod": orderInfo.ShippingMethod?orderInfo.ShippingMethod:"",  "ShipToStreetLine1": "",  "ShipToStreetLine2": "ShipToStreetLine2",  "ShipToCity": "ShipToCity",  "BuyerType": "Retailer",  "ConsumerName": "ConsumerName",  "ProductPrice": "123.45",  "CustomerPrice": "123.35",  "GSIN": this.productsearch_name,  "Custom1": "Custom1",  "Custom2": "Custom2",  "Custom3": "Custom3",  "Custom4": "Custom4",  "SKUNumber": "100386",  "ShipToPostalCode": "ShipToPostalCode",  "ShipToState": "ShipToState",  "BuyerID": "1",  "SellerID": "1",  "Phone": "3474845476",  "FFL": "FFLLicense",  "SellerType": "Distributor"}
		// const url = 'https://api.appcohesion.io/placeOrder';
		// const url = 'https://jp7oyuf6ch.execute-api.us-east-1.amazonaws.com/prod/';
		const url = constant.appcohesionURL.placeOrder_URL;
	    this.http
	        .post(url, req_body, options)
	        .subscribe(data => {
	        	this.loading = false;
	            this.results = data ? data.json():'';

            if(this.results){


           // alert("sdadasdasdasdasd" +  JSON.stringify(this.results));
	            if(this.results.status.code == constant.statusCode.success_code) {
	            	this.orderId = this.results.data[0].orderId;
	            	this.showclickorder = false;
	            	this.showPopup = !this.showPopup;
                console.log(JSON.stringify(this.results));
                observer.next(this.results);
                observer.complete();
	            }
	            else {
                //alert(this.results.status);
	            }
	            // alert(this.results.status);
	            console.log(this.results);
            }
            else{
              //alert("Result is empty");
            }
	        }, error => {
	        	this.loading = false;
            observer.next(error);
            observer.complete();
	            console.log(JSON.stringify(error));
	    });
      }, (err) => {
          console.log('Error');
      });
    }


  updateRecordinDB (information_fetchdb,fieldName): Observable<any> {
    return Observable.create(observer => {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let req_body = {
      "order_id": information_fetchdb.toString()
    };
    const url = 'https://bh7906mpaf.execute-api.us-east-1.amazonaws.com/prod/orderstatus';
    this.http
      .post(url, req_body, options)
      .subscribe(data => {
        this.resultsdb = data.json();
        //alert(JSON.stringify(this.resultsdb));
        observer.next(this.resultsdb);
        observer.complete();
      }, error => {
        console.log(error.json());
      });
    }, err =>{console.log("error",err)})
  }


  csvfileUpload (body_csv): Observable<any> {
    var self = this;
    //this.loading = true;
    return Observable.create(observer => {
      // var poolData = {
      //this.loading = true;
      let headers = new Headers({'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      const url = 'https://api.appcohesion.io/uploadCsv';
      this.http
        .post(url, body_csv, options)
        .subscribe(csvdata => {
          this.loading = false;
          //alert(csvdata);
          observer.next(csvdata);
          observer.complete();
          //alert( "asddasdasdas " + JSON.stringify(data));
        }, error => {
          this.loading = false;
          console.log(JSON.stringify(error));
          observer.next(error);
          observer.complete();
        });
    }, err =>{console.log("error",err)})
  }

    createUser(jwt, userInfo) {
    	this.loading = true;
    	let headers = new Headers({'Content-Type': 'application/json', 'Authorization': jwt });
	    let options = new RequestOptions({ headers: headers });
	    let req_body = {
			"role_id": "1",
			"user": {
				"user_name": userInfo.email,
		  		"password": userInfo.password,
		  		"email" : userInfo.email,
		  		"first_name": userInfo.firstName,
		  		"last_name": userInfo.lastName
			}
		};
		// const url = 'https://7v5j1r1r92.execute-api.us-east-1.amazonaws.com/prod/cognitoSignin';
		const url = constant.appcohesionURL.createUser_URL;
		this.http
	        .post(url, req_body, options)
	        .subscribe(data => {
	        	this.loading = false;
	            this.results = data.json();
	            if(this.results.success) {
	            	alert(this.results.data.user.username + " has been created successfully and an email has been sent to his email id!");
	            }
	            else {
	            	alert(this.results.Error.message + " ! ");
	            }
	            console.log(this.results);
	        }, error => {
	        	this.loading = false;
	            console.log("error" + JSON.stringify(error));
	    });
    }

    //Listing users in cognito Pool
    listUsers() {
    	this.loading = true;
	    //Taking Session Value for passing token
	    return this.getSessionToken().subscribe((response) => {
	      if(response.getIdToken().getJwtToken()) {
	        this.jwt = response.getIdToken().getJwtToken();
	        let headers = new Headers({'Authorization': this.jwt });
		    let options = new RequestOptions({ headers: headers });
		    var req_body = '';
			// const url = 'https://dtnqjf4q15.execute-api.us-east-1.amazonaws.com/prod';
			const url = constant.appcohesionURL.listUsers_URL;
			this.http
		        .post(url, req_body, options)
		        .subscribe(data => {
		        	this.loading = false;
		            this.usersList = data.json();
		        }, error => {
		        	this.loading = false;
		            console.log("error" + JSON.stringify(error));
		    });
	        }
	    }, (err) => {
	      console.log(err);
	    });
    }

}
