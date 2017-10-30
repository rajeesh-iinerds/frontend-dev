import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { DemoService } from '../demo-component/demo.service';
import * as constant from '../shared/config';

@Component({
  selector: 'app-store-location',
  templateUrl: './store-location.component.html',
  styleUrls: ['./store-location.component.css']
})
export class StoreLocationComponent implements OnInit {
	results : any;
  	storeLocations: any;
  	retailerStoreDetails: any;
  	showViewStore: boolean = false;
  	selectedStore : any;
  	showCreateStore: boolean = false;
  	userInfo = {
      "firstName": '',
      "ffl": '',
      "city": '',
      "state": '',
      "address": '',
      "phone": '',
      "fax": '',
      "email": ''
    };

  constructor(public demoService: DemoService , private http: Http) {
  }

  ngOnInit() {
  	this.storeDetails().subscribe((response) => {
	},
		(err) => console.error(err)
	);
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
	                      this.retailerStoreDetails = [];
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

  	viewStore(name) {
  		this.showViewStore = true;
  		this.selectedStore = {};
  		for(var i = 0; i < this.retailerStoreDetails.length; i++){
        if(this.retailerStoreDetails[i].StoreName == name){
            this.selectedStore.StoreName = this.retailerStoreDetails[i].StoreName ? this.retailerStoreDetails[i].StoreName:'';
            this.selectedStore.StoreContact = this.retailerStoreDetails[i].StoreContact ? this.retailerStoreDetails[i].StoreContact : '';
            this.selectedStore.StoreAddress = this.retailerStoreDetails[i].StoreAddress ? this.retailerStoreDetails[i].StoreAddress : '';
            this.selectedStore.StoreLocation = this.retailerStoreDetails[i].StoreLocation ? this.retailerStoreDetails[i].StoreLocation : '';
            //FFL
            //Contact Person
            //Fax
            //Email
        }
     }
  	}

  	// closeView() {
  	// 	this.showAddStore = !this.showAddStore;
  	// }
  	createStore() {
  		this.showCreateStore = true;
  	}
  	createStoreClick() {
  		console.log(this.userInfo);
  		var entity_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : "";
  		return this.demoService.getSessionToken().subscribe((response) => {
	      	if(response.getIdToken().getJwtToken()) {
	           const jwt = response.getIdToken().getJwtToken();
	           this.demoService.loading = true;
	        	let headers = new Headers({
		            'Content-Type': 'application/json',
		            'Authorization': jwt
		        });
		        let options = new RequestOptions({
		            headers: headers
		        });
		        // var entity_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : "";

		        let req_body = {
					"entity_id": localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : "",
					"store_name": this.userInfo.firstName,
					"ffl" : this.userInfo.ffl,
					"city": this.userInfo.city,
					"state": this.userInfo.state,
					"address": this.userInfo.address,
					"phone": this.userInfo.phone,
					"fax:" : this.userInfo.fax
		        };
		        // const url = constant.appcohesionURL.placeOrder_URL;
		        /*this.http
	            .post(url, req_body, options)
	            .subscribe(data => {
	                this.demoService.loading = false;
	                this.results = data.json();
	                this.createUserMessage = "";
	                this.createUserStatus = ""
	                if (this.results.status && this.results.status.code && this.results.status.code == constant.statusCode.success_code) {             
	                    this.createUserMessage = "Congratulations!! You have successfully added user. Email has been sent to his email id!";
	                    this.createUserStatus = "SUCCESS"
	                   } else {
	                    this.createUserMessage = this.results.status.message.message + " ! ";
	                    this.createUserStatus = "SORRY";
	                   }
	            }, error => {
	                this.demoService.loading = false;
	                console.log("error" + JSON.stringify(error));
	            });*/

		      }
		    }, (err) => {
		    console.log(err);
		});
  	}
}
