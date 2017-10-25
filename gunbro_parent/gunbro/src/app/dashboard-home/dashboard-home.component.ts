import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import * as constant from '../shared/config';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  userGroup : any;

  constructor(private router: Router) { 
  this.userGroup = '';
  }

  ngOnInit() {
    this.userGroup = localStorage.getItem('userGroup') && localStorage.getItem('userGroup') != 'null' ? localStorage.getItem('userGroup') : '';
  }

  // Method for viewing Retailer page 
  viewRetailer(){
   if(this.userGroup == constant.user.superadminUser){
    this.router.navigate(['/dashboard/DistMarkup']);
   }
   else{
     this.router.navigate(['/dashboard']);
   }
  }

}
