import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { DemoService } from '../demo-component/demo.service';
import * as constant from '../shared/config';

@Component({
  selector: 'app-distributor-markup',
  templateUrl: './distributor-markup.component.html',
  styleUrls: ['./distributor-markup.component.css']
})
export class DistributorMarkupComponent implements OnInit {

	public ac_email_forgot: any;
    public results_markup: any;
    jwt: any;
    distList: any;

	constructor(private http: Http, public demoService: DemoService, private router: Router) {
	}

	ngOnInit() {
  		this.demoService.getSessionToken().subscribe((response) => {
  	 		this.getDistributorsList(response);
  		});
  	}

  	getDistributorsList(resp) {
	  	this.demoService.loading = true;
	    if(resp.getIdToken().getJwtToken()) {
		    this.jwt = resp.getIdToken().getJwtToken();
		    let headers = new Headers({'Authorization': this.jwt });
	        let options = new RequestOptions({ headers: headers });
	        var  reqBody = {
	        	"retailerId": "1",
				"action": "getDistributorsList"
	        };

	        // const url = 'https://api.appcohesion.io/getDistList';
	        const url = constant.appcohesionURL.getDistributorsList_URL;
	        this.http
	            .post(url, reqBody, options)
	            .subscribe(data => {
	                this.demoService.loading = false;
	                this.results_markup = data ? data.json() : {};
	                console.log(this.results_markup.distributors);
	                if (this.results_markup && this.results_markup.status) {
	                    if (this.results_markup.status.code == constant.statusCode.success_code) {
	                    	this.distList = this.results_markup.distributors;
	                    } else {
	                    	console.log("Error");
	                    	alert(this.results_markup.status.message + " ! ");
	                    }
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

	getDistCategory (dist_id) {
		console.log(dist_id);
		var param = {};
		param['dist_id'] = dist_id;
        var reqBody = param;
		// this.router.navigate(['/dashboard/markup/dist-category'],{ queryParams: reqBody});
		this.router.navigate(['/dashboard/dist-category'],{ queryParams: reqBody});
	}
}
