import { Component, OnInit, Input } from '@angular/core';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { DemoService } from '../demo-component/demo.service';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit {
@Input() resultssearch;
results: any;
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

  	constructor(public searchComponent: ProductSearchComponent, public demoService: DemoService, private http:Http) {
		this.selectedQuantity = 1;
		this.ffl = "5-76-339-07-6M-02775";
		this.amount = demoService.productInfo && demoService.productInfo.productPrice ? demoService.productInfo.productPrice : '';
		this.temp = this.amount;
	}

	ngOnInit() {
    this.demoService.showPopup = false;
  }

 	placeOrder() {
 		this.demoService.showclickorder = true;
 		console.log(this.selectedQuantity, this.selectedShipping);
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
			"delivery_instructions": this.delivery ? this.delivery : ""
			
		};
		//this.demoService.confirmOrderfromService(this.orderInfo, jwt);

    return this.demoService.confirmOrderfromService(this.orderInfo, jwt).subscribe((resp) => {
			
			this.demoService.loading = false;
			if(resp && resp.results) {
				     
							
      
      if(resp && resp.data[0] && resp.data[0].orderId) {
        resp.data[0].distributor_name = (resp.data[0].distributor_name)? (resp.data[0].distributor_name).toLowerCase():"";
        
        var orderId = resp.data[0].orderId
         this.demoService.updateRecordinDB(orderId,"order_id").subscribe((csvresponse) => {
          console.log("updated db" + csvresponse);
        }, (err) => {
          console.log(err);
        });
      }
      var body_csv = {
        "response" : resp && resp.data[0] ? resp.data[0] :''
			}	
       this.demoService.csvfileUpload(body_csv).subscribe((csvresponse) => {
        console.log("CSV upload completed" + csvresponse );
      }, (err) => {
        console.log(err);
			});

		}
		else{
			if(resp && resp.status){
          var statusApiIntegration = resp.status == "success" ? "Success from SSAPI" : "Failure in SSAPI";
			    alert(statusApiIntegration);
				}
		}
			
    }, (err) => {
      console.log(err);
		});
	}

	submitForm(form: any): void{
	    console.log('Form Data: ');
	    console.log(form.form.valid);
	  }


}
