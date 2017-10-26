import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router} from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { DemoService } from '../demo-component/demo.service';
import * as constant from '../shared/config';

@Component({
  selector: 'app-distributor-category',
  templateUrl: './distributor-category.component.html',
  styleUrls: ['./distributor-category.component.css']
})
export class DistributorCategoryComponent implements OnInit {

	distributor_id: string;
	category: any;
	temp: {
		"categoryId": ''
	};
	jwt: any;
	markupValue: string;
	res: any;
	updateMarkupPopup: boolean = false;

  	constructor(private route: ActivatedRoute, private router: Router, public demoService: DemoService, private http: Http) {
  	}

	ngOnInit() {
	  	this.route.queryParams.subscribe((params: Params) => {
	        this.distributor_id = params['dist_id'];
	        console.log('id:: ', this.distributor_id);
	        this.demoService.getSessionToken().subscribe((response) => {
	  	 		this.getDistributorCategoryList(response, this.distributor_id);
	  		});
	    });
  	}

  	getDistributorCategoryList(response, dist_id) {
  		this.demoService.loading = true;
  		if(response.getIdToken().getJwtToken()) {
  			this.jwt = response.getIdToken().getJwtToken();
		    let headers = new Headers({'Authorization': this.jwt });
	        let options = new RequestOptions({ headers: headers });
	        var  reqBody = {
	        	"distributorId": dist_id,
	        	"retailerId": "1",
				"action": "getMarkupForDistributor"
	        };

	        const url = 'https://api.appcohesion.io/getMarkup';
	        this.http
	            .post(url, reqBody, options)
	            .subscribe(data => {
	                this.demoService.loading = false;
	                this.category = data ? data.json() : {};
	                console.log(this.category);
	                if (this.category && this.category.status) {
	                    if (this.category.status.code == constant.statusCode.success_code) {
	                    	console.log('Success');
	                    } else if (this.category.status.code == constant.statusCode.empty_code) {
	                    	console.log("Error");
	                    }
	                    //this.router.navigate(['/dashboard/search'],{ queryParams: reqBody});
	                }

	            }, error => {
	                this.demoService.loading = false;
	                console.log(JSON.stringify(error));
	            });
  		}
  		else {
  			console.log("Missing Token");
  		}
  	}

  	addMarkup(category) {
  		this.temp = category;
  		// this.markupValue = category.markup && category.markup > 0 ? category.markup : '';
  		this.markupValue = category.markup;
  	}

  	cancelMarkup(category) {
  		this.temp = {
			"categoryId": ''
		};
  	}

  	updateMarkup(value) {
  		let currentCategory = this.temp;
  		this.demoService.loading = true;
  		if(this.jwt) {
  			let headers = new Headers({'Authorization': this.jwt });
	        let options = new RequestOptions({ headers: headers });
	        var  reqBody = {
	        	"distributorId": this.distributor_id,
	        	"retailerId": "1",
				"action": "updateMarkup",
				"markup": value,
				"categoryId": this.temp.categoryId
	        };

	        const url = 'https://api.appcohesion.io/setMarkup';
	        this.http
	            .post(url, reqBody, options)
	            .subscribe(data => {
	                this.demoService.loading = false;
	                this.res = data ? data.json() : {};
	                console.log(this.res);
	                if (this.res && this.res.status) {
	                    if (this.res.status.code == constant.statusCode.success_code) {
	                    	// show popup & navigate to Dashboard
	                    	this.updateMarkupPopup = true;
	                    } else {
	                    	alert(this.res.Error.message + " ! ");
	                    }
	                }
	            }, error => {
	                this.demoService.loading = false;
	                console.log(JSON.stringify(error));
	            });
  		}
  	}
}
