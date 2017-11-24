import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { DemoService } from '../../demo-component/demo.service';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx'; 
import 'rxjs/add/operator/map';
import { ShoppingCartService } from '../shopping-cart.service';
import * as constant from '../../shared/config';

@Component({
  selector: 'app-order-placement',
  templateUrl: './order-placement.component.html',
  styleUrls: ['./order-placement.component.css']
})
export class OrderPlacementComponent implements OnInit {
	cartInfo: any;
    orderCount: number = 0;
    amountPayable: number = 0;
    customerInfoMap:any={};
    results:any;
    storeListOfMaps:any;
    shippingInfoMap:any={}
    constructor(private http:Http,private demoService:DemoService,private route: ActivatedRoute,private router: Router, public cartService: ShoppingCartService) {
    }

    ngOnInit() {
        this.cartInfo = this.cartService.getCartInfo();
        for(var i = 0; i < this.cartInfo.length; i++) {
            this.orderCount = this.orderCount + Number(this.cartInfo[i].cartObject.selectedQuantity);
            this.amountPayable = this.amountPayable + Number(this.cartInfo[i].cartObject.subtotal);
        }

        this.demoService.getSessionToken().subscribe((response) => {
            if (response.getIdToken().getJwtToken()) {
              const jwt = response.getIdToken().getJwtToken();
              let headers = new Headers({ 'Authorization': jwt });
              let options = new RequestOptions({ headers: headers });
              let req_body = {
                "entityId": localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : ""
              };
              const url = constant.appcohesionURL.retailerStore_URL && constant.appcohesionURL.retailerStore_URL != 'null' ? constant.appcohesionURL.retailerStore_URL : '';
              this.http.post(url, req_body, options).subscribe(data => {
                this.results = data.json();
                if (this.results && this.results.status) {
                  if (this.results.status.code == 200) {
                    this.storeListOfMaps = this.results.data;
                    this.demoService.loading=false;
                  }
                }
              });
            }
          }, err => {
            console.log("error on order", err)
          })
    }
    customerInfoUpdate(customerInfoMap,customerInfoForm){
      console.info(customerInfoMap);
    }

}
