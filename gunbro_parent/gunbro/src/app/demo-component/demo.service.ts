import {
    Injectable
} from '@angular/core';
import {
    Http,
    Headers,
    Response,
    RequestOptions
} from '@angular/http';
import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool,
    CognitoUserSession
} from 'amazon-cognito-identity-js';
import {
    Observable
} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {
    ActivatedRoute,
    RouterModule,
    Router
} from '@angular/router';
import {
    JwtHelper
} from 'angular2-jwt/angular2-jwt';
import * as constant from '../shared/config';

@Injectable()
export class DemoService {
    userSession: any;
    isLoggedIn = false;
    productInfo: any;
    globalresultForLoop: any;
    results: any;
    resultCount: number;
    resultForloop: any;
    jwt: any;
    productsearch_name ? : any;
    showclickorder: any;
    productsearch_type ? : any;
    body: Object = {};
    usersList: any;
    resultsdb: any;
    product_manufacturerId: any;
    retailerId : any;
    result : any;
    retailerCategory : any;
    loading: boolean = false;
    subMenuToggle: boolean = false;
    showNav: boolean = false;
	showPopup: boolean = false;
	createUserPopup: boolean = false;
    orderId: number;
    applyMarkup: boolean = false;
    public demoService: DemoService;

    constructor(private http: Http, private router: Router) {
        console.log(constant.appcohesionURL);
        this.showclickorder = false;
        this.resultCount = 0;
        this.subMenuToggle = false;
        this.showPopup = false;
        this.router = router;
        if (localStorage.getItem('tokenExpiryTime')) {
            const epxiryTime = localStorage.getItem('tokenExpiryTime');
            const now = new Date();
            const exp = new Date(parseInt(epxiryTime));
            const expiryValue = exp.valueOf();
            const nowValue = now.getTime();
            const diff = expiryValue - nowValue;
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

    userDetails(name, password, jwt): Observable < any > {
        return Observable.create(observer => {
            var self = this;
            var reqBodys = {
                userName: name,
                password: password
            };
            let headers = new Headers({
                'Authorization': jwt
            });
            let options = new RequestOptions({
                headers: headers
            });
            const url = constant.appcohesionURL.userDetails_URL;
            this.http
                .post(url, reqBodys, options)
                .subscribe(data => {
                    this.loading = false;
                    this.results = data ? data.json() : {};
                    if (this.results && this.results.status) {
                        if (this.results.status.code == constant.statusCode.success_code) {
                            localStorage.setItem("User_Information", JSON.stringify(this.results.data));
                        } else if (this.results.status.code == constant.statusCode.empty_code) {
                            localStorage.setItem("User_Information", "");
                        }
                        observer.next(this.results);
                        observer.complete();
                    }
                }, error => {
                    this.loading = false;
                    console.log(JSON.stringify(error));
                    observer.next(error);
                    observer.complete();
                });
        }, err => {
           
            console.log("error on user", err)
        })
    };

    userLogin(name, password): Observable < any > {
        return Observable.create(observer => {
            var self = this;
            var poolData = constant.userPoolData;
            var userPool = new CognitoUserPool(poolData);

            var authenticationData = {
                Username: name,
                Password: password
            };
            const authDetails = new AuthenticationDetails(authenticationData);
            var userData = {
                Username: name,
                Pool: userPool
            };
            var userCognito = new CognitoUser(userData);

            userCognito.authenticateUser(authDetails, {
                onSuccess: function(result) {
                    console.log("result conginitive token : ", result);
                    this.jwt = result.getIdToken().getJwtToken();
                    localStorage.setItem('isLoggedIn', 'true');

                    const idEpxiry = result.getIdToken().getExpiration();
                    console.log("expiration id : " + idEpxiry);
                    const str = idEpxiry + "";
                    const pad = "0000000000000";
                    const epxiryTime = str + pad.substring(0, pad.length - str.length);
                    localStorage.setItem('tokenExpiryTime', epxiryTime);
                    console.log(epxiryTime);

                    const now = new Date();
                    const exp = new Date(parseInt(epxiryTime));
                    const expiryValue = exp.valueOf();
                    const nowValue = now.getTime();
                    const diff = expiryValue - nowValue;
                    console.log('diff', diff);
                    let intervalId = setInterval(() => {
                        console.log('inside interval');
                        if (exp.valueOf() < now.valueOf()) {
                            clearInterval(intervalId);
                            // exp.setDate(exp.getDate() + 1);
                            self.userLogout();
                        }
                    }, diff);

                    var group = new JwtHelper().decodeToken(this.jwt);
                    if (group['cognito:groups'] && group['cognito:groups'][0]) {
                        localStorage.setItem('userGroup', group['cognito:groups'][0]);
                    } else {
                        localStorage.setItem('userGroup', '');
                    }


                    result => result.json();
                    observer.next(result);
                    observer.complete();
                },
                onFailure: function(err) {
                    console.log(err);
                    observer.next(err);
                    observer.complete();
                },
            });
        }, err => {
            console.log("error on user", err)
        })
    };

    userLogout = function() {
        var poolData = constant.userPoolData;
        var userPool = new CognitoUserPool(poolData);
        this.userSession = userPool.getCurrentUser();
        console.log(this.userSession);
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
            this.router.navigate(['']);

        }
    }

    getLoggedInState() {
        return this.isLoggedIn;
    }

    setProductDetails(data) {
        this.productInfo = data;
    }

    getSessionToken(): Observable < any > {
        var self = this;
        this.loading = true;
        return Observable.create(observer => {
            var poolData = constant.userPoolData;
            var userPool = new CognitoUserPool(poolData);
            var cognitoUser = userPool.getCurrentUser();
            console.log("congintio user : " + cognitoUser);
            if (cognitoUser != null) {
                cognitoUser.getSession(function(err, session) {
                    console.log('session validity: ' + session.getIdToken().getJwtToken());
                    if (err) {
                        console.log(err);
                        err => err.json();
                        observer.next(err);
                        observer.complete();
                    }
                    if (session && session.isValid()) {
                        session => session.json();
                        observer.next(session);
                        observer.complete();
                    } else { // session false OR token expired
                        self.userLogout();
                    }
                });
            }
        }, err => {
            console.log("error on session", err)
        })
    }

    getCognitoUser = function() {
        var poolData = constant.userPoolData;
        const userPool = new CognitoUserPool(poolData);
        this.userSession = userPool.getCurrentUser();
        const userData = {
            Username: this.userSession.username,
            Pool: userPool
        };
        return new CognitoUser(userData);
    };

    productSearchfromService(request_productsearch_type, request_productsearch_name, jwt, request_manufacturerId) {
        this.body = {};
        this.results = '';
        this.globalresultForLoop = '';
        var data = '';
        this.productsearch_name = request_productsearch_name ? request_productsearch_name : "";
        this.productsearch_type = request_productsearch_type ? request_productsearch_type : "";
        // this.product_manufacturerId = request_manufacturerId ? request_manufacturerId : "";
        let headers = new Headers({
            'Authorization': jwt
        });
        let options = new RequestOptions({
            headers: headers
        });
        // var reqBody = {this.productsearch_type : this.productsearch_name};
        this.body[this.productsearch_type] = this.productsearch_name;
        if (request_manufacturerId) {
            this.body['manufacturerID'] = request_manufacturerId ? request_manufacturerId : "";
        }
        var store_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].store_id : "";
        var retailer_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].entity_type == "Retailer" ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : "" : "";
        this.body['store_id'] = store_id;
        this.body['retailer_id'] = retailer_id;

        var reqBody = this.body;
        const url = constant.appcohesionURL.productSearch_URL;
        this.http
            .post(url, reqBody, options)
            .subscribe(data => {
                this.loading = false;
                this.results = data ? data.json() : {};
                if (this.results && this.results.status) {
                    if (this.results.status.code == constant.statusCode.success_code) {
                        this.resultForloop = this.results.stockDetails;
                        this.resultCount = this.results.totalResults;
                    } else if (this.results.status.code == constant.statusCode.empty_code) {
                        this.resultForloop = [];
                        this.resultCount = 0;
                    }
                    this.router.navigate(['/dashboard/search'], {
                        queryParams: reqBody
                    });
                }
            }, error => {
                this.loading = false;
                console.log(JSON.stringify(error));
            });
    }

    confirmOrderfromService(orderInfo, jwt): Observable < any > {
        this.loading = true;

        return Observable.create(observer => {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': jwt
            });
            let options = new RequestOptions({
                headers: headers
            });

            //alert("product info"+ JSON.stringify(this.productInfo));
            console.log("product info" + this.productInfo);
            let req_body = {
                "Quantity": orderInfo.Quandity ? orderInfo.Quandity : "",
                "ShippingMethod": orderInfo.ShippingMethod ? orderInfo.ShippingMethod : "",
                "ShipToStreetLine2": "ShipToStreetLine2",
                "ecomdashID": "ecomdashID",
                "BuyerType": "Retailer",
                "ShipToStreetLine1": orderInfo.ShipToStreetLine1 ? orderInfo.ShipToStreetLine1 : "",
                "ShipToCity": orderInfo.ShipToCity ? orderInfo.ShipToCity : "",
                "ConsumerName": orderInfo.ConsumerName ? orderInfo.ConsumerName : "",
                "ProductPrice": orderInfo.ProductPrice ? orderInfo.ProductPrice : "",
                "FFL": orderInfo.FFL ? orderInfo.FFL : "",
                "CustomerPrice": "123.35",
                "SellerType": "Distributor",
                "GSIN": this.productInfo && this.productInfo.gsin ? this.productInfo.gsin : "",
                "Custom4": "Custom4",
                "ShipToPostalCode": orderInfo.ShipToPostalCode ? orderInfo.ShipToPostalCode : "",
                "Custom3": "Custom3",
                "Custom2": "Custom2",
                "Custom1": "Custom1",
                "ShipToState": orderInfo.ShipToState ? orderInfo.ShipToState : "",
                "BuyerID": "1",
                "Phone": orderInfo.Phone ? orderInfo.Phone : "",
                "SellerID": "3",
                "distributor_name": this.productInfo && this.productInfo.distributor_name ? JSON.stringify(this.productInfo.distributor_name) : "",
                "product_name": this.productInfo && this.productInfo.product_Name ? JSON.stringify(this.productInfo.product_Name) : "",
                "manufacturer_partnumber": this.productInfo && this.productInfo.mpn ? this.productInfo.mpn : "",
                "manufacturer": this.productInfo && this.productInfo.manufacturerName ? JSON.stringify(this.productInfo.manufacturerName) : "",
                "msrp": this.productInfo && this.productInfo.productPrice ? this.productInfo.productPrice : "",
                "email": orderInfo.Email ? orderInfo.Email : "",
                "delivery_instructions": orderInfo.delivery_instructions ? JSON.stringify(orderInfo.delivery_instructions) : "NULL",
                "action": "processNewOrder",

            };
            var store_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].store_id : "";
            var retailer_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].entity_type == "Retailer" ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : "" : "";
            var user_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].user_id : "";
            
            req_body['storeId'] = store_id;
            req_body['retailer_id'] = retailer_id;
            //let req_body = {  "ecomdashID": "ecomdashID",  "Quandity": orderInfo.Quandity?orderInfo.Quandity:"",  "ShippingMethod": orderInfo.ShippingMethod?orderInfo.ShippingMethod:"",  "ShipToStreetLine1": "",  "ShipToStreetLine2": "ShipToStreetLine2",  "ShipToCity": "ShipToCity",  "BuyerType": "Retailer",  "ConsumerName": "ConsumerName",  "ProductPrice": "123.45",  "CustomerPrice": "123.35",  "GSIN": this.productsearch_name,  "Custom1": "Custom1",  "Custom2": "Custom2",  "Custom3": "Custom3",  "Custom4": "Custom4",  "SKUNumber": "100386",  "ShipToPostalCode": "ShipToPostalCode",  "ShipToState": "ShipToState",  "BuyerID": "1",  "SellerID": "1",  "Phone": "3474845476",  "FFL": "FFLLicense",  "SellerType": "Distributor"}
            // const url = 'https://api.appcohesion.io/placeOrder';
            // const url = 'https://jp7oyuf6ch.execute-api.us-east-1.amazonaws.com/prod/';
            const url = constant.appcohesionURL.placeOrder_URL;
            this.http
                .post(url, req_body, options)
                .subscribe(data => {
                    this.loading = false;
                    //alert(JSON.stringify(data));
                    this.results = data ? data.json() : '';

                    if (this.results) {
                        if (this.results.status.code == constant.statusCode.success_code) {
                            this.orderId = this.results.data[0].orderId;
                            this.showclickorder = false;
                            this.showPopup = !this.showPopup;
                            console.log(JSON.stringify(this.results));
                            observer.next(this.results);
                            observer.complete();
                        } else {
                            //alert(this.results.status);
                        }
                        // alert(this.results.status);
                        console.log(this.results);
                    } else {
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


    updateRecordinDB(
        information_fetchdb, fieldName): Observable < any > {
        return Observable.create(observer => {
            let headers = new Headers({
                'Content-Type': 'application/json'
            });
            let options = new RequestOptions({
                headers: headers
            });
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
        }, err => {
            console.log("error", err)
        })
    }


    csvfileUpload(body_csv): Observable < any > {
        var self = this;
        //this.loading = true;
        return Observable.create(observer => {
            // var poolData = {
            //this.loading = true;
            let headers = new Headers({
                'Content-Type': 'application/json'
            });
            let options = new RequestOptions({
                headers: headers
            });
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
        }, err => {
            console.log("error", err)
        })
    }
    createUser(jwt, userInfo) {
        this.loading = true;
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': jwt
        });
        let options = new RequestOptions({
            headers: headers
        });
        var store_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].store_id : "";
        var entity_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : "";

        let req_body = {
            "role_id": "1",
            "user": {
                "user_name": userInfo.email,
                "password": userInfo.password,
                "email": userInfo.email,
                "first_name": userInfo.firstName,
                "last_name": userInfo.lastName,
                "role_id": "2",
				"store_id": store_id,
				"entity_id":entity_id
            }
        };
        // const url = 'https://7v5j1r1r92.execute-api.us-east-1.amazonaws.com/prod/cognitoSignin';
        const url = constant.appcohesionURL.createUser_URL;
        this.http
            .post(url, req_body, options)
            .subscribe(data => {
                this.loading = false;
				this.results = data.json();
				if (this.results.status.code == constant.statusCode.success_code) {             
					this.createUserPopup =true;
                   // alert(this.results.data.user.username + " has been created successfully and an email has been sent to his email id!");
                } else {
                    alert(this.results.Error.message + " ! ");
                }
                console.log(this.results);
            }, error => {
                this.loading = false;
                console.log("error" + JSON.stringify(error));
            });
    }

    // Method for setting retailer id for retailer markup
    setRetailerIdforCategory(retailerId){
        this.retailerId = retailerId;
    }

    // Method for Listing Retailer Category
    


    //Listing users in cognito Pool
    listUsers() {
        this.loading = true;
        //Taking Session Value for passing token
        return this.getSessionToken().subscribe((response) => {
            if (response.getIdToken().getJwtToken()) {
                this.jwt = response.getIdToken().getJwtToken();
                let headers = new Headers({
                    'Authorization': this.jwt
                });
                let options = new RequestOptions({
                    headers: headers
                });
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

    listRetailer(){
        this.loading = true;
        this.retailerId =  this.retailerId ?  this.retailerId : "";
          //Taking Session Value for passing token
          return this.getSessionToken().subscribe((response) => {
            if (response.getIdToken().getJwtToken()) {
                this.jwt = response.getIdToken().getJwtToken();
            }
            let headers = new Headers({
                'Authorization': this.jwt
            });
            let options = new RequestOptions({
                headers: headers
            });
            let req_body = {
                "retailer_id" : this.retailerId
            };
            const url = constant.appcohesionURL.retailercategorylist_URL;
            this.http
            .post(url, req_body, options)
            .subscribe(data => {
                this.loading = false;
                console.log("retailer data : " + data)
                this.result = data.json();
                if (this.result && this.result.status) {
                   if(this.result.status.code == constant.statusCode.success_code){
                       this.retailerCategory = this.result.markups;
                       console.log("retailer category : " + JSON.stringify(this.retailerCategory));
                   } else if (this.results.status.code == constant.statusCode.empty_code) {
                       this.retailerCategory = [];
                   }
                }
            }, error => {
                this.loading = false;
                console.log("error" + JSON.stringify(error));
            });

          },(err) => {
            console.log(err);
        });
    }

    //Method for displaying apply markup
    // applyMarkupform(categoryId){
    //     console.log("inside applymarkup ")
    //   for(var i = 0; i <  this.retailerCategory.length; i++ ){
    //     console.log("inside applymarkup retailerCategory " + JSON.stringify(this.retailerCategory[i]));
    //       if(categoryId == this.retailerCategory[i].categoryId){

    //         this.applyMarkup = true;
    //         console.log(" this.applyMarkup boolean  " + JSON.stringify(this.applyMarkup));
    //       }
    //   }
    // }

}