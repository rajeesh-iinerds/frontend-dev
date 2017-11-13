import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoService } from '../demo-component/demo.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import * as constant from '../shared/config';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit {

  userPostMap: any = {};
  isPasswordMismatch: Boolean;
  showNav: boolean = false;
  results: any;
  storeListOfMaps: any;
  role_id: number;
  constructor(public demoService: DemoService, private http: Http) {
  }

  ngOnInit() {
    this.demoService.listUsers();
    this.role_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].role_id : "";
    if (this.role_id == 4) {
      this.userPostMap.userRole = 1;
    } else {
      this.userPostMap.userRole = 2;
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
            }
          }
        });
      }
    }, err => {
      console.log("error on order", err)
    })
  }

  showOrHideCreateEmployee(event) {
    event.stopPropagation();
    this.demoService.showNav = !this.demoService.showNav;
  }
  validatePasswordMatch(retailerInfoMap, userPasswordFormObject) {
    if (retailerInfoMap.userPassword1 === retailerInfoMap.userPassword2) {
      this.isPasswordMismatch = true;
    } else {
      this.isPasswordMismatch = false;
    }
  }
  createUser(userPostMap, createStoreAdminForm) {
    var entity_type = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].entity_type : "";
    let postMap = {
      role_id: this.role_id,
      user: {
        entity_type: entity_type,
        store_id: userPostMap.storeId,
        user_name: userPostMap.email,
        email: userPostMap.email,
        first_name: userPostMap.firstName,
        last_name: userPostMap.lastName,
        role_id: userPostMap.userRole,
        phone_number: userPostMap.phoneNumber
      }
    }
    this.demoService.getSessionToken().subscribe((response) => {
      if (response.getIdToken().getJwtToken()) {
        const jwt = response.getIdToken().getJwtToken();
        //logged user role is third argument
        this.demoService.createUser(jwt, postMap, constant.userRoles.retailerAdminUser);
        this.userPostMap = {};
        this.userPostMap.userRole = 2;
      }
    });
  }
}
