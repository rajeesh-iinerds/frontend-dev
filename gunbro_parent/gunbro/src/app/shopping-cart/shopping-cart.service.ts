import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { DemoService } from './../demo-component/demo.service';
import * as constant from './../shared/config';

@Injectable()
export class ShoppingCartService {
	cartInfo: any;
	results: any;

  	constructor(public demoService:DemoService, private http:Http) { }

  	/* Set Cart info */
	setCartInfo(cartInfo) {
		this.cartInfo = cartInfo;
  	}

  	/* Get Cart info */
  	getCartInfo() {
  		return this.cartInfo;
  	}

  	/* Place order from shopping cart */
  	placeOrder(orderInfo, jwt) {
  		this.demoService.loading = true;
        return Observable.create(observer => {
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': jwt
            });
            let options = new RequestOptions({
                headers: headers
            });
            console.log("product info" + orderInfo);
            let req_body = orderInfo;
            const url = constant.appcohesionURL.placeOrder_URL;
            this.http
            .post(url, req_body, options)
            .subscribe(data => {
                this.demoService.loading = false;
                this.results = data ? data.json() : '';
                if (this.results) {
                    if (this.results.status.code == constant.statusCode.success_code) {
                    	console.log('successss', this.results);
                      	observer.next(this.results);
                        observer.complete();
                    } else {
                        observer.next(this.results);
                        observer.complete();
                    }
                    console.log(this.results);
                } else {
                    alert("Result is empty");
                }
            }, error => {
                this.demoService.loading = false;
                observer.next(error);
                observer.complete();
                console.log(JSON.stringify(error));
            });
        }, (err) => {
            console.log('Error');
        });	
  	}

}
