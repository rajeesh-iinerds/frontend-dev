
import { Component, OnInit } from '@angular/core';
import { DemoService } from './demo.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-demo-component',
  templateUrl: './demo-component.component.html',
  styleUrls: ['./demo-component.component.css']
})
export class DemoComponentComponent implements OnInit {
    errorMessage: string;
    jwt : string;
    constructor(public demoService: DemoService , private route: ActivatedRoute,private router: Router) {
      this.demoService.showRetailerProfile = false;
    }
    
    ngOnInit() {
    }
    
    login (name, password) {
     	console.log(this.errorMessage);
        if(name && password) {
            this.errorMessage = "";
            return this.demoService.userLogin(name, password).subscribe((response) => {
              this.demoService.loading = false;
                console.log("LOGIN Success", response);
                if(response.statusCode == 400) {
                  this.errorMessage = response.message;
                }
                else {
                  console.log("inside success : " + JSON.stringify(response));
                  this.jwt = response.getIdToken().getJwtToken();
                  return this.demoService.userDetails(name, password,this.jwt).subscribe((responseDetails) => {                   
                       this.router.navigate(['/dashboard']);
                }, (err) => {
                   console.log("error in login Details Page ",err);
               });                
                }
            }, (err) => {
               this.demoService.loading = false;
                console.log("error in login ",err);
            });
        }
        else if (name == "" || name == undefined) {
          this.errorMessage = "Please enter user name.";
        }
        else if (password == "" || password == undefined) {
          this.errorMessage = "Please enter password.";
        }
    }

    resetPassword () {
      console.log("reset");
		  this.router.navigate(['/forgot']);
    }
}
