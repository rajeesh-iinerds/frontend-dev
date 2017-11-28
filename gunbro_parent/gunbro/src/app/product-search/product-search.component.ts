import { Component, OnInit } from '@angular/core';
import { DashboardComponentComponent } from '../dashboard-component/dashboard-component.component';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { DemoService } from '../demo-component/demo.service';
import { SearchProductService } from '../product-search/search-product-service';
import { CommonService } from '../shared/common.service';

import *  as constant from "../shared/config"
@Component({
	selector: 'app-product-search',
	templateUrl: './product-search.component.html',
	styleUrls: ['./product-search.component.css']
})

export class ProductSearchComponent implements OnInit {
	details: any;
	resultssearch: any;
	cartBucket = [];
	returnResponse: any;
	cartItemIndex: any;
	constructor(public dashboardComponent: DashboardComponentComponent, private route: ActivatedRoute, private router: Router, public demoService: DemoService, public commonService: CommonService, public searchProductService: SearchProductService) {
		this.resultssearch = this.details;
		this.demoService.showRetailerProfile = false;
	}

	ngOnInit() {
		let paramVal = this.route.snapshot.queryParams["wildcard"] ? this.route.snapshot.queryParams["wildcard"] : this.route.snapshot.queryParams["gsin"] ? this.route.snapshot.queryParams["gsin"] : this.route.snapshot.queryParams["mpn"] ? this.route.snapshot.queryParams["mpn"] : "";
		let paramKey = this.route.snapshot.queryParams["wildcard"] ? "wildcard" : this.route.snapshot.queryParams["gsin"] ? "gsin" : this.route.snapshot.queryParams["mpn"] ? "mpn" : "";
		var self = this;
		if (paramVal)
			return this.demoService.getSessionToken().subscribe((response) => {
				if (response.getIdToken().getJwtToken()) {
					const jwt = response.getIdToken().getJwtToken();
					this.demoService.productSearchfromService("wildcard", paramVal, jwt, "");
					self.getCartList();
				}
			}, (err) => {
				console.log(err);
			});
	}

	productDetail(detail) {
		this.demoService.setProductDetails(detail);
		this.resultssearch = detail;
		console.log(this.resultssearch);
		this.router.navigate(['/dashboard/productdetail'], {
			queryParams: detail
		});
	}
	addToCartBucket(event, productItem, isAddToCart) {
		event.stopPropagation();
		this.demoService.getSessionToken().subscribe((response) => {
			if (response.getIdToken().getJwtToken()) {
				const jwt = response.getIdToken().getJwtToken();
				this.searchProductService.getCartList({ "user_id": localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].user_id : "" }, jwt).subscribe((response) => {
					this.cartBucket = response ? response.json().cartList : [];
					this.demoService.loading = false;
					console.log(parseInt(this.returnQuantity(productItem)) +"<"+parseInt(productItem.inStock));
					if(parseInt(this.returnQuantity(productItem))<parseInt(productItem.inStock)){
						this.dashboardComponent.addToCart(event, productItem, isAddToCart)	
					}
					
				});
			}
		});		
	}
	returnQuantity(cartMap) {
		var quantity;
		var index = this.isObjectInTheList(cartMap, this.cartBucket);
		quantity = index < 0 ? 0 : (this.cartBucket[index].quantity ? this.cartBucket[index].quantity : 0);
		return quantity;
	}

	isObjectInTheList(obj, list) {
		this.cartItemIndex = -1;
		for (var i = 0; i < list.length; i++) {
			if (parseInt(list[i].gsin) === parseInt(obj.gsin)) {
				this.cartItemIndex = i;
				break;
			} else {
				this.cartItemIndex = -1;
			}
		}
		return this.cartItemIndex;
	}
	getCartList() {
		this.demoService.getSessionToken().subscribe((response) => {
			if (response.getIdToken().getJwtToken()) {
				const jwt = response.getIdToken().getJwtToken();
				this.searchProductService.getCartList({ "user_id": localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].user_id : "" }, jwt).subscribe((response) => {
					this.cartBucket = response ? response.json().cartList : [];
					this.demoService.loading = false;
				});
			}
		});
	}

}