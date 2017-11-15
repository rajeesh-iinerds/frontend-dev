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
  userDetails: any;

  constructor(private router: Router, public demoService: DemoService) { 
  this.userGroup = '';
  this.demoService.showRetailerProfile = false;
  }

  ngOnInit() {
    this.userGroup = localStorage.getItem('userGroup') && localStorage.getItem('userGroup') != 'null' ? localStorage.getItem('userGroup') : '';
    this.userName = this.demoService.getCognitoUser().getUsername();
    this.userDetails = {};
    this.userDetails.first_name = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).first_name : "";
    this.userDetails.last_name = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")).last_name : "";

  }
}