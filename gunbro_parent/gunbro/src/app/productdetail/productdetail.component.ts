import { Component, OnInit, Input } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { DashboardComponentComponent } from '../dashboard-component/dashboard-component.component';

import { DemoService } from '../demo-component/demo.service';
import * as constant from '../shared/config';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit {
@Input() resultssearch;
results: any;
// selectedShipping: any;
//showclickorder: any;
	values = [
		{"name":'Ground (3-5 days)', key:'1'},
		{"name":'Priority (2 days) Priority', key:'2'},
		{"name":'Next Day Air', key:'3'}
	];
	selectedShipping = this.values[0].key;

	selectedQuantity: any;
	// selectedShipping: any;
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	address: any;
	zipcode: any;
	city: string;
	state: string;
	ffl: string;
	amount: number;
	temp : number;
	orderInfo : any;
	delivery: string;
	model: Object = {};
	ssProductQuantity: string;
	storeLocations: any;
	retailerStoreDetails: any;
	selectedStore: any;
	getStoreDetails : boolean = false;
	userDetails: any;
  	constructor(private route: ActivatedRoute,private router: Router,public searchComponent: ProductSearchComponent, public demoService: DemoService, private http:Http,private dashboardComponent:DashboardComponentComponent) {
		this.selectedQuantity = 1;
		this.ffl = "5-76-339-07-6M-02775";
		this.amount = demoService.productInfo && demoService.productInfo.productPrice ? demoService.productInfo.productPrice : '';
		this.temp = this.amount;
	}

	ngOnInit() {
			this.demoService.showPopup = false;
			this.demoService.showclickorder = false;
			this.demoService.productInfo = this.route.snapshot.queryParams?this.route.snapshot.queryParams:"";
			this.userDetails = {};
			this.userDetails.first_name = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).first_name : "";
			this.userDetails.last_name = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).last_name : "";
	    if(this.demoService.productInfo && this.demoService.productInfo.distributor_name) {
	    	if (constant.distApiList.indexOf((this.demoService.productInfo.distributor_name).toLowerCase()) > -1) {
			    this.checkSSQuantity().subscribe((response) => {
			    	console.log("quantityyyy : " + response.Quantity);
			    	this.ssProductQuantity = response.Quantity ? response.Quantity : '0';
			    },
			    	(err) => console.error(err)
			    );
			}
			}
			this.storeDetails().subscribe((response) => {
			},
			(err) => console.error(err)
			);
	}

	placeOrder(event) {  	
		event.stopPropagation()
 		this.demoService.showclickorder = true;
		 console.log(this.selectedQuantity, this.selectedShipping);
		//  this.getStoreDetails = true;
	}

	placeMyOrderClose() {
		this.demoService.showclickorder = false;
	}

	onQuantityChange ($event) {
		console.log($event);
		this.amount = this.temp * $event;
	}

	getToken (bookForm) {
		
        return this.demoService.getSessionToken().subscribe((response) => {
            if(response.getIdToken().getJwtToken()) {
                const jwt = response.getIdToken().getJwtToken();
                this.confirmOrder(bookForm, jwt);
            }
        }, (err) => {
          console.log(err);
        });
    }

	confirmOrder (bookForm, jwt) {
		this.orderInfo = {
			"Quandity": this.selectedQuantity ? this.selectedQuantity : 1,
			"ShippingMethod": this.selectedShipping ? this.selectedShipping : 1,
			"ShipToStreetLine1": this.address ? this.address : "",
			"ShipToCity": this.city ? this.city : "",
			"ConsumerName": this.firstName ? this.firstName : "",
			"ProductPrice": this.amount ? this.amount : 0,
			"FFL": this.ffl ? this.ffl : "",
			"ShipToPostalCode": this.zipcode ? this.zipcode : "",
			"ShipToState": this.state ? this.state : "",
			"Phone": this.phone ? this.phone : "",
			"Email": this.email ? this.email : "",
			"delivery_instructions": this.delivery ? this.delivery : "",
			"StoreId": this.selectedStore ? this.selectedStore : ""
		};
	    return this.demoService.confirmOrderfromService(this.orderInfo, jwt).subscribe((resp) => {
			this.demoService.loading = false;
			if(resp) { // If response from API
				if(resp.data && resp.data[0] && resp.data[0].orderId) { // If response has OrderId
					var orderId = resp.data[0].orderId;
					// Insert into DynamodB with OrderId for SS & others
					var params = {
						"id": orderId
					};
					// if(resp.status == "success" && resp.SS_OrderNumber) {
					// 	params["SS_OrderNumber"] = resp.SS_OrderNumber;
					// 	// params["SS_OrderNumber"] = "5331014";
					// }
					if(resp.data[0].SS_OrderNumber) {
						params["SS_OrderNumber"] = resp.data[0].SS_OrderNumber;
					}
					console.log('first db parammmm', params);
					this.demoService.updateRecordinDB(params).subscribe((csvresponse) => {
			          console.log("updated db" + csvresponse);
			        }, (err) => {
			          console.log(err);
			        });
				}
				// if(resp.results) { // Insert CSV file into S3 for other distributors
				if(!resp.data[0].SS_OrderNumber) {
					var body_csv = {
			        	"response" : resp && resp.data[0] ? resp.data[0] :''
					}	
			       	this.demoService.csvfileUpload(body_csv).subscribe((csvresponse) => {
				    	console.log("CSV upload completed" + csvresponse );
				    }, (err) => {
				        console.log(err);
					});
				}
				// }
				/*else { // Response from SS API alone
					if(resp && resp.status) {
						var statusApiIntegration = "";
						if(resp.message) {
							statusApiIntegration = resp.message;
						}
						else {
							statusApiIntegration = resp.status == "success" ? "Success from SSAPI" : "Failure in SSAPI";
						}
					    //alert(statusApiIntegration);
					}
				}*/
			}
	    }, (err) => {
	    	console.log(err);
		});

	}

	checkSSQuantity(): Observable < any >{
	    return Observable.create(observer => {
	      return this.demoService.getSSQuantity().subscribe((response) => {
	            this.demoService.loading = false;
	            console.log(response);
	            observer.next(response);
	            observer.complete();
	          });
	    }, err => {
	      console.log("error on order", err)
	    })
	  }

	submitForm(form: any): void{
	    console.log('Form Data: ');
	    console.log(form.form.valid);
		}
	
	//Method for listing store details
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
	                    "entityId": localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : ""
	                };
	                const url = constant.appcohesionURL.retailerStore_URL && constant.appcohesionURL.retailerStore_URL != 'null' ? constant.appcohesionURL.retailerStore_URL : '';
	                this.http.post(url, req_body, options).subscribe(data => {
	                  this.demoService.loading = false;
	                  this.results = data.json();
	                  if(this.results && this.results.status){
	                   if(this.results.status.code == 200){
	                     for(var i = 0; i < this.results.data.length; i++){
	                     	this.storeLocations = {};
												 this.storeLocations.StoreName = this.results.data[i].StoreName && this.results.data[i].StoreName ? this.results.data[i].StoreName : '';
												 this.storeLocations.StoreId = this.results.data[i].StoreId ? this.results.data[i].StoreId : '';
												// this.storeLocations.RetailerName = this.results.data[i].RetailerName ? this.results.data[i].RetailerName : '';
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


}
