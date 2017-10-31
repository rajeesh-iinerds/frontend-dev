import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import * as constant from '../shared/config';
import { DemoService } from '../demo-component/demo.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  userGroup : any;
  userName: string;

  constructor(private router: Router, public demoService: DemoService) { 
  this.userGroup = '';
  }

  ngOnInit() {
    this.userGroup = localStorage.getItem('userGroup') && localStorage.getItem('userGroup') != 'null' ? localStorage.getItem('userGroup') : '';
    this.userName = this.demoService.getCognitoUser().getUsername();
  }

  // Method for viewing Retailer page 
  // viewRetailer(){
  //  if(this.userGroup == constant.user.superadminUser){
  //   this.router.navigate(['/dashboard/RetailerMarkup']);
  //  }
  //  else{
  //    this.router.navigate(['/dashboard']);
  //  }
  // }

}