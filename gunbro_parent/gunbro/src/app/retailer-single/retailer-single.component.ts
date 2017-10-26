import { Component, OnInit } from '@angular/core';
import { DemoService } from '../demo-component/demo.service';

@Component({
  selector: 'app-retailer-single',
  templateUrl: './retailer-single.component.html',
  styleUrls: ['./retailer-single.component.css']
})
export class RetailerSingleComponent implements OnInit {

  showMarkup: boolean = false;
  retailerId: number = 1;

    constructor(public demoService: DemoService) { 

    }
  
    ngOnInit() {
      return this.demoService.getSessionToken().subscribe((response) => {
        if(response.getIdToken().getJwtToken()) {
             const jwt = response.getIdToken().getJwtToken();
            // this.demoService.productSearchfromService(this.searchType, this.searchKey, jwt);
            this.getCategoryList(jwt);
        }
      }, (err) => {
        console.log(err);
      });
    }


  // Method for getting category list for an retailer
   getCategoryList(jwt){
     console.log("get category list")
    this.demoService.listCategoryforRetailer(jwt).subscribe((data) => {
      console.log("list category" + data);
      }, (err) => {
       console.log(err);
     });
   }

  // Method for showing markup
    viewMarkup(){
      if(this.retailerId == 1){
        this.showMarkup = true;
      }
    }

  // Method for closing markup
    closeMarkup(){
      this.showMarkup = false;
    }
}
