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
	returnResponse:any;

	constructor(public dashboardComponent: DashboardComponentComponent, private route: ActivatedRoute, private router: Router, public demoService: DemoService, public commonService: CommonService, public searchProductService: SearchProductService) {
		this.resultssearch = this.details;
		this.demoService.showRetailerProfile = false;
	}

	ngOnInit() {
		let paramVal = this.route.snapshot.queryParams["wildcard"] ? this.route.snapshot.queryParams["wildcard"] : this.route.snapshot.queryParams["gsin"] ? this.route.snapshot.queryParams["gsin"] : this.route.snapshot.queryParams["mpn"] ? this.route.snapshot.queryParams["mpn"] : "";
		let paramKey = this.route.snapshot.queryParams["wildcard"] ? "wildcard" : this.route.snapshot.queryParams["gsin"] ? "gsin" : this.route.snapshot.queryParams["mpn"] ? "mpn" : "";

		if (paramVal)
			return this.demoService.getSessionToken().subscribe((response) => {
				if (response.getIdToken().getJwtToken()) {
					const jwt = response.getIdToken().getJwtToken();
					this.demoService.productSearchfromService("wildcard", paramVal, jwt, "");
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
	addToCart(event, cartMaps) {
		event.stopPropagation();
		console.info(cartMaps);
		let cartMap = Object.assign({}, cartMaps);
		cartMap.UserID= localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].user_id : "";
		cartMap.retailerID= localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : "";
		cartMap.quantity=cartMap.quantity ? cartMap.quantity: 1;		
		var reqBody={
			UserID: localStorage.getItem("User_Information") ? parseInt(JSON.parse(localStorage.getItem("User_Information"))[0].user_id) : "",
			retailerID: localStorage.getItem("User_Information") ? parseInt(JSON.parse(localStorage.getItem("User_Information"))[0].user_id) : "",
			quantity:cartMap.quantity ? parseInt(cartMap.quantity): 1,
			GSIN:cartMap.gsin ? parseInt(cartMap.gsin): "",
			distributorID:cartMap.distributor_id ? parseInt(cartMap.distributor_id):"",
		}
		// this.commonService.getJwtToken().subscribe((response)=>{
		// 	this.searchProductService.addToCart(reqBody,response).subscribe((response)=>{
		// 		this.returnResponse=response;
		// 		this.returnResponse && this.returnResponse.status.code == constant.statusCode.success_code ? (this.cartBucket.length ? this.IncrementquantityOrPushItem(cartMap):this.cartBucket.push(cartMap)) : alert("Add to cart failed");
		// 	});

		// });
		this.cartBucket.length ? this.IncrementquantityOrPushItem(cartMap):this.cartBucket.push(cartMap)
	}
	IncrementquantityOrPushItem(cartMap){
		var index=this.isObjectInTheList(cartMap,this.cartBucket);
		console.info(index);
		index < 0 ? this.cartBucket.push(cartMap):this.cartBucket[index].quantity=this.cartBucket[index].quantity+1;
	}
	/**
	 * CHECK IF OBJECT IS CONTAINED IN LIST AND RETURN INDEX 
	 */

	isObjectInTheList(obj, list) {
		var itemIndex;
		list.forEach((element, index) => {
			itemIndex=element.gsin==obj.gsin ? index:-1;
		});
		return itemIndex;
	}
	decreaseQuantity(index){
		this.cartBucket[index].quantity>1?this.cartBucket[index].quantity=this.cartBucket[index].quantity-1:"";
	}
	increaseQuantity(index){		
		this.cartBucket[index].quantity?this.cartBucket[index].quantity=this.cartBucket[index].quantity+1:"";
	}

}