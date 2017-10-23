import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { JwtHelper } from 'angular2-jwt/angular2-jwt';
import { DemoService } from '../demo-component/demo.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import * as constant from '../shared/config';

@Component({
  selector: 'app-retailers',
  templateUrl: './retailers.component.html',
  styleUrls: ['./retailers.component.css']
})
export class RetailersComponent implements OnInit {
  retailerDetails: any;
  RetailerDemo : boolean = true;
  constructor(public demoService: DemoService , private http: Http) { }

  ngOnInit() {
    this.getRetailerDetails().subscribe((response) => {
      },
      (err) => console.error(err)
     );
    this.storeDetails().subscribe((response) => {
    },
    (err) => console.error(err)
   );
  }

  getRetailerDetails(): Observable < any >  {
    this.retailerDetails = {};
    return Observable.create(observer => {
    this.demoService.getSessionToken().subscribe((response) => {
      if(response.getIdToken().getJwtToken()) {
           const jwt = response.getIdToken().getJwtToken();
           var retailerInfoFromtoken = new JwtHelper().decodeToken(jwt);
           this.demoService.loading = false;
           if(retailerInfoFromtoken != null && retailerInfoFromtoken){
            console.log("retailerDetails  : " + JSON.stringify(retailerInfoFromtoken));
            this.retailerDetails.email = retailerInfoFromtoken.email ? retailerInfoFromtoken.email : '';
            this.retailerDetails.name = retailerInfoFromtoken.name ? retailerInfoFromtoken.name : '';
           }
       }
    });
    }, (err) => {
      console.log(err);
    });
  }

  // storeDetails():  Observable < any >  {
  //   return Observable.create(observer => {
  //     return this.demoService.getSessionToken().subscribe((response) => {
  //         if (response.getIdToken().getJwtToken()) {
  //             const jwt = response.getIdToken().getJwtToken();
  //             let headers = new Headers({ 'Authorization': jwt });
  //             let options = new RequestOptions({ headers: headers });
  //             console.log("options : " + options)
  //             let req_body = {
  //               "retailerId": "1"
  //             }
  //             const url = constant.appcohesionURL.retailerStore_URL && constant.appcohesionURL.retailerStore_URL != 'null' ? constant.appcohesionURL.retailerStore_URL : '';
  //             this.http.post(url, req_body, options).subscribe(data => {
  //               console.log("store details : " + JSON.stringify(data));
  //               this.demoService.loading = false;
  //               observer.next();
  //               observer.complete();
  //             });
  //         }
  //     });
  // }, (err) => {
  //     console.log(err);
  //   });
  // }

   // Method for listing Order list
   storeDetails(): Observable < any > {
    return Observable.create(observer => {
        return this.demoService.getSessionToken().subscribe((response) => {
            if (response.getIdToken().getJwtToken()) {
                const jwt = response.getIdToken().getJwtToken();
                console.log("jwt : " +  JSON.stringify(jwt));
                let headers = new Headers({ 'Authorization': jwt });
                console.log("headers : " + JSON.stringify(headers));
                let options = new RequestOptions({ headers: headers });
                console.log("options : " + JSON.stringify(options));
                let req_body = {
                    "retailerId": "1"
                };
                const url = constant.appcohesionURL.retailerStore_URL && constant.appcohesionURL.retailerStore_URL != 'null' ? constant.appcohesionURL.orderList_URL : '';
                this.http.post(url, req_body, options).subscribe(data => {
                  this.demoService.loading = false;
                    console.log("retailer details : " + JSON.stringify(data));
                    observer.next();
                    observer.complete();
                });
            }
        });
    }, err => {
        console.log("error on order", err)
    })
 }
}
