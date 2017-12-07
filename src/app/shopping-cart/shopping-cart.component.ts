import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Location } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { DemoService } from '../demo-component/demo.service';
import * as constant from '../shared/config';
import { CommonService } from '../shared/common.service';
import { ShoppingCartService } from './shopping-cart.service';
import { DashboardComponentComponent } from '../dashboard-component/dashboard-component.component'

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

	totalAmount: any;
	count: number = 0;
	results: any;
	cartList: any;
	subtotal: number = 0;
	quantityCount: number = 0;
	cartObject = {
      "subtotal": 0,
      "selectedQuantity": 0,
      "makeChecked": true
    };
    cartInStockList: any;
    tempList: any;
    hideQuantity: boolean = false;

  	constructor(public demoService: DemoService , private http: Http, 
  		public commonService: CommonService, private location: Location,
  		private route: ActivatedRoute, private router: Router,
  		public cartService: ShoppingCartService,
  		public dashboardComponent: DashboardComponentComponent) {
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
	                const url = constant.appcohesionURL.getCartList_URL;
	                this.http.post(url, req_body, options).subscribe(data => {
	                	this.demoService.loading = false;
	                	this.results = data.json();
	                	if(this.results && this.results.status){
	                		if(this.results.status.code == constant.statusCode.success_code && this.results.cartList){
		                		this.cartList = this.results.cartList;
		                		this.cartInStockList = [];
		                		this.tempList = [];
		                		if(this.cartList) {
			                		for(var i = 0; i < this.cartList.length; i++) {
			                			this.cartObject = {
									    	"subtotal": 0,
									      	"selectedQuantity": 0,
									      	"makeChecked": true
									    };
							  			this.totalAmount = this.cartList[i].inStock > 0 ? (this.totalAmount+(Number(this.cartList[i].quantity ? this.cartList[i].quantity : 0) * Number(this.cartList[i].productPrice ? this.cartList[i].productPrice : 0))) : this.totalAmount;
							  			this.cartObject['subtotal'] = Number(this.cartList[i].quantity ? this.cartList[i].quantity : 0) * Number(this.cartList[i].productPrice ? this.cartList[i].productPrice : 0);
							  			// console.log('+++++++++++++', this.cartObject);
							  			this.cartList[i]['cartObject'] = this.cartObject;
							  			this.quantityCount = this.cartList[i].inStock > 0 ? (this.quantityCount + Number(this.cartList[i].quantity)) : this.quantityCount;
							  			this.cartObject['selectedQuantity'] = Number(this.cartList[i].quantity);
							  			this.cartList[i]['cartObject'] = this.cartObject;
							  			this.cartObject['makeChecked'] = true;
							  			this.cartList[i]['cartObject'] = this.cartObject;
								  		this.count = this.cartList[i].inStock > 0 ? (this.count+1) : this.count;
								  		if(this.cartList[i].inStock > 0){
								  			this.cartInStockList.push(this.cartList[i]);
								  			this.tempList.push(this.cartList[i]);
								  		}
							  		}
							  	}
						  		// console.log('****************', this.cartList);
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
  		console.log("itemmmmmmmmm", size);
  		var isChecked = ev.target.checked;
  		if (!isChecked) {
  			this.hideQuantity = true;
  			this.count--;
  			this.totalAmount = this.totalAmount-(Number(size.productPrice) * Number(size.cartObject.selectedQuantity));
  			this.quantityCount = this.quantityCount - Number(size.cartObject.selectedQuantity);
  			/* Remove from place order array if unchecked */
  			if(this.cartInStockList) {
	  			for(var i = 0; i < this.cartInStockList.length; i++) {
	  				if(ev.target.id == size.CartItemID) {
	  					const index: number = this.cartInStockList.indexOf(size);
					    if (index !== -1) {
					        this.cartInStockList.splice(index, 1);
					    }
	  				}
	  			}
	  		}
  		}
  		else {
  			this.hideQuantity = false;
  			this.count++;
  			this.totalAmount = this.totalAmount+(Number(size.productPrice) * Number(size.cartObject.selectedQuantity));
  			this.quantityCount = this.quantityCount + Number(size.cartObject.selectedQuantity);
	  		if(this.tempList) {
	  			for(var j = 0; j < this.tempList.length; j++) {
					if(ev.target.id == size.CartItemID) {
	  					const index: number = this.tempList.indexOf(size);
	  					const ind: number = this.cartInStockList.indexOf(size);
					    // if (ind !== -1 && index !== -1) {
					        // this.cartInStockList.push(size);
					    // }
					    if(ind == -1 && index !== -1) {
					    	this.cartInStockList.push(size);
					    }
	  				}
	  			}
	  		}
  		}
	}

	/*isAllChecked() {
  		return this.sizes.every(_ => _.state);
	}*/

	removeFromCart(obj) {
		// TODO confirm popup for remove cart
		console.log('insideee deleteeeeeeee');
		this.demoService.loading = true;
		this.demoService.getSessionToken().subscribe((response) => {
			if (response.getIdToken().getJwtToken()) {
			const jwt = response.getIdToken().getJwtToken();
            let headers = new Headers({ 'Authorization': jwt });
            let options = new RequestOptions({ headers: headers });
            let req_body = {
                "CartItemId": obj.CartItemID
            };
            const url = constant.appcohesionURL.deleteCart_URL;
            this.http.post(url, req_body, options).subscribe(data => {
            	console.log('insideee delete api');
            	this.demoService.loading = false;
            	this.results = data.json();
            	if(this.results && this.results.status){
            		if(this.results.status.code == constant.statusCode.success_code){
            			// Quantity & total change only if deleted item has inStock available
            			if(obj.inStock > 0) {
            				this.count--;
            				this.totalAmount = this.totalAmount-(Number(obj.productPrice) * Number(obj.cartObject.selectedQuantity));
            				this.quantityCount = this.quantityCount - Number(obj.cartObject.selectedQuantity);
            			}
            			const index: number = this.cartList.indexOf(obj);
					    if (index !== -1) {
					        this.cartList.splice(index, 1);
					    }
					    this.dashboardComponent.cartBucket = this.cartList;
					    /*const index: number = this.cartInStockList.indexOf(obj);
					    if (index !== -1) {
					        this.cartInStockList.splice(index, 1);
					        this.cartDetails().subscribe((response) => {
							},
							(err) => console.error(err)
							);
					    }*/
					    if(this.cartInStockList) {
						    for(var j = 0; j < this.cartInStockList.length; j++) {
								if(this.cartInStockList[j].CartItemID == obj.CartItemID) {
				  					const index: number = this.cartInStockList.indexOf(obj);
								    if (index !== -1) {
								        this.cartInStockList.splice(index, 1);
								    }
				  				}
				  			}
				  		}
                    }
                    else if(this.results.status.code == constant.statusCode.empty_code){

                    }
                }               	
            });
        }

		});
	}

	incrementQuantity(item) {
		if(item.inStock && item.inStock != item.quantity) {
			item.quantity = Number(item.quantity) + 1;
			item.cartObject.subtotal = Number(item.productPrice) * item.quantity;
			this.quantityCount = this.quantityCount + 1;
			this.totalAmount = this.totalAmount + Number(item.productPrice);
			item.cartObject.selectedQuantity = item.cartObject.selectedQuantity + 1;
		}
	}
	decrementQuantity(item) {
		if(item.quantity > '1') {
			item.quantity = Number(item.quantity) -1;
			item.cartObject.subtotal = Number(item.cartObject.subtotal) - Number(item.productPrice);
			this.quantityCount = this.quantityCount - 1;
			this.totalAmount = this.totalAmount - Number(item.productPrice);
			item.cartObject.selectedQuantity = item.cartObject.selectedQuantity - 1;
		}
	}
	backClicked() {
    	this.location.back();
    }
    navigateToCheckoutPage() {
    	this.router.navigate(['/dashboard/place-order']);
    }
}
