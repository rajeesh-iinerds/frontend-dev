import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import * as constant from '../shared/config';
import { DemoService } from '../demo-component/demo.service';
@Injectable()
export class SearchProductService {
    results: any;
    constructor(private http: Http, private demoService: DemoService) { }

    addToCart(reqBody,jwt):Observable<Response>{
       var self = this;
       let headers = new Headers({'Authorization': jwt});
       let options = new RequestOptions({headers: headers});
       const url = constant.appcohesionURL.addToCart_URL;
       return this.http.post(url, JSON.stringify(reqBody),options)
        .map((res)=>res);
      }
      getCartList(reqBody,jwt):Observable<Response>{
        var self = this;
        let headers = new Headers({'Authorization': jwt});
        let options = new RequestOptions({headers: headers});
        const url = constant.appcohesionURL.cartListing_URL;
        return this.http.post(url, JSON.stringify(reqBody),options)
         .map((res)=>res);
       }

}
