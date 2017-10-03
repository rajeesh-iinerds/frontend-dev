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
    
    constructor(private demoService: DemoService , private route: ActivatedRoute,private router: Router) {
    }
    
    ngOnInit() {
    }
    
    login (name, password) {
     	console.log(this.errorMessage);
        if(name && password) {
            this.errorMessage = "";
            return this.demoService.userLogin(name, password).subscribe((response) => { 
                console.log("LOGIN Success", response);
                if(response.statusCode == 400) {
                  this.errorMessage = response.message;
                }
                else {
                  this.router.navigate(['/dashboard']);
                }
            }, (err) => {
                console.log(err);
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
    }

}
