import {
  Component,
  OnInit
} from '@angular/core';
import {
  DemoService
} from '../demo-component/demo.service';
import {
  ActivatedRoute,
  RouterModule,
  Router
} from '@angular/router';
import {
  Http,
  Headers,
  Response,
  RequestOptions
} from '@angular/http';
import * as constant from '../shared/config';

@Component({
  selector: 'app-retailer-single',
  templateUrl: './retailer-single.component.html',
  styleUrls: ['./retailer-single.component.css']
})
export class RetailerSingleComponent implements OnInit {
  updateMarkupPopup: boolean = false;
 // hideApplyEvent: boolean;
  temp: {
      "categoryId": ''
  };
  viewtemp: {
      "categoryId": ''
  };
  categoryId: any;
  result: any;
  successTitle: string;
  successDescription: string;
  applyFlag: any;
  markupUpdate: any;
  markup: any;
  retailerCategory: any;
  MarkupApplied: any;
  MarkupAppliedAll : any;

  constructor(public demoService: DemoService, private router: Router, private http: Http) {
    this.demoService.showRetailerProfile = false;
   
  }

  ngOnInit() {
      //Service function for listing retailers
      this.demoService.listRetailer();
      console.log("retailer id inittttttt : " + this.demoService.retailerId);
     this.MarkupApplied = true;
     this.MarkupAppliedAll = true;
  }

  // Method for showing markup
  applyMarkupform(category) {
      this.temp = category;
  }

  // Method for viewing markup
  viewMarkupForm(category) {
      this.viewtemp = category;
      this.markupUpdate = category.markup;
      console.log("markup update : " + this.markupUpdate);

     // this.hideApplyEvent = this.markupUpdate !=null ? true : false;
      this.markup = '';
  }

  // Method for canceling Markup
  cancelMarkup(category) {
      this.temp = {
          "categoryId": ''
      };
      this.viewtemp = {
        "categoryId": ''
    };
  }

  // Method for Markup functionality : apply, applyAll, Update, UpdateAll
  applyMarkupEvent(markup, retailer, flag, tempFlag, categoryId) {
    console.log("retailer id : " + JSON.stringify(retailer));
      this.applyFlag = flag && flag == "single" ? "single" : "all";
      this.categoryId = categoryId ? categoryId : "";
      this.demoService.loading = true;

      return this.demoService.getSessionToken().subscribe((response) => {
          if (response.getIdToken().getJwtToken()) {
              const jwt = response.getIdToken().getJwtToken();
              let headers = new Headers({
                  'Authorization': jwt
              });
              let options = new RequestOptions({
                  headers: headers
              });
              var req_body = {
                  "categoryId": this.categoryId,
                  "retailerId": this.demoService.retailerId,
                  "update": this.applyFlag,
                  "markup": markup
              };
              console.log("appppppplyyy markupppppp " + JSON.stringify(req_body));
              const url = constant.appcohesionURL.retailerApply_URL;
              this.http.post(url, req_body, options).subscribe(data => {
                  this.demoService.loading = false;
                  this.result = data.json();
                  if (this.result && this.result.status) {
                      if (this.result.status.code == 200) {
                          this.updateMarkupPopup = true;
                          this.successTitle = constant.distributor_markup_messages.success_title;
                          this.successDescription = constant.distributor_markup_messages.success_description;
                          this.demoService.listRetailer();
                      } else if (this.result.status.code == constant.statusCode.empty_code) {
                          console.log("error");
                      }
                  }
              });
          }
      });
  }
}