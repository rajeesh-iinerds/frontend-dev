import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Location } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { DemoService } from '../demo-component/demo.service';
import * as constant from '../shared/config';
import { CommonService } from '../shared/common.service';
import { ShoppingCartService } from './shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

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
      "selectedQuantity": 0
    };
    cartInStockList: any;

  	constructor(public demoService: DemoService , private http: Http, public commonService: CommonService, private location: Location,private route: ActivatedRoute, private router: Router, public cartService: ShoppingCartService) {
  	}

  	ngOnInit() {
  		this.totalAmount = 0;
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
	                const url = constant.appcohesionURL.getCartList_URL;//"https://staging-api.appcohesion.io/cartListing";
	                this.http.post(url, req_body, options).subscribe(data => {
	                	this.demoService.loading = false;
	                	this.results = data.json();
	                	if(this.results && this.results.status){
	                		if(this.results.status.code == constant.statusCode.success_code && this.results.cartList){
		                		this.cartList = this.results.cartList;
		                		this.cartInStockList = [];
		                		// this.count = this.cartList.length;
		                		for(var i = 0; i < this.cartList.length; i++) {
		                			// if(this.cartList[i].inStock > 0) {
			                			this.cartObject = {
									    	"subtotal": 0,
									      	"selectedQuantity": 0
									    };
							  			this.totalAmount = this.cartList[i].inStock > 0 ? (this.totalAmount+(Number(this.cartList[i].Quantity) * Number(this.cartList[i].msrp))) : 0;
							  			this.cartObject['subtotal'] = Number(this.cartList[i].Quantity) * Number(this.cartList[i].msrp);
							  			console.log('+++++++++++++', this.cartObject);
							  			this.cartList[i]['cartObject'] = this.cartObject;

							  			// this.cartList[i]['cartObject'].subtotal = Number(this.cartList[i].msrp);
							  			// this.subtotal = Number(this.cartList[i].msrp);
							  			this.quantityCount = this.cartList[i].inStock > 0 ? (this.quantityCount + Number(this.cartList[i].Quantity)) : 0;
							  			this.cartObject['selectedQuantity'] = Number(this.cartList[i].Quantity);
							  			this.cartList[i]['cartObject'] = this.cartObject;
							  		// }
							  		this.count = this.cartList[i].inStock > 0 ? (this.count+1) : 0;
							  		if(this.cartList[i].inStock > 0)
							  			this.cartInStockList.push(this.cartList[i]);
						  		}
						  		console.log('****************', this.cartList);
						  		this.cartService.setCartInfo(this.cartInStockList);
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
		// TODO confirm popup for remove cart
		this.commonService.getJwtToken().subscribe((response)=>{
			const jwt = response;
            let headers = new Headers({ 'Authorization': jwt });
            let options = new RequestOptions({ headers: headers });
            let req_body = {
                "CartItemId": obj.CartItemID
            };
            const url = constant.appcohesionURL.deleteCart_URL; //"https://staging-api.appcohesion.io/deleteItem";
            this.http.post(url, req_body, options).subscribe(data => {
            	this.demoService.loading = false;
            	this.results = data.json();
            	if(this.results && this.results.status){
            		if(this.results.status.code == constant.statusCode.success_code){
            			this.count--;
            			this.totalAmount = this.totalAmount-(Number(obj.msrp) * Number(obj.cartObject.selectedQuantity));
            			this.quantityCount = this.quantityCount - Number(obj.cartObject.selectedQuantity);
            			const index: number = this.cartList.indexOf(obj);
					    if (index !== -1) {
					        this.cartList.splice(index, 1);
					    }
                    }
                    else if(this.results.status.code == constant.statusCode.empty_code){

                    }
                }               	
            });

		});

		// this.count--;
  		// this.totalAmount = this.totalAmount-Number(obj.price);
		/*const index: number = this.dummy.indexOf(obj);
	    if (index !== -1) {
	        this.dummy.splice(index, 1);
	    }*/
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
		if(item.Quantity > '1') {
			item.Quantity = Number(item.Quantity) -1;
			// this.subtotal = Number(this.subtotal) - Number(item.msrp);
			item.cartObject.subtotal = Number(item.cartObject.subtotal) - Number(item.msrp);
			this.quantityCount = this.quantityCount - 1;
			this.totalAmount = this.totalAmount - Number(item.msrp);
		}
	}
	backClicked() {
    	this.location.back();
    }
    navigateToOrder() {
    	this.router.navigate(['/dashboard/place-order'], {
			queryParams: this.cartList
		});
    }

}
