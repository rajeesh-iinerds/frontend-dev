import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { DemoService } from '../demo-component/demo.service';
import * as constant from '../shared/config';

@Component({
  selector: 'app-retailer-markup',
  templateUrl: './retailer-markup.component.html',
  styleUrls: ['./retailer-markup.component.css']
})
export class RetailerMarkupComponent implements OnInit {
  result: any;
  retailerDetails: any;
  retailerList : any;
  constructor(private http: Http, private router: Router, public demoService: DemoService) { }

  ngOnInit() {
    this.listRetailorDetails().subscribe((response) => {
      console.log("function call retailer detailes : " + JSON.stringify(response));
    },
    (err) => console.error(err)
    );
  }

  
  // Method for listing retailer details
  listRetailorDetails(): Observable < any >{
    this.retailerList = {};
    return Observable.create(observer => {
      return this.demoService.getSessionToken().subscribe((response) => {
        if (response.getIdToken().getJwtToken()) {
          const jwt = response.getIdToken().getJwtToken();
          let headers = new Headers({ 'Authorization': jwt });
          let options = new RequestOptions({ headers: headers });
          var req_body = '';
          const url = constant.appcohesionURL.retailerList_URL;
          this.http.post(url, req_body, options).subscribe(data => {
            this.demoService.loading = false;
            this.result = data.json();
            console.log("result details : " + JSON.stringify(this.result));
            this.retailerDetails = this.result.retailers;
            for (let retailerList of this.retailerDetails) {
              this.retailerList = {
                "address" : retailerList.address ? retailerList.address : "",
                "retailerName": retailerList.retailerName ? retailerList.retailerName : "",
                "retailerId": retailerList.retailerId ? retailerList.retailerId : "" };
              }
              observer.next(this.retailerList);
              observer.complete();
          });
        }
      });
    }, err => {
      console.log("error on order", err)
    })
  }

  // Method for directing the distributor to their corresponding own page
  distributorSingle(retailerId){
    if(this.retailerList.retailerId == retailerId){
    this.demoService.setRetailerIdforCategory(retailerId);
    this.router.navigate(['/dashboard/RetailerSingle']);
    }
    else{
      this.router.navigate(['/dashboard/RetailerMarkup']);
    }
  }
}
