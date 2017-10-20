import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx'; 
import 'rxjs/add/operator/map';
import { DemoService } from '../demo-component/demo.service';
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
    {"name":'Ruger', key:'8'},
    {"name":'Sig Sauer', key:'3'},
    {"name":'Browning', key:'7'},
    {"name":'Colt', key:'150'},
    {"name":'Springfield', key:'58'},
    {"name":'Blackhawk', key:'21'},
    {"name":'Remington', key:'40'},
    {"name":'Glock', key:'61'},
    {"name":'Mossberg', key:'157'},
    {"name":'Savage Arms', key:'128'}
  ];
  selectManufacturer =  this.manufacturers[0].key;
  searchKey: string;
  errorMessage: string;
  disableSearch: boolean = false;
  userName: string;
  userGroup: string;
  manufacturerId: any;
  configUserGroup: any;
  
  constructor(private route: ActivatedRoute,private router: Router, public demoService: DemoService,private http:Http) {
    this.hideMFGSearch = true;
    this.hideGSINSearch = true;
    this.disableSearch = true;
    this.searchKey = '';
    this.userGroup = '';
  }
  
  ngOnInit() {
    this.userName = this.demoService.getCognitoUser().getUsername();
    this.userGroup = localStorage.getItem('userGroup') && localStorage.getItem('userGroup') != 'null' ? localStorage.getItem('userGroup') : '';
    this.configUserGroup = constant.user.userGroup && constant.user.userGroup != 'null' ? constant.user.userGroup : '';
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
      this.manufacturerId = '';
      if(this.searchType == 'gsin') {
        this.searchKey = this.searchGSIN;
      }
      if(this.searchType == 'mpn') {
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
            if(response.getIdToken().getJwtToken()) {
                const jwt = response.getIdToken().getJwtToken();
                this.demoService.productSearchfromService(this.searchType, this.searchKey, jwt, this.manufacturerId);
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

