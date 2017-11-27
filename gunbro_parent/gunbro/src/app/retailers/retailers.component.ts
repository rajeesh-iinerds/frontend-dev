import {
  Component,
  OnInit
} from '@angular/core';
import {
  Http,
  Headers,
  Response,
  RequestOptions
} from '@angular/http';
import {
  Observable
} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {
  JwtHelper
} from 'angular2-jwt/angular2-jwt';
import {
  DemoService
} from '../demo-component/demo.service';
import {
  ActivatedRoute,
  RouterModule,
  Router
} from '@angular/router';
import * as constant from '../shared/config';

@Component({
  selector: 'app-retailers',
  templateUrl: './retailers.component.html',
  styleUrls: ['./retailers.component.css']
})
export class RetailersComponent implements OnInit {
  retailerDetails: any;
  RetailerDemo: boolean = true;
  results: any;
  storeLocations: any;
  retailerStoreDetails: any;
  userName: any;
  constructor(public demoService: DemoService, private http: Http) {}

  ngOnInit() {
      this.getRetailerDetails().subscribe((response) => {
      },
          (err) => console.error(err)
      );
      this.storeDetails().subscribe((response) => {},
          (err) => console.error(err)
      );
  }

  getRetailerDetails(): Observable < any > {
      this.retailerDetails = {};
      this.userName = this.demoService.getCognitoUser().getUsername();
      return Observable.create(observer => {
          this.demoService.getSessionToken().subscribe((response) => {
              if (response.getIdToken().getJwtToken()) {
                  const jwt = response.getIdToken().getJwtToken();
                  var retailerInfoFromtoken = new JwtHelper().decodeToken(jwt);
                  this.demoService.loading = false;
                  if (retailerInfoFromtoken != null && retailerInfoFromtoken) {
                      this.retailerDetails.email = retailerInfoFromtoken.email ? retailerInfoFromtoken.email : '';
                      this.retailerDetails.name = retailerInfoFromtoken.name ? retailerInfoFromtoken.name : this.userName;
                  }
              }
          });
      }, (err) => {
          console.log(err);
      });
  }

  // Method for listing Store details
  storeDetails(): Observable < any > {
      this.storeLocations = {};
      this.retailerStoreDetails = [];
      return Observable.create(observer => {
          return this.demoService.getSessionToken().subscribe((response) => {
              if (response.getIdToken().getJwtToken()) {
                  const jwt = response.getIdToken().getJwtToken();
                  let headers = new Headers({
                      'Authorization': jwt
                  });
                  let options = new RequestOptions({
                      headers: headers
                  });
                  let req_body = {
                      "entity_id": localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : ""                     
                  };
                  const url = constant.appcohesionURL.retailerStore_URL && constant.appcohesionURL.retailerStore_URL != 'null' ? constant.appcohesionURL.retailerStore_URL : '';
                  this.http.post(url, req_body, options).subscribe(data => {
                      this.demoService.loading = false;
                      this.results = data.json();
                      if (this.results && this.results.status) {
                          if (this.results.status.code == 200) {
                              this.retailerStoreDetails = this.results.data;
                              for (var i = 0; i < this.results.data.length; i++) {
                                  // showing retailer profile details like location, address, fax and contact from first store location details.
                                  this.storeLocations = {
                                      "StoreName": this.results.data[0].StoreName ? this.results.data[0].StoreName : '',
                                      "StoreLocation": this.results.data[0].StoreLocation ? this.results.data[0].StoreLocation : '',
                                      "StoreAddress": this.storeLocations.StoreName + ',' + this.storeLocations.StoreLocation,
                                      "StoreContact": this.results.data[0].StoreContact ? this.results.data[0].StoreContact : '',
                                      "fax": this.results.data[0].RetailerFax ? this.results.data[0].RetailerFax : ''
                                  };
                              }
                          } else if (this.results.status.code == constant.statusCode.empty_code) {
                              this.retailerStoreDetails = {};
                          }
                      }
                      observer.next(this.storeLocations);
                      observer.complete();
                  });
              }
          });
      }, err => {
          console.log("error on order", err)
      })
  }
}