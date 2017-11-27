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
					this.demoService.getSessionToken().subscribe((response) => {
						if (response.getIdToken().getJwtToken()) {
							const jwt = response.getIdToken().getJwtToken();
							this.searchProductService.getCartList({ "user_id": localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].user_id : "" }, jwt).subscribe((response) => {
								self.cartBucket = response ? response.json().cartList : [];
								console.info(self.cartBucket);
							});
						}
					});
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
	/**
	 * 
	 * CART STARTS HERE
	 *  
	 */
	// getCartList() {
	// 	alert();
	// 	this.demoService.getSessionToken().subscribe((response) => {
	// 		if (response.getIdToken().getJwtToken()) {
	// 			const jwt = response.getIdToken().getJwtToken();
	// 			this.searchProductService.getCartList({ "user_id": localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].user_id : "" }, jwt).subscribe((response) => {
	// 				this.cartBucket = response ? response.json().cartList : [];
	// 				this.demoService.loading = false;
	// 			});
	// 		}
	// 	});
	// }

	// addToCart(event,cartObject,isAddToCart) {
	// 	alert();
	// 	event.stopPropagation();
	// 	let cartMap = Object.assign({}, cartObject);
	// 	cartMap.UserID = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].user_id : "";
	// 	cartMap.retailerID = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : "";
	// 	cartMap.gsin = "3217";
	// 	cartMap.quantity=isAddToCart?(this.returnQuantity(cartMap) ? parseInt(this.returnQuantity(cartMap)) + 1 : 1):(this.returnQuantity(cartMap) ? parseInt(this.returnQuantity(cartMap)):"");
	// 	let reqBody = {
	// 		UserID: localStorage.getItem("User_Information") ? parseInt(JSON.parse(localStorage.getItem("User_Information"))[0].user_id) : "",
	// 		retailerID: localStorage.getItem("User_Information") ? parseInt(JSON.parse(localStorage.getItem("User_Information"))[0].EntityId) : "",
	// 		quantity: cartMap.quantity,
	// 		GSIN: "3217",
	// 		//GSIN: cartMap.gsin||cartMap.GSIN ? cartMap.gsin ||cartMap.GSIN  : "",
	// 		distributorID: cartMap.distributor_id ? parseInt(cartMap.distributor_id) : "",
	// 	}
	// 	this.demoService.getSessionToken().subscribe((response) => {
	// 		if (response.getIdToken().getJwtToken()) {
	// 			const jwt = response.getIdToken().getJwtToken();
	// 			this.searchProductService.addToCart(reqBody, response).subscribe((response) => {
	// 				this.returnResponse = response.json();
	// 				this.returnResponse && this.returnResponse.status.code == constant.statusCode.success_code ?  this.getCartList()  : alert("Add to cart failed");		
	// 			});
	// 		}
	// 	});
	// }
	// returnQuantity(cartMap) {
	// 	alert();
	// 	var quantity;
	// 	var index = this.isObjectInTheList(cartMap, this.cartBucket);
	// 	quantity = index < 0 ? 0 : this.cartBucket[index].quantity;
	// 	return quantity;
	// }
	// isObjectInTheList(obj, list) {
	// 	alert();
	// 	var itemIndexz;
	// 	list.forEach((element, itemIndex) => {
	// 		if (parseInt(element.gsin) === parseInt(obj.gsin)) {
	// 			itemIndexz = itemIndex;
	// 		} else {
	// 			itemIndex = -1;
	// 		}
	// 	});
	// 	return itemIndexz;
	// }
	// decreaseQuantity(index) {
	// 	alert();
	// 	this.cartBucket[index].quantity > 1 ? this.cartBucket[index].quantity = parseInt(this.cartBucket[index].quantity) - 1 : "";
	// }
	// increaseQuantity(index) {
	// 	alert();
	// 	this.cartBucket[index].quantity ? this.cartBucket[index].quantity = parseInt(this.cartBucket[index].quantity) + 1 : "";
	// }


}