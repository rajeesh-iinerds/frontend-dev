import { Component, OnInit } from '@angular/core';
import { DemoService } from '../demo-component/demo.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-retailer-single',
  templateUrl: './retailer-single.component.html',
  styleUrls: ['./retailer-single.component.css']
})
export class RetailerSingleComponent implements OnInit {

  applyMarkup: boolean = false;
  viewMarkup:boolean = false;
  closeMarkup:boolean = false; 
    constructor(public demoService: DemoService, private router: Router) { 

    }
  
    ngOnInit() {
      this.demoService.listRetailer();
     
    }



  // Method for showing markup
   applyMarkupform(){
      this.applyMarkup = true;
    }
    viewMarkupForm(){
      this.viewMarkup = true;
    }

  // Method for closing markup
    closeMarkupForm(){
     this.closeMarkup = true;
    }
    
    backtoRetailer(){
      this.router.navigate(['/dashboard/RetailerMarkup']);
    }
}
