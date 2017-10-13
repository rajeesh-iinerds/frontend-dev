import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx'; 
import 'rxjs/add/operator/map';

import { DemoService } from '../demo-component/demo.service';
// import { TEST } from '../shared/config';
import * as constant from '../shared/config';

@Component({
  selector: 'app-dashboard-component',
  templateUrl: './dashboard-component.component.html',
  styleUrls: ['./dashboard-component.component.css']
})

export class DashboardComponentComponent implements OnInit {
  public showSearchIconRead: boolean = false;
  results :any;
  resultForloop :any;
  productsearch_name : any; 
  hideMFGSearch: boolean = false;
  hideGSINSearch: boolean = true;
  values = [
    {"name":'Search Type', key:''},
    {"name":'GSIN', key:'gsin'},
    {"name":'Manufacturer Part#', key:'mpn'}
  ];
  searchType = this.values[0].key;
  searchGSIN: string;
  searchMFG: string;
  manufacturers = [
    {"name":'Select Manufacturer', key:''},
    {"name":'ABA - AMERICAN BUILT ARMS COMPANY', key:'1'}
  ];
  selectManufacturer =  this.manufacturers[0].key;
  searchKey: string;
  errorMessage: string;
  disableSearch: boolean = false;
  userName: string;
  userGroup: string;
  
  constructor(private route: ActivatedRoute,private router: Router, public demoService: DemoService,private http:Http) {
    this.hideMFGSearch = true;
    this.hideGSINSearch = true;
    this.disableSearch = true;
    this.searchKey = '';
    this.userGroup = '';
  }
  
  ngOnInit() {
    this.userName = this.demoService.getCognitoUser().getUsername();
    console.log(localStorage.getItem('userGroup'));
    if(localStorage.getItem('userGroup') && localStorage.getItem('userGroup') != '') {
      this.userGroup = localStorage.getItem('userGroup');
    }
    
  }

    clickedSearch(){
        this.showSearchIconRead = !this.showSearchIconRead;
        this.productsearch_name = "";
    }

    logout () {
        this.demoService.userLogout();
    }

    getToken () {
      // let searchKey = '';
      if(this.searchType == 'gsin') {
        this.searchKey = this.searchGSIN;
      }
      if(this.searchType == 'mpn') {
        this.searchKey = this.searchMFG;
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
            if(response.getIdToken().getJwtToken()) {
                const jwt = response.getIdToken().getJwtToken();
                this.demoService.productSearchfromService(this.searchType, this.searchKey, jwt);
            }
        }, (err) => {
          console.log(err);
        });
      // }        
    }

    onSearchChange ($event) {
      // this.disableSearch = false;
      // this.errorMessage = '';
      this.searchGSIN = this.searchMFG = '';
      this.selectManufacturer =  this.manufacturers[0].key;
      this.hideGSINSearch = this.hideMFGSearch = true;
      if ($event == 'gsin') {
        this.hideGSINSearch = false;
      }
      if ($event == 'mpn') {
        this.hideMFGSearch = false;
      }
    }

    checkGSINEmpty($event) {
      console.log($event);
      this.disableSearch = false;
    }
}

