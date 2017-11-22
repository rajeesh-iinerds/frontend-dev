import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { DemoService } from '../demo-component/demo.service';
import * as constant from '../shared/config';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

	/*sizes: any[] = [
		{ 'size': '9999', 'diameter': '16000 km', 'id': 'id666' },
	    { 'size': '3333', 'diameter': '32000 km', 'id': 'id555' }
	];*/

	dummy: any[] = [
		{"name": "American Classic 1911 Amigo 45 ACP 3.5", "price": "129.00", "id": "101"},
		{"name": "Ruger", "price": "230.00", "id": "102"},
		{"name": "Hornady", "price": "112.00", "id": "103"},
		{"name": "Test", "price": "150.00", "id": "104"},
		{"name": "Dump", "price": "500.00", "id": "105"}
	];
	totalAmount: any;
	// list: any;
	count: number = 0;
	results: any;
	cartList: any;
	subtotal: number = 0;
	quantityCount: number = 0;
	cartObject = {
      "subtotal": 0,
      "ffl": '',
      "selectedQuantity": 0
    };

  	constructor(public demoService: DemoService , private http: Http) { }

  	ngOnInit() {
  		this.totalAmount = 0;
  		// for(var i = 0; i < this.dummy.length; i++) {
  		// 	this.totalAmount = this.totalAmount+Number(this.dummy[i].price);
  		// }
  		// this.list = this.dummy;
  		// this.count = this.dummy.length;

  		this.cartDetails().subscribe((response) => {
		},
		(err) => console.error(err)
		);
  	}

  	cartDetails(): Observable < any > {
	    return Observable.create(observer => {
	        return this.demoService.getSessionToken().subscribe((response) => {
	            if (response.getIdToken().getJwtToken()) {
	                const jwt = response.getIdToken().getJwtToken();
	                let headers = new Headers({ 'Authorization': jwt });
	                let options = new RequestOptions({ headers: headers });
	                let req_body = {
	                    "user_id": localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].user_id : ""
	                };
	                const url = "https://staging-api.appcohesion.io/cartListing";
	                this.http.post(url, req_body, options).subscribe(data => {
	                this.demoService.loading = false;
	                this.results = data.json();
	                if(this.results && this.results.status){
	                	if(this.results.status.code == constant.statusCode.success_code && this.results.cartList){
	                		this.cartList = this.results.cartList;
	                		this.count = this.cartList.length;
	                		for(var i = 0; i < this.cartList.length; i++) {
	                			this.cartObject = {
							    	"subtotal": 0,
							      	"ffl": '',
							      	"selectedQuantity": 0
							    };
					  			this.totalAmount = this.totalAmount+Number(this.cartList[i].msrp);
					  			this.cartObject['subtotal'] = Number(this.cartList[i].msrp);
					  			console.log('+++++++++++++', this.cartObject);
					  			this.cartList[i]['cartObject'] = this.cartObject;

					  			// this.cartList[i]['cartObject'].subtotal = Number(this.cartList[i].msrp);
					  			// this.subtotal = Number(this.cartList[i].msrp);
					  			this.quantityCount = this.quantityCount + Number(this.cartList[i].Quantity);
					  			this.cartObject['selectedQuantity'] = Number(this.cartList[i].Quantity);
					  			this.cartList[i]['cartObject'] = this.cartObject;
					  		}
					  		console.log('****************', this.cartList);
	                    }
	                    else if(this.results.status.code == constant.statusCode.empty_code){
	                    }
	                }
	                   observer.next();
	                   observer.complete();
	                });
	            }
	        });
	    }, err => {
	        console.log("error on order", err)
	    })
  	}


	checkAll(size, ev) {
  		// this.sizes.forEach(x => x.state = ev.target.checked)
  		console.log('******', ev);
  		console.log("itemmmmmmmmm", size);
  		var isChecked = ev.target.checked;
  		if (!isChecked) {
  			this.count--;
  			this.totalAmount = this.totalAmount-(Number(size.msrp) * Number(size.cartObject.selectedQuantity));
  			// this.quantityCount = this.quantityCount - 1;
  			this.quantityCount = this.quantityCount - Number(size.cartObject.selectedQuantity);
  		}
  		else {
  			this.count++;
  			this.totalAmount = this.totalAmount+(Number(size.msrp) * Number(size.cartObject.selectedQuantity));
  			// this.quantityCount = this.quantityCount + 1;
  			this.quantityCount = this.quantityCount + Number(size.cartObject.selectedQuantity);
  		}
	}

	/*isAllChecked() {
  		return this.sizes.every(_ => _.state);
	}*/

	removeFromCart(obj) {
		this.count--;
  		this.totalAmount = this.totalAmount-Number(obj.price);
		const index: number = this.dummy.indexOf(obj);
	    if (index !== -1) {
	        this.dummy.splice(index, 1);
	    }        
	}

	incrementQuantity(item) {
		if(item.inStock && item.inStock != item.Quantity) {
			item.Quantity = Number(item.Quantity) + 1;
			// this.subtotal = Number(item.msrp) * item.Quantity;
			item.cartObject.subtotal = Number(item.msrp) * item.Quantity;
			this.quantityCount = this.quantityCount + 1;
			this.totalAmount = this.totalAmount + Number(item.msrp);
			item.cartObject.selectedQuantity = item.cartObject.selectedQuantity + 1;
		}
	}
	decrementQuantity(item) {
		if(item.Quantity > '0') {
			item.Quantity = Number(item.Quantity) -1;
			// this.subtotal = Number(this.subtotal) - Number(item.msrp);
			item.cartObject.subtotal = Number(item.cartObject.subtotal) - Number(item.msrp);
			this.quantityCount = this.quantityCount - 1;
			this.totalAmount = this.totalAmount - Number(item.msrp);
		}
	}


}
