import { Injectable } from '@angular/core';
import { Http,Headers,Response,RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import * as constant from '../shared/config';
import {DemoService} from '../demo-component/demo.service';
@Injectable()
export class SearchProductService {
  results:any;
  constructor(private http: Http,private demoService:DemoService) { }
  addToCart(name, password, jwt): Observable < any > {
    this.demoService.loading = true;
    return Observable.create(observer => {
        var self = this;
        var reqBodys = {
            userName: name,
            password: password
        };
        let headers = new Headers({
            'Authorization': jwt
        });
        let options = new RequestOptions({
            headers: headers
        });
        const url = constant.appcohesionURL.userDetails_URL;
        this.http
            .post(url, reqBodys, options)
            .subscribe(data => {
                this.demoService.loading = false;
                this.results = data ? data.json() : {};
                if (this.results && this.results.status) {
                   
                    observer.next(this.results);
                    observer.complete();
                }
            }, error => {
                this.demoService.loading = false;
                console.log(JSON.stringify(error));
                observer.next(error);
                observer.complete();
            });
    }, err => {

        console.log("error on user", err)
    })
};

}
