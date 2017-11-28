import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import { JwtHelper } from 'angular2-jwt/angular2-jwt';
import { DemoService } from '../demo-component/demo.service';
import { Params, ActivatedRoute, RouterModule, Router } from '@angular/router';
import {Directive, OnDestroy, Output, EventEmitter} from '@angular/core';
import * as constant from '../shared/config';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {
  orderDetails: any;
  results: any;
  selectedOrder : any;
  showOrderDetails : boolean = false;
  userGroup: any;
  configSuperAdminUser: any;
  configAdminUser: any;
  retailerAdminUser: any;
  selectedRetailer:  any;
  retailerIdPass: any ;
  userDetails: any;
  body: Object = {};
  retailer_id : any;
  path: any;
  orderslistCount: any;
  orderProductDetails: any;


  constructor(private route: ActivatedRoute,public demoService: DemoService, private http: Http, private router: Router) {
    this.demoService.showRetailerProfile = false;
   
  }

  ngOnInit() {
    this.userGroup = localStorage.getItem('userGroup') && localStorage.getItem('userGroup') != 'null' ? localStorage.getItem('userGroup') : '';
    this.configSuperAdminUser = constant.user.superadminUser && constant.user.superadminUser != 'null' ? constant.user.superadminUser : '';
    this.configAdminUser = constant.user.userGroup && constant.user.userGroup != 'null' ? constant.user.userGroup : '';
    this.retailerAdminUser = constant.user.retaileradminUser && constant.user.retaileradminUser != 'null' ? constant.user.retaileradminUser : '';
    this.path = constant.orderRoute.flag && constant.orderRoute.flag != 'null' ? constant.orderRoute.flag  : '';
    this.route.queryParams.subscribe((params: Params) => {
      this.listOrders(params.retailer_id,this.path).subscribe((response) => {
        this.selectedRetailer = params.retailer_id;
     },
    (err) => console.error(err)
  );
    });
    
    this.demoService.listRetailorDetails(); 
    this.userDetails = {};
    this.userDetails.first_name = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).first_name : "";
    this.userDetails.last_name = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).last_name : "";
  }

  

  // Method for getting retailer details from retailer drop down
  getRetailerId(event,selectedRetailer){
    this.listOrders(selectedRetailer,this.path).subscribe((response) => {
        console.log("list order response : " + JSON.stringify(response))
        this.route.queryParams.subscribe((params: Params) => {
            this.retailer_id = selectedRetailer;
        });
    },
    (err) => console.error(err)
   );
 }

  // Method for listing Order list
  listOrders(retailerId, path): Observable < any > {
    return Observable.create(observer => {
          return this.demoService.getSessionToken().subscribe((response) => {
              if (response.getIdToken().getJwtToken()) {
                  const jwt = response.getIdToken().getJwtToken();
                  let headers = new Headers({ 'Authorization': jwt });
                  let options = new RequestOptions({ headers: headers });
                  var store_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].store_id:"";
                  var retailer_idUsers = localStorage.getItem("User_Information")?JSON.parse(localStorage.getItem("User_Information"))[0].entity_type == "Retailer" ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId:"":"";
                  this.retailer_id =  (this.userGroup == this.configSuperAdminUser) ? (retailerId == 'All' ? '' : retailerId) : retailer_idUsers;
                  var reqBody=this.retailer_id ?{retailer_id: this.retailer_id}:reqBody={};
                  const url = constant.appcohesionURL.orderList_URL && constant.appcohesionURL.orderList_URL != 'null' ? constant.appcohesionURL.orderList_URL : '';
                  this.http.post(url, reqBody, options).subscribe(data => {
                  this.demoService.loading = false;
                  this.results = data ? data.json() :"";
                  if(this.results && this.results.status){    
                        if (this.results.status.code == constant.statusCode.success_code) {                           
                          this.orderDetails = Object.keys(this.results.data[0]).length ? this.results.data : "";
                          this.orderslistCount = this.orderDetails.length ? this.orderDetails.length : "";
                        } else if (this.results.status.code == constant.statusCode.empty_code) {
                          this.orderDetails = [];                   
                          }
                      
                          if(path && path != '') {
                            this.router.navigate(['/dashboard/order'], {
                                queryParams: reqBody
                              });
                          }
                         observer.next(this.orderDetails);
                         observer.complete();
                      }
                    else{
                        observer.next(this.orderDetails);
                        observer.complete();
                    }                       
                  });
              }
          });
      }, err => {
          console.log("error on order", err)
      })
   }

  
// Method for viewing order details by clicking view button
   viewOrderDetails(orderID: any,event){
     event.stopPropagation()
     this.showOrderDetails = !this.showOrderDetails;
     this.selectedOrder = {};
     this.orderProductDetails = [];
 
    for(var i = 0; i < this.orderDetails.length; i++){
        if(this.orderDetails[i].OrderID == orderID){
          this.orderProductDetails = this.orderDetails[i].orderDetails ? this.orderDetails[i].orderDetails : "";
          this.selectedOrder.OrderID = this.orderDetails[i].OrderID ? this.orderDetails[i].OrderID: '';
          this.selectedOrder.OrderPlacedDate = this.orderDetails[i].OrderPlacedDate ? this.orderDetails[i].OrderPlacedDate : '';
          this.selectedOrder.CostumerName = this.orderDetails[i].CostumerName && this.orderDetails[i].CostumerName !='null' ? this.orderDetails[i].CostumerName : '';
          this.selectedOrder.email = this.orderDetails[i].CustomerEmail && this.orderDetails[i].CustomerEmail !='null' ? this.orderDetails[i].CustomerEmail : '';
          this.selectedOrder.Phone = this.orderDetails[i].CustomerPhone ? this.orderDetails[i].CustomerPhone : '';
          this.selectedOrder.tracking = this.orderDetails[i].TrackingNumber ? this.orderDetails[i].TrackingNumber : '';
          this.selectedOrder.address = this.orderDetails[i].StoreAddress ? this.orderDetails[i].StoreAddress : "";
          this.selectedOrder.ShipToCity = this.orderDetails[i].StoreCity ? this.orderDetails[i].StoreCity : "" ;
          this.selectedOrder.StoreZip = this.orderDetails[i].StoreZip ? this.orderDetails[i].StoreZip : "";
          this.selectedOrder.FFL =  this.orderDetails[i].FFL ? this.orderDetails[i].FFL : '';
          this.selectedOrder.orderPrice = this.orderDetails[i].OrderPrice && this.orderDetails[i].OrderPrice !='null' ? this.orderDetails[i].OrderPrice : "";
        }
     }
   }

// Closing Order list
   closeOrderList(){
    this.showOrderDetails = !this.showOrderDetails;
   }

}