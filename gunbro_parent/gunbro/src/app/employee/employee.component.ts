import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoService } from '../demo-component/demo.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit {

  marginTop:number = 0;
  showNav:boolean = false;
  userInfo = {
      "firstName": '',
      "lastName": '',
      "email": '',
      "password": '',
      "confirmPassword": ''
    };

  constructor(public demoService: DemoService) { 
  }

  ngOnInit() {
    this.demoService.listUsers();
  }

  getToken() {
    return this.demoService.getSessionToken().subscribe((response) => {
      if(response.getIdToken().getJwtToken()) {
           const jwt = response.getIdToken().getJwtToken();
          // this.demoService.productSearchfromService(this.searchType, this.searchKey, jwt);
          this.createEmployee(jwt);
      }
    }, (err) => {
      console.log(err);
    });
  }

  createEmployee (jwt) {
    this.demoService.createUser(jwt, this.userInfo);
  }
  showCreateEmployee(event) {
    event.stopPropagation();
    this.demoService.showNav = !this.demoService.showNav;
  }

}
