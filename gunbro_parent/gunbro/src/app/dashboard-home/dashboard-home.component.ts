/*Dashboard home compont for 1.orderlisting 2.Distributor Listing 3. User welcome
Dated(change) : 11/20/2017
Author : Praseeda */
//--------------------------------------
import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  RouterModule,
  Router
} from '@angular/router';

import * as constant from '../shared/config';
import {
  DemoService
} from '../demo-component/demo.service';

import {
  OrdersComponent
} from '../orders/orders.component';
import {
  DistributorMarkupComponent
} from '../distributor-markup/distributor-markup.component';

import {
  EmployeeComponent
} from '../employee/employee.component'




@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  userGroup: any;
  userName: string;
  userDetails: any;
  orderslistCount: Number;
  distlistCount: Number;
  emplistCount: Number;
  constructor(private router: Router, public demoService: DemoService, public ordersList: OrdersComponent, public distList: DistributorMarkupComponent, public empList: EmployeeComponent) {
      this.userGroup = '';
      this.demoService.showRetailerProfile = false;
  }

  ngOnInit() {
      //UserDetails
      this.userGroup = localStorage.getItem('userGroup') && localStorage.getItem('userGroup') != 'null' ? localStorage.getItem('userGroup') : '';
      this.userName = this.demoService.getCognitoUser().getUsername();
      this.userDetails = {};
      this.userDetails.first_name = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).first_name : "";
      this.userDetails.last_name = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).last_name : "";

      

      //Function to fetch the order count from ordercomponent.
      this.ordersList.listOrders().subscribe((response) => {
              this.orderslistCount = response && response.length ? response.length : 0;
          },
          (err) => {
              this.orderslistCount = 0;
              console.error(err);
          }

      );
      //Function to fetch the distributor count from dist-markup component.
      this.demoService.getSessionToken().subscribe((response) => {
          this.distList.getDistributorsList(response).subscribe((distListResponse) => {
                  this.distlistCount = distListResponse && distListResponse.length ? distListResponse.length : 0;
              },
              (err) => {
                  this.distlistCount = 0;
                  console.error(err);
              }
          );
      });
      //Function to fetch the employee count from employee-component 
      this.empList.getEmployeeList().subscribe((employeeListResponse) => {
              this.emplistCount = employeeListResponse && employeeListResponse.users && employeeListResponse.users.length ? employeeListResponse.users.length : 0;

          },
          (err) => {
              this.emplistCount = 0;
              console.error(err);
          }
      );

  }
}