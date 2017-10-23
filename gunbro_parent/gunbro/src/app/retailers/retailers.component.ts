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
  results : any;
  storeLocations: any;
  retailerStoreDetails: any;
  constructor(public demoService: DemoService , private http: Http) { 
   
  }

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
            this.retailerDetails.email = retailerInfoFromtoken.email ? retailerInfoFromtoken.email : '';
            this.retailerDetails.name = retailerInfoFromtoken.name ? retailerInfoFromtoken.name : '';
            console.log("retailer name : " + JSON.stringify(retailerInfoFromtoken));
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
                let headers = new Headers({ 'Authorization': jwt });
                let options = new RequestOptions({ headers: headers });
                let req_body = {
                    "retailerId": "1"
                };
                const url = constant.appcohesionURL.retailerStore_URL && constant.appcohesionURL.retailerStore_URL != 'null' ? constant.appcohesionURL.retailerStore_URL : '';
                this.http.post(url, req_body, options).subscribe(data => {
                  this.demoService.loading = false;
                  this.results = data.json();
                  if(this.results && this.results.status){
                   if(this.results.status.code == 200){
                     for(var i = 0; i < this.results.data.length; i++){
                        this.storeLocations.StoreAddress = this.results.data[i].StoreAddress && this.results.data[i].StoreAddress !=null ? this.results.data[i].StoreAddress : '';
                        this.storeLocations.StoreName = this.results.data[i].StoreName && this.results.data[i].StoreName ? this.results.data[i].StoreName : '';
                        this.storeLocations.StoreLocation = this.results.data[i].StoreLocation && this.results.data[i].StoreLocation ? this.results.data[i].StoreLocation : '';
                        this.storeLocations.StoreContact = this.results.data[i].StoreContact ? this.results.data[i].StoreContact : '';
                        this.retailerStoreDetails.push(this.storeLocations);
                      }
                    }
                    else if(this.results.status.code == constant.statusCode.empty_code){
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
