import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx'; 
import 'rxjs/add/operator/map';
import {MessagePopupComponent} from '../../shared/component/message-popup/message-popup.component'
import { DemoService } from '../../demo-component/demo.service';
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
    shippingInfoMap:any = {};
    jwt: any;
    customerInfoUpdateMap:any={};
    customerInfoForm:any;
    isSideBarCustomerInfo:boolean=false;
    isSideBarShippingInfo:boolean=false;
    showSuccessPopup:boolean=false;
    showErrorPopup:boolean=false;
    allStoreList: any;

    constructor(private MessagePopupComponent:MessagePopupComponent,private http:Http,private demoService:DemoService,private route: ActivatedRoute,private router: Router, public cartService: ShoppingCartService) {
    }

    ngOnInit() {
        this.shippingInfoMap.isFFLRequired = false;
        this.cartInfo = this.cartService.getCartInfo();
        console.log('****** :: ', this.cartInfo);
        for(var i = 0; i < this.cartInfo.length; i++) {
            this.orderCount = this.orderCount + Number(this.cartInfo[i].cartObject.selectedQuantity);
            this.amountPayable = this.amountPayable + Number(this.cartInfo[i].cartObject.subtotal);
        }
        this.customerInfoUpdateMap.firstName="";
        this.customerInfoUpdateMap.lastName="";
        this.demoService.getSessionToken().subscribe((response) => {
            if (response.getIdToken().getJwtToken()) {
              const jwt = response.getIdToken().getJwtToken();
              this.jwt = jwt;
              let headers = new Headers({ 'Authorization': jwt });
              let options = new RequestOptions({ headers: headers });
              let req_body = {
                "entityId": localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : ""              };
              const url = constant.appcohesionURL.retailerStore_URL && constant.appcohesionURL.retailerStore_URL != 'null' ? constant.appcohesionURL.retailerStore_URL : '';
              this.http.post(url, req_body, options).subscribe(data => {
                this.results = data.json();
                if (this.results && this.results.status) {
                  if (this.results.status.code == 200) {
                    this.storeListOfMaps = this.results.data;
                    this.allStoreList = this.results.data;
                    this.demoService.loading=false;
                  }
                }
              });
            }
          }, err => {
            console.log("error on order", err)
          })
          this.shippingInfoMap.retailerName=localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityName : "";
          this.shippingInfoMap.saleAssociate=localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).first_name : "" + " "+localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).last_name : ""
    }
    customerInfoUpdate(customerInfoMap,customerInfoForm){
      this.customerInfoUpdateMap=Object.assign({}, customerInfoMap);
      this.isSideBarCustomerInfo=true;
    }

    placeOrder(shippingInfoForm,customerInfoForm) {
        console.log('cust', this.customerInfoMap);
        console.log('ship', this.shippingInfoMap);
        console.log('cart', this.cartInfo);
        let commonBody = {
            "storeId": this.shippingInfoMap.selectedStore ? this.shippingInfoMap.selectedStore: "NULL",
            "ShippingMethod": this.shippingInfoMap.selectedShipping ? this.shippingInfoMap.selectedShipping: "NULL",
            "ShipToStreetLine1": this.customerInfoMap.streetAddress ? JSON.stringify(this.customerInfoMap.streetAddress) : "NULL",
            "ShipToStreetLine2":"ShipToStreetLine2",
            "ShipToCity": this.customerInfoMap.city ? this.customerInfoMap.city : "NULL",
            "BuyerType":"Retailer",
            "ConsumerName": this.customerInfoMap.firstName ? this.customerInfoMap.firstName : "NULL",
            "Custom1":"Custom1",
            "Custom2":"Custom2",
            "Custom3":"Custom3",
            "Custom4":"Custom4",
            "ShipToPostalCode": this.customerInfoMap.zip ? this.customerInfoMap.zip : "NULL",
            "ShipToState": this.customerInfoMap.state ? this.customerInfoMap.state : "NULL",
            "Phone": this.customerInfoMap.phoneNumber ? this.customerInfoMap.phoneNumber : "NULL",
            "FFL":"FFLLicense",
            "email": this.customerInfoMap.email ? this.customerInfoMap.email : "NULL",
            "BuyerID": localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].entity_type == "Retailer" ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : "" : "",
            "user_id": localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].user_id : "",
            // "delivery_instructions":"pass on with neighbhour",
            "SellerType":"Distributor"
        };
        let productArray = [];
        for(var i = 0; i < this.cartInfo.length; i++) {
            let productObject = {};
            productObject["distributor_name"] = this.cartInfo[i].distributor_name ? JSON.stringify(this.cartInfo[i].distributor_name) : "NULL";
            productObject["ecomdashID"] = "ecomdashID";
            productObject["ProductPrice"] = this.cartInfo[i].cartObject.subtotal ? this.cartInfo[i].cartObject.subtotal : this.cartInfo[i].productPrice ? this.cartInfo[i].productPrice : "NULL";
            productObject["CustomerPrice"] = this.cartInfo[i].cartObject.subtotal ? this.cartInfo[i].cartObject.subtotal : this.cartInfo[i].productPrice ? this.cartInfo[i].productPrice : "NULL";
            productObject["GSIN"] = this.cartInfo[i].gsin ? this.cartInfo[i].gsin : "NULL";
            productObject["SKUNumber"] = this.cartInfo[i].SKUNumber ? this.cartInfo[i].SKUNumber : "NULL";
            // productObject.Quantity = this.cartInfo[i].quantity ? this.cartInfo[i].quantity : "";
            productObject["Quantity"] = this.cartInfo[i].cartObject.selectedQuantity ? this.cartInfo[i].cartObject.selectedQuantity : "NULL";
            productObject["SellerID"] = this.cartInfo[i].distributor_id ? this.cartInfo[i].distributor_id : "NULL";
            productObject["msrp"] = this.cartInfo[i].msrp ? this.cartInfo[i].msrp : "NULL";
            productObject["BasePrice"] = this.cartInfo[i].productPrice ? this.cartInfo[i].productPrice : "NULL";
            productObject["AppCoMarkUp"] = this.cartInfo[i].AppCoMarkUp ? this.cartInfo[i].AppCoMarkUp : "NULL";
            productObject["RetailerMarkUp"] = this.cartInfo[i].RetailerMarkUp ? this.cartInfo[i].RetailerMarkUp : "NULL";
            productObject["product_name"] = this.cartInfo[i].product_Name ? JSON.stringify(this.cartInfo[i].product_Name) : "NULL";
            productObject["manufacturer"] = this.cartInfo[i].manufacturerName ? JSON.stringify(this.cartInfo[i].manufacturerName) : "NULL";
            productArray.push(productObject);
        }
        commonBody["OrderDetails"] = productArray;
        console.log('reqqqqqq :: ', commonBody);
        console.log('reqqqqqq :: ', JSON.stringify(commonBody));
        this.customerInfoUpdateMap={};
        this.customerInfoUpdateMap.firstName="";
        this.customerInfoUpdateMap.lastName="";
        // shippingInfoForm.resetForm();
        customerInfoForm.resetForm();        
        return this.cartService.placeOrder(commonBody, this.jwt).subscribe((resp) => {
            if(resp) {
                if(resp.status && (resp.status.code == constant.statusCode.success_code)) {
                    this.showSuccessPopup = !this.showSuccessPopup;
                }
                else if (resp.status && (resp.status.code == constant.statusCode.error_code)) {
                    this.showErrorPopup = !this.showErrorPopup;
                }
                var isNotSS = false;              
                if(resp.data && resp.data[0] && resp.data[0].orderId) { // If response has OrderId
                    var orderId = resp.data[0].orderId;
                    // Insert into DynamodB with OrderId for SS & others
                    var params = {
                        "id": orderId
                    };
                    if(resp.data[0].OrderDetails && resp.data[0].OrderDetails.length > 0 ) {
                        for(var i = 0; i < resp.data[0].OrderDetails.length; i++) {
                            if(resp.data[0].OrderDetails[i].SS_OrderNumber) {
                                params["SS_OrderNumber"] = resp.data[0].OrderDetails[i].SS_OrderNumber;
                            }
                            else {
                                isNotSS = true;
                            }
                        }
                    }
                    console.log('first db parammmm', params);
                    this.demoService.updateRecordinDB(params).subscribe((csvresponse) => {
                      console.log("updated db" + csvresponse);
                    }, (err) => {
                      console.log(err);
                    });
                }
                // Insert CSV file into S3 for other distributors
                if(isNotSS && isNotSS == true) {
                    var body_csv = {
                        "response" : resp && resp.data[0] ? resp.data[0] :''
                    }   
                    this.demoService.csvfileUpload(body_csv).subscribe((csvresponse) => {
                        console.log("CSV upload completed" + csvresponse );
                    }, (err) => {
                        console.log(err);
                    });
                }
            }
        });

    }
    onFFLChange(event) {
        console.log(event, this.storeListOfMaps.length);
        // this.allStoreList = this.storeListOfMaps;
        console.log('alllll',this.allStoreList.length);
        if(event && event == true) {
            var temp = [];
            // const storeListOfMaps: any;
            for(var i = 0; i < this.storeListOfMaps.length; i++) {
                if(this.storeListOfMaps[i].StoreFFLId && this.storeListOfMaps[i].FFLNumber) {
                    temp.push(this.storeListOfMaps[i]);
                }
            }
            this.storeListOfMaps = temp;
        }
        else {
            this.storeListOfMaps = this.allStoreList;
        }
        console.log(this.storeListOfMaps.length);
    }

}
