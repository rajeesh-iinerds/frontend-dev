import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { SearchProductService } from '../product-search/search-product-service'
import { MessagePopupComponent } from '../shared/component/message-popup/message-popup.component'
import { DemoService } from '../demo-component/demo.service';
import * as constant from '../shared/config';

@Component({
  selector: 'app-dashboard-component',
  templateUrl: './dashboard-component.component.html',
  styleUrls: ['./dashboard-component.component.css']
})

export class DashboardComponentComponent implements OnInit {
  public showSearchIconRead: boolean = false;
  results: any;
  resultForloop: any;
  productsearch_name: any;
  hideMFGSearch: boolean = false;
  hideGSINSearch: boolean = true;
  updatingProfile : boolean = true;
  values = [
    { "name": 'Search Type', key: '' },
    { "name": 'GSIN', key: 'gsin' },
    { "name": 'Manufacturer Part#', key: 'mpn' }
  ];
  searchType = this.values[0].key;
  searchGSIN: string;
  searchMFG: string;
  manufacturers = [
    { "name": 'Select Manufacturer', key: '' },
    { "name": 'Ruger', key: '8' },
    { "name": 'Sig Sauer', key: '3' },
    { "name": 'Browning', key: '7' },
    { "name": 'Colt', key: '150' },
    { "name": 'Springfield', key: '58' },
    { "name": 'Blackhawk', key: '21' },
    { "name": 'Remington', key: '40' },
    { "name": 'Glock', key: '61' },
    { "name": 'Mossberg', key: '157' },
    { "name": 'Savage Arms', key: '128' }
  ];
  selectManufacturer = this.manufacturers[0].key;
  searchKey: string;
  errorMessage: string;
  disableSearch: boolean = false;
  userName: string;
  userGroup: string;
  manufacturerId: any;
  configUserGroup: any;
  configSuperAdminUserGroup: any;
  configRetailerAdminUserGroup: any;
  showRetailer: any;
  hideRetailer: any;
  userDetails: any;
  retailerProfileDetails: any;
  userId: any;
  result: any;
  retailerProfileloading : boolean = false;
  editRetailerDetails: any;
  updateRetailerProfilePopup: boolean = false;
  successTitle: string;
  successDescription: string;
  loggedInUserRole: String;
  showProfile: boolean = false;
  cartBucket: any = [];
  returnResponse: any;
  cartItemIndex: number;
  constructor(private MessagePopupComponent: MessagePopupComponent, private searchProductService: SearchProductService, private route: ActivatedRoute, private router: Router, public demoService: DemoService, private http: Http) {
    this.hideMFGSearch = true;
    this.hideGSINSearch = true;
    this.disableSearch = true;
    this.searchKey = '';
    this.userGroup = '';
    this.demoService.showRetailerProfile = false;

  }

  ngOnInit() {
    this.userName = this.demoService.getCognitoUser().getUsername();
    this.userGroup = localStorage.getItem('userGroup') && localStorage.getItem('userGroup') != 'null' ? localStorage.getItem('userGroup') : '';
    this.configUserGroup = constant.user.userGroup && constant.user.userGroup != 'null' ? constant.user.userGroup : '';
    this.configSuperAdminUserGroup = constant.user.superadminUser && constant.user.superadminUser != 'null' ? constant.user.superadminUser : '';
    this.configRetailerAdminUserGroup = constant.user.retaileradminUser && constant.user.retaileradminUser != 'null' ? constant.user.retaileradminUser : '';
    this.showRetailer = true;
    this.hideRetailer = constant.user.superadminUser ? false : true;
    this.userDetails = {};
    this.userDetails.first_name = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).first_name : "";
    this.userDetails.last_name = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).last_name : "";
    this.userId = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].user_id : "";
    // this.loggedInUserRole=this.userGroup.toLocaleUpperCase() ? this.userGroup.toLocaleUpperCase():"USER";
    // this.loggedInUserRole = (this.userGroup.toLocaleUpperCase()=='SUPERADMIN') ? 'SUPER ADMIN' : (this.userGroup.toLocaleUpperCase()=='RETAILERADMIN') ? 'RETAILER ADMIN' : (this.userGroup.toLocaleUpperCase()=='ADMIN') ? 'STORE ADMIN' : 'USER';
    this.loggedInUserRole = (this.userGroup == constant.user.superadminUser) ? constant.userTypes.superadmin : (this.userGroup == constant.user.retaileradminUser) ? constant.userTypes.retaileradmin : (this.userGroup == constant.user.userGroup) ? constant.userTypes.admin : constant.userTypes.posuser;
    //console.log("usergroup : " + this.userGroup);
    // console.log("this.configSuperAdminUserGroup : " + this.configSuperAdminUserGroup)
    // if(this.userGroup == this.configSuperAdminUserGroup){

    //   this.showProfile = true;
    // }
    this.getCartList();

  }

  clickedSearch() {
    this.showSearchIconRead = !this.showSearchIconRead;
    this.productsearch_name = "";
  }

  logout() {
    this.demoService.userLogout();
  }

  getToken() {
    // let searchKey = '';
    this.manufacturerId = '';
    if (this.searchType == 'gsin') {
      this.searchKey = this.searchGSIN;
    }
    if (this.searchType == 'mpn') {
      this.searchKey = this.searchMFG;
      this.manufacturerId = this.selectManufacturer;
    }

    // if(this.searchType == "") {
    //   this.errorMessage = "Please select search type.";
    // }
    // else if (this.searchKey == "") {
    //   this.errorMessage = "Please enter valid value.";
    // }
    // else {
    // this.errorMessage = "";
    return this.demoService.getSessionToken().subscribe((response) => {
      if (response.getIdToken().getJwtToken()) {
        const jwt = response.getIdToken().getJwtToken();
        this.demoService.productSearchfromService(this.searchType, this.searchKey, jwt, this.manufacturerId);
      }
    }, (err) => {
      console.log(err);
    });
    // }        
  }

  onSearchChange($event) {
    // this.disableSearch = false;
    // this.errorMessage = '';
    this.searchGSIN = this.searchMFG = '';
    this.selectManufacturer = this.manufacturers[0].key;
    this.hideGSINSearch = this.hideMFGSearch = true;
    if ($event == 'gsin') {
      this.hideGSINSearch = false;
    }
    if ($event == 'mpn') {
      this.hideMFGSearch = false;
    }
  }

  checkGSINEmpty($event) {
    // console.log($event);
    this.disableSearch = false;
  }

  // Method for showing Retailer profile 
  retailerProfile(event) {
    this.retailerProfileloading = true;
    //  console.log("usergroup : " + this.userGroup);
    //  console.log("this.configSuperAdminUserGroup : " + this.configSuperAdminUserGroup)
    this.demoService.showRetailerProfile = true;
    event.stopPropagation()
    this.retailerProfileDetails = {};
    //this.demoService.democomponentLoading = true;
    return this.demoService.getSessionToken().subscribe((response) => {
      if (response.getIdToken().getJwtToken()) {
        const jwt = response.getIdToken().getJwtToken();
        let headers = new Headers({
          'Authorization': jwt
        });
        let options = new RequestOptions({
          headers: headers
        });
        var req_body = { "userId": this.userId };
        const url = constant.appcohesionURL.retailerProfile_URL ? constant.appcohesionURL.retailerProfile_URL : "";
        this.http.post(url, req_body, options).subscribe(data => {
          this.retailerProfileloading = false;
         // this.demoService.democomponentLoading = false;
          this.result = data ? data.json() : {};
          if (this.result && this.result.status) {
            if (this.result.status.code == constant.statusCode.success_code) {
              for (var item in this.result.userinfo) {
                this.retailerProfileDetails.FirstName = this.result.userinfo[item].FirstName ? this.result.userinfo[item].FirstName : "";
                this.retailerProfileDetails.LastName = this.result.userinfo[item].LastName ? this.result.userinfo[item].LastName : "";
                this.retailerProfileDetails.Name = this.retailerProfileDetails.FirstName + " " + this.retailerProfileDetails.LastName;
                this.retailerProfileDetails.UserPhone = this.result.userinfo[item].UserPhone && this.result.userinfo[item].UserPhone == "null" ? "" : this.result.userinfo[item].UserPhone;
                this.retailerProfileDetails.UserEmail = this.result.userinfo[item].UserEmail && this.result.userinfo[item].UserEmail == "null" ? "" : this.result.userinfo[item].UserEmail;
              }
            }
            else if (this.result.statusCode == constant.statusCode.empty_code) {
              console.log("error")
            }
          }
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  // Method for showing retailer profile details in edit page
  editRetailerProfile(event) {
    event.stopPropagation()
    this.editRetailerDetails = [];
    this.demoService.showEditRetailerView = true;
    this.demoService.showRetailerProfile = false;
    this.editRetailerDetails.push(this.retailerProfileDetails);
  }

  // Method for updating retailer profile
  updateRetailerProfile(retailer) {
  
   // this.demoService.democomponentLoading = true;
    return this.demoService.getSessionToken().subscribe((response) => {
      if (response.getIdToken().getJwtToken()) {
        const jwt = response.getIdToken().getJwtToken();
        let headers = new Headers({
          'Authorization': jwt
        });
        let options = new RequestOptions({
          headers: headers
        });
        var req_body = {
          "userid": this.userId ? this.userId : "",
          "firstname": retailer.FirstName ? retailer.FirstName : "",
          "lastname": retailer.LastName ? retailer.LastName : "",
          "userphone": retailer.UserPhone ? retailer.UserPhone : ""
        };
        const url = constant.appcohesionURL.updateRetailerProfile_URL ? constant.appcohesionURL.updateRetailerProfile_URL : "";
        this.http.post(url, req_body, options).subscribe(data => {
        
         // this.demoService.democomponentLoading = false;
          this.result = data ? data.json() : {};
          if (this.result && this.result.status) {
            if (this.result.status.code == constant.statusCode.success_code) {
              this.updateRetailerProfilePopup = true;
              this.successTitle = constant.retailerProfile_messages.success_title;
              this.successDescription = constant.retailerProfile_messages.success_description;
              this.retailerProfile(event);
             
              this.demoService.showEditRetailerView = !this.demoService.showEditRetailerView;
              this.demoService.showRetailerProfile = !this.demoService.showRetailerProfile
              //  this.demoService.showEditRetailerView = this.updateRetailerProfilePopup ? false : true; 
            }
            else if (this.result.statusCode == constant.statusCode.empty_code) {
              console.log("error");
            }
          }
        });
      }
    }, (err) => {
      console.log(err);
    });
  }
  decreaseQuantity(index) {
    this.cartBucket[index].quantity > 1 ? this.cartBucket[index].quantity = parseInt(this.cartBucket[index].quantity) - 1 : "";
  }
  increaseQuantity(index) {
    this.cartBucket[index].quantity ? this.cartBucket[index].quantity = parseInt(this.cartBucket[index].quantity) + 1 : "";
  }
  addToCart(event, cartObject, isAddToCart) {
    event.stopPropagation();
    let cartMap = Object.assign({}, cartObject);
    cartMap.UserID = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].user_id : "";
    cartMap.retailerID = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].EntityId : "";
    // cartMap.gsin="3213";
    cartMap.quantity = isAddToCart ? (this.returnQuantity(cartMap) ? parseInt(this.returnQuantity(cartMap)) + 1 : 1) : (this.returnQuantity(cartMap) ? parseInt(this.returnQuantity(cartMap)) : "");

    let reqBody = {
      UserID: localStorage.getItem("User_Information") ? parseInt(JSON.parse(localStorage.getItem("User_Information"))[0].user_id) : "",
      retailerID: localStorage.getItem("User_Information") ? parseInt(JSON.parse(localStorage.getItem("User_Information"))[0].EntityId) : "",
      quantity: cartMap.quantity ? parseInt(cartMap.quantity) : "",
      GSIN: cartMap.gsin ? parseInt(cartMap.gsin) : "",
      //GSIN: cartMap.gsin||cartMap.GSIN ? cartMap.gsin ||cartMap.GSIN  : "",
      distributorID: cartMap.distributor_id ? parseInt(cartMap.distributor_id) : "",
    }

    this.demoService.getSessionToken().subscribe((response) => {
      if (response.getIdToken().getJwtToken()) {
        const jwt = response.getIdToken().getJwtToken();
        this.searchProductService.addToCart(reqBody, response).subscribe((response) => {
          this.returnResponse = response.json();
          this.returnResponse && this.returnResponse.status.code == constant.statusCode.success_code ? this.getCartList() : alert("Add to cart failed");
        });
      }
    });
  }
  returnQuantity(cartMap) {
    var quantity;
    var index = this.isObjectInTheList(cartMap, this.cartBucket);

    quantity = index < 0 ? 0 : (this.cartBucket[index].quantity ? this.cartBucket[index].quantity : 0);
    return quantity;
  }

  isObjectInTheList(obj, list) {

    this.cartItemIndex = -1;
    for (var i = 0; i < list.length; i++) {
      if (parseInt(list[i].gsin) === parseInt(obj.gsin)) {
        this.cartItemIndex = i;
        break;
      } else {
        this.cartItemIndex = -1;
      }
    }
    // list.forEach((element, itemIndex) => {
    //   console.error(parseInt(element.gsin) === parseInt(obj.gsin))
    //   console.info(this.cartItemIndex);
    //   if (parseInt(element.gsin) === parseInt(obj.gsin)) {
    //     this.cartItemIndex = itemIndex;
    //   } else {
    //     this.cartItemIndex = -1;
    //   }
    // });  
    console.info(this.cartItemIndex);

    return this.cartItemIndex;
  }
  getCartList() {
    this.demoService.getSessionToken().subscribe((response) => {
      if (response.getIdToken().getJwtToken()) {
        const jwt = response.getIdToken().getJwtToken();
        this.searchProductService.getCartList({ "user_id": localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].user_id : "" }, jwt).subscribe((response) => {
          this.cartBucket = response ? response.json().cartList : [];
          this.demoService.loading = false;
        });
      }
    });
  }

}

