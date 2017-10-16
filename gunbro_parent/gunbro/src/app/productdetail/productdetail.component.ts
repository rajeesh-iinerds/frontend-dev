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
			"Phone": this.phone ? this.phone : ""
		};
		//this.demoService.confirmOrderfromService(this.orderInfo, jwt);

    return this.demoService.confirmOrderfromService(this.orderInfo, jwt).subscribe((resp) => {
      this.demoService.loading = false;
      console.log(resp);
      if(resp && resp.order && resp.order.orderId) {
        if(resp.order.distributor_id == 3) resp.order.distributor_name = 'ss';
        if(resp.order.distributor_id == 1) resp.order.distributor_name = 'ellet';
        var orderId = resp.order.orderId
         this.demoService.updateRecordinDB(orderId,"order_id").subscribe((csvresponse) => {
          console.log("updated db" + csvresponse);
        }, (err) => {
          console.log(err);
        });
      }
      var body_csv = {
        "response" : resp && resp.order ? resp.order :''
      }
       this.demoService.csvfileUpload(body_csv).subscribe((csvresponse) => {
        console.log( "CSV upload completed" + csvresponse );
      }, (err) => {
        console.log(err);
      });
    }, (err) => {
      console.log(err);
    });


		/*let headers = new Headers({'Content-Type': 'application/json', 'x-api-key': 'TxGFDgDFec7M6E94pgbLJ5duzkvWYEYJ2XQSMER0' });
	    let options = new RequestOptions({ headers: headers });
	    let req_body = {
			"Quandity": this.selectedQuantity,
			"ShippingMethod": this.selectedShipping,
			"ShipToStreetLine2": "ShipToStreetLine2",
			"ecomdashID": "ecomdashID",
			"BuyerType": "Retailer",
			"ShipToStreetLine1": this.address,
			"ShipToCity": this.city,
			"ConsumerName": this.firstName,
			"ProductPrice": this.amount,
			"FFL": this.ffl,
			"CustomerPrice": "123.35",
			"SellerType": "Distributor",
			"GSIN": this.demoService.productInfo && this.demoService.productInfo.gsin ? this.demoService.productInfo.gsin : '',
			"Custom4": "Custom4",
			"SKUNumber": this.demoService.productInfo && this.demoService.productInfo.skuNumber ? this.demoService.productInfo.skuNumber : '',
			"ShipToPostalCode": this.zipcode,
			"Custom3": "Custom3",
			"Custom2": "Custom2",
			"Custom1": "Custom1",
			"ShipToState": this.state,
			"BuyerID": "1",
			"Phone": this.phone,
			"SellerID": "1",
			"action": "processNewOrder"
		}

	    const url = 'https://api.appcohesion.io/placeOrder';
	    this.http
	        .post(url, req_body)
	        .subscribe(data => {

	            this.results = data.json();
	            alert(this.results);
	            console.log(this.results);
	        }, error => {
	            alert("Enterd err");
	            console.log(JSON.stringify(error));
	    });*/

	}

	submitForm(form: any): void{
	    console.log('Form Data: ');
	    console.log(form.form.valid);
	  }


}
