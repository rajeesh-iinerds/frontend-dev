import { Component, OnInit } from '@angular/core';
import { DemoService } from '../demo-component/demo.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import * as constant from '../shared/config';

@Component({
  selector: 'app-retailer-single',
  templateUrl: './retailer-single.component.html',
  styleUrls: ['./retailer-single.component.css']
})
export class RetailerSingleComponent implements OnInit {

  applyMarkup: boolean = false;
  viewMarkup:boolean = false;
  closeMarkup:boolean = false; 
  updateMarkupPopup: boolean = false;
  temp: {
		"categoryId": ''
  };
  viewtemp : {
    "categoryId": ''
  };
  categoryId : any;
  result: any;
  successTitle : string;
  successDescription: string;
  applyFlag: any;
  markupUpdate: any;

  markupValue: string;
    constructor(public demoService: DemoService, private router: Router, private http: Http) { 

    }
  
    ngOnInit() {
      this.demoService.listRetailer();
    }



  // Method for showing markup
    applyMarkupform(category) {
		  this.temp = category;
		  console.log("this.temp:" + JSON.stringify(this.temp));
  		// this.markupValue = category.markup && category.markup > 0 ? category.markup : '';
		 // this.markupValue = category.markup;
	
    }
    
  // Method for viewing markup
    viewMarkupForm(category){
      this.viewtemp = category;
		  this.markupUpdate = category.markup;
   }

   // Method for canceling a
    cancelApplyMarkup(category) {
  		this.temp = {
			"categoryId": ''
		};
    }

    cancelViewMarkup(category) {
  		this.viewtemp = {
			"categoryId": ''
	  	};
    }
    
    backtoRetailer(){
      this.router.navigate(['/dashboard/RetailerMarkup']);
    }
    
    // Method for Markup functionality : apply, applyAll, Update, UpdateAll
    applyMarkupEvent(markup,retailer,flag){
      this.applyFlag = flag && flag == "single" ? "single" : "all";
      this.categoryId = retailer.categoryId ? retailer.categoryId : "";
      this.demoService.loading = true;
      return this.demoService.getSessionToken().subscribe((response) => {
        if (response.getIdToken().getJwtToken()) {
          const jwt = response.getIdToken().getJwtToken();
          let headers = new Headers({ 'Authorization': jwt });
          let options = new RequestOptions({ headers: headers });
          var req_body = {
	        	"categoryId": this.categoryId,
	        	"retailerId": "1",
			    	"update": this.applyFlag ,
            "markup": markup
          };
          const url = constant.appcohesionURL.retailerApply_URL;
          this.http.post(url, req_body, options).subscribe(data => {
            this.demoService.loading = false;
            this.result = data.json();
           if(this.result && this.result.status){
              if(this.result.status.code == 200){
                this.updateMarkupPopup = true;
                this.successTitle = constant.distributor_markup_messages.success_title;
                this.successDescription = constant.distributor_markup_messages.success_description;
               }
              else if(this.result.status.code == constant.statusCode.empty_code){
                console.log("error");
              }
            }
          });
        }
      });
      
    }
}
