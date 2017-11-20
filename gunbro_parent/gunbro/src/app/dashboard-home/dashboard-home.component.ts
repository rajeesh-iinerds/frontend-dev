import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import * as constant from '../shared/config';
import { DemoService } from '../demo-component/demo.service';

import {OrdersComponent} from '../orders/orders.component'
@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  userGroup : any;
  userName: string;
  userDetails: any;
  orderslistCount:any;

  constructor(private router: Router, public demoService: DemoService,public ordersList : OrdersComponent) { 
  this.userGroup = '';
  this.demoService.showRetailerProfile = false;
  }

  ngOnInit() {
    this.userGroup = localStorage.getItem('userGroup') && localStorage.getItem('userGroup') != 'null' ? localStorage.getItem('userGroup') : '';
    this.userName = this.demoService.getCognitoUser().getUsername();
    this.userDetails = {};
    this.orderslistCount = 0;
    this.userDetails.first_name = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).first_name : "";
    this.userDetails.last_name = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).last_name : "";
    this.ordersList.listOrders().subscribe((response) => {
     this.orderslistCount =  response && response.length ? response.length :0;
    },
    (err) => {console.error(err);

    }
);


  }
}