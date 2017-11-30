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
      "email": '',
	  "zip": '',
	  "ffldoc":''
    };
    createStorePopup: boolean = false;
	successTitle : string;
	successDescription: string;
	isEditClicked: boolean = false;
	currentStore: any;
	deleteStoreId: any;
	deleteStorePopup: boolean = false;
	ffldoc:any;
	constructor(public demoService: DemoService , private http: Http) {
		this.demoService.showRetailerProfile = false;
	}

	ngOnInit() {
		this.showCreateStore = false;
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
	                    "entityId": localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : ""
					};
					this.demoService.loading = true;
	                const url = constant.appcohesionURL.retailerStore_URL && constant.appcohesionURL.retailerStore_URL != 'null' ? constant.appcohesionURL.retailerStore_URL : '';
	                this.http.post(url, req_body, options).subscribe(data => {
	                  this.demoService.loading = false;
	                  this.results = data.json();
	                  if(this.results && this.results.status){
	                   if(this.results.status.code == 200 && this.results.data){
	                     for(var i = 0; i < this.results.data.length; i++){
	                     	this.storeLocations = {};
	                        this.storeLocations.StoreAddress = this.results.data[i].StoreAddress && this.results.data[i].StoreAddress !=null ? this.results.data[i].StoreAddress : '';
	                        this.storeLocations.StoreName = this.results.data[i].StoreName && this.results.data[i].StoreName ? this.results.data[i].StoreName : '';
	                        this.storeLocations.StoreLocation = this.results.data[i].StoreLocation && this.results.data[i].StoreLocation ? this.results.data[i].StoreLocation : '';
	                        this.storeLocations.StoreContact = this.results.data[i].StoreContact ? this.results.data[i].StoreContact : '';
	                        this.storeLocations.StoreFFLId = this.results.data[i].StoreFFLId ? this.results.data[i].StoreFFLId : '';
	                        this.storeLocations.StoreId = this.results.data[i].StoreId ? this.results.data[i].StoreId : '';

	                        this.storeLocations.RetailerName = this.results.data[i].RetailerName ? this.results.data[i].RetailerName : '';
            				this.storeLocations.RetailerFax = this.results.data[i].RetailerFax ? this.results.data[i].RetailerFax : '';
            				this.storeLocations.RetailerEmail = this.results.data[i].RetailerEmail ? this.results.data[i].RetailerEmail : '';
            				this.storeLocations.StoreFax = this.results.data[i].StoreFax && this.results.data[i].StoreFax !='null' ? this.results.data[i].StoreFax : '';
            				this.storeLocations.StoreEmail = this.results.data[i].StoreEmail ? this.results.data[i].StoreEmail : '';
            				this.storeLocations.FFLNumber = this.results.data[i].FFLNumber ? this.results.data[i].FFLNumber : 'Not available';

	                        this.retailerStoreDetails.push(this.storeLocations);
	                      }
	                      console.log('***********', this.retailerStoreDetails);
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

  	viewStore(id) {
  		event.stopPropagation();
  		this.showViewStore = true;
		  this.selectedStore = {};
		  if(this.retailerStoreDetails){
  		for(var i = 0; i < this.retailerStoreDetails.length; i++){
        if(this.retailerStoreDetails[i].StoreId == id){
        	this.selectedStore.StoreId = this.retailerStoreDetails[i].StoreId && this.retailerStoreDetails[i].StoreId!='null'? this.retailerStoreDetails[i].StoreId:'Not available';
            this.selectedStore.StoreName = this.retailerStoreDetails[i].StoreName && this.retailerStoreDetails[i].StoreName!='null'? this.retailerStoreDetails[i].StoreName:'Not available';
            this.selectedStore.StoreContact = this.retailerStoreDetails[i].StoreContact  && this.retailerStoreDetails[i].StoreContact!='null'? this.retailerStoreDetails[i].StoreContact : 'Not available';
            this.selectedStore.StoreAddress = this.retailerStoreDetails[i].StoreAddress && this.retailerStoreDetails[i].StoreAddress!='null'? this.retailerStoreDetails[i].StoreAddress : 'Not available';
            this.selectedStore.StoreLocation = this.retailerStoreDetails[i].StoreLocation && this.retailerStoreDetails[i].StoreLocation!='null'? this.retailerStoreDetails[i].StoreLocation : 'Not available';
            this.selectedStore.StoreFFLId = this.retailerStoreDetails[i].StoreFFLId && this.retailerStoreDetails[i].StoreFFLId!='null'? this.retailerStoreDetails[i].StoreFFLId : 'Not available';
            this.selectedStore.RetailerName = this.retailerStoreDetails[i].RetailerName && this.retailerStoreDetails[i].RetailerName!='null'? this.retailerStoreDetails[i].RetailerName : 'Not available';
            this.selectedStore.RetailerFax = this.retailerStoreDetails[i].RetailerFax &&this.retailerStoreDetails[i].RetailerFax!='null' ? this.retailerStoreDetails[i].RetailerFax : 'Not available';
            this.selectedStore.RetailerEmail = this.retailerStoreDetails[i].RetailerEmail && this.retailerStoreDetails[i].RetailerEmail!='null'? this.retailerStoreDetails[i].RetailerEmail : 'Not available';
            this.selectedStore.StoreFax = this.retailerStoreDetails[i].StoreFax && this.retailerStoreDetails[i].StoreFax!='null'? this.retailerStoreDetails[i].StoreFax : 'Not available';
            this.selectedStore.StoreEmail = this.retailerStoreDetails[i].StoreEmail && this.retailerStoreDetails[i].StoreEmail!='null'? this.retailerStoreDetails[i].StoreEmail : 'Not available';
            this.selectedStore.FFLNumber = this.retailerStoreDetails[i].FFLNumber && (this.retailerStoreDetails[i].FFLNumber!='null' || this.retailerStoreDetails[i].FFLNumber!='Not available')? this.retailerStoreDetails[i].FFLNumber : 'Not available';
        }
	 }
	}
  	}

  	createStore(event) {
  		event.stopPropagation();
  		this.isEditClicked = false;
  		this.userInfo = {
	    	"firstName": '',
	      	"ffl": '',
	      	"city": '',
	      	"state": '',
	      	"address": '',
	      	"phone": '',
	      	"fax": '',
	      	"email": '',
			 "zip": '',
			 "ffldoc":''
	    };
  		this.showCreateStore = true;
  	}
	  changeListener(event) {
		var file: File = event.target.files[0];
		var myReader: FileReader = new FileReader();

		myReader.onloadend = (e) => {
			this.ffldoc = myReader.result;
			console.error(this.ffldoc);
		}
		myReader.readAsBinaryString(file);
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
		        let req_body = {
					"entity_id": localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : "",
					"store_name": this.userInfo.firstName,
					"ffl" : this.userInfo.ffl ? this.userInfo.ffl : 'NULL',
					"city": this.userInfo.city,
					"state": this.userInfo.state,
					"address": JSON.stringify(this.userInfo.address),
					"phone": this.userInfo.phone ? this.userInfo.phone : 'NULL',
					"fax" : this.userInfo.fax ?  this.userInfo.fax : 'NULL',
					"email" : this.userInfo.email ?  this.userInfo.email : 'NULL',
					"zip" : this.userInfo.zip,
					"ffldoc":JSON.stringify(btoa(this.ffldoc))
					
				};
				console.log("request body : " + JSON.stringify(req_body))
		        if(this.isEditClicked == true) {
		        	req_body['storeID'] = this.currentStore.StoreId;
		        	req_body['fflID'] = this.currentStore.StoreFFLId;
		        }
		        console.log("testinggg ::: " , JSON.stringify(req_body));
		        const url = constant.appcohesionURL.createStore_URL;
		        this.http
	            .post(url, JSON.stringify(req_body), options)
	            .subscribe(data => {
	                this.demoService.loading = false;
	                this.results = data ? data.json() : '';
	                if (this.results.status && this.results.status.code && this.results.status.code == constant.statusCode.success_code) {
	                	this.storeDetails().subscribe((response) => {
						},
							(err) => console.error(err)
						);
                    	//show success popup
                    	this.createStorePopup = true;
                    	this.successTitle = constant.distributor_markup_messages.success_title;
                    	// this.successDescription = constant.store_messages.success_description;
						this.successDescription = this.results.status.userMessage;
						this.showCreateStore = !this.showCreateStore;
	                } else if (this.results.status && this.results.status.code && this.results.status.code == constant.statusCode.error_code) {
	                    //show error popup
                    	this.createStorePopup = true;
                    	this.successTitle = constant.error_message.error_title;
                    	this.successDescription = this.results.status.userMessage;
	                } else {

	                }
	            }, error => {
	                this.demoService.loading = false;
	                console.log("error" + JSON.stringify(error));
	            });

		      }
		    }, (err) => {
		    console.log(err);
		});
  	}

  	popupclose() {
  		if(this.showViewStore == true)
  			this.showViewStore = false;
  		else if(this.showCreateStore == true)
  			this.showCreateStore = false;
  	}

	editStore(id,event) {
		this.showViewStore = false;
  		event.stopPropagation();
  		this.isEditClicked = true;
  		this.userInfo = {
	      "firstName": '',
	      "ffl": '',
	      "city": '',
	      "state": '',
	      "address": '',
	      "phone": '',
	      "fax": '',
	      "email": '',
	      "zip": '',
		  "ffldoc":''
		};

		if(this.results &&this.results.data){	    
  		for(var i = 0; i < this.results.data.length; i++) {
			if (this.results.data[i].StoreId == id) {
				this.currentStore = this.results.data[i];
				this.userInfo.firstName = this.results.data[i].StoreName && this.results.data[i].StoreName!='null' ? this.results.data[i].StoreName : '';
				this.userInfo.ffl = this.retailerStoreDetails[i].FFLNumber && this.results.data[i].FFLNumber!='null'? this.retailerStoreDetails[i].FFLNumber : '';
				this.userInfo.city = this.results.data[i].StoreLocation && this.results.data[i].StoreLocation!='null' ? this.results.data[i].StoreLocation : '';
				this.userInfo.address = this.results.data[i].StoreAddress && this.results.data[i].StoreAddress !='null' ? this.results.data[i].StoreAddress : '';
				this.userInfo.phone = this.results.data[i].StoreContact && this.results.data[i].StoreContact !='null' ? this.results.data[i].StoreContact : '';
				this.userInfo.fax = this.results.data[i].StoreFax && this.results.data[i].StoreFax !='null' ? this.results.data[i].StoreFax : '';
				this.userInfo.email = this.results.data[i].StoreEmail && this.results.data[i].StoreEmail !='null' ? this.results.data[i].StoreEmail : '';
				this.userInfo.state = this.results.data[i].StoreState && this.results.data[i].StoreState !='null'? this.results.data[i].StoreState : '';
				this.userInfo.zip = this.results.data[i].zip && this.results.data[i].zip!='null' ? this.results.data[i].zip : '';
			}
		}
	}
        this.showCreateStore = true;				
  	}

  	deleteConfirm() {
  		this.deleteStorePopup = !this.deleteStorePopup;
  		this.demoService.loading = true;
    	let headers = new Headers({
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({
            headers: headers
        });
        let req_body = {
			"StoreId": this.deleteStoreId
        };
        // "https://zee1widhd1.execute-api.us-east-1.amazonaws.com/staging";
        const url = constant.appcohesionURL.deleteStore_URL;
        this.http
        .post(url, JSON.stringify(req_body), options)
        .subscribe(data => {
            this.demoService.loading = false;
            this.results = data ? data.json() : '';
            if (this.results.status && this.results.status.code && this.results.status.code == constant.statusCode.success_code) {
            	this.storeDetails().subscribe((response) => {
				},
					(err) => console.error(err)
				);
            	//show delete confirm popup
            	this.createStorePopup = true;
    			this.successTitle = constant.distributor_markup_messages.success_title;
    			this.successDescription = this.results.status.userMessage;
            } else if (this.results.status && this.results.status.code && this.results.status.code == constant.statusCode.error_code) {
                //show error popup
            	this.createStorePopup = true;
            	this.successTitle = constant.error_message.error_title;
            	this.successDescription = this.results.status.userMessage;
            } else {

            }
        }, error => {
            this.demoService.loading = false;
            console.log("error" + JSON.stringify(error));
        });
  	}

  	deleteStore(id) {
  		this.showViewStore = false;
  		this.deleteStoreId = id;
  		this.deleteStorePopup = true;
        this.successDescription = constant.store_messages.delete_confirm_description;
  	}
}
