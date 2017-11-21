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
	addToCart(event, postMap) {
		event.stopPropagation();
		postMap.UserID= localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].user_id : "";
		postMap.retailerID= localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : "";
		postMap.quantity=postMap.quantity ? postMap.quantity: 1;		
		var reqBody={
			UserID: localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].user_id : "",
			retailerID: localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].user_id : "",
			quantity:postMap.quantity ? postMap.quantity: 1,
			GSIN:postMap.gsin ? postMap.gsin: "",
			distributorID:postMap.distributor_id ? postMap.distributor_id:"",
		}
		//this.searchProductService.addToCart(reqBody, this.commonService.getJwtToken()).subscribe((response) => {
			//this.returnResponse=response;
			//if(this.returnResponse && this.returnResponse.status.code == constant.statusCode.success_code) 
			//{
				this.cartBucket.length?this.checkAndIncrementquantity(postMap):this.cartBucket.push(postMap);
			//}
		//});
	}
	checkAndIncrementquantity(postMap){
		var index=this.isObjectInTheList(postMap,this.cartBucket);
		console.info(index);
		index < 0 ? this.cartBucket.push(postMap):this.cartBucket[index].quantity=this.cartBucket[index].quantity+1;
	}
	/**
	 * CHECH IF OBJECT IS CONTAINED IN LIST AND RETURN INDEX 
	 */

	isObjectInTheList(obj, list) {
		var itemIndex;
		list.forEach((element, index) => {
			itemIndex=element.gsin==obj.gsin ? index:-1;
		});
		return itemIndex;
	}


}
