import {
    Component,
    OnInit
} from '@angular/core';
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
import {
    Observable
} from 'rxjs/Rx';
import {
    DemoService
} from '../demo-component/demo.service';
import * as constant from '../shared/config';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-retailer-markup',
    templateUrl: './retailer-markup.component.html',
    styleUrls: ['./retailer-markup.component.css']
})
export class RetailerMarkupComponent implements OnInit {
    result: any;
   
    retailerList: any;
    allretailerList: any;
    retailerInfo: any = {};
    role_id: any;
    role_name:any;
    isPasswordMismatch: Boolean;
    checkboxValue: Boolean;
    selectDefaultInventory: any;
    constructor(private http: Http, private router: Router, public demoService: DemoService) { 
        this.demoService.showRetailerProfile = false;
      
    }

    ngOnInit() {
        this.selectDefaultInventory = 0;
        this.demoService.listRetailorDetails();
        // this.listRetailorDetails().subscribe((response) => {
        //     console.log("function call retailer detailes : " + JSON.stringify(response));
        // },
        //     (err) => console.error(err)
        // );
        this.role_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].role_id : "";
        
      //  console.info(this.role_name);
    }
    
    // Method for selecting default inventory
    selectInventory(){
        this.selectDefaultInventory = this.checkboxValue ? 1 : 0;
      //  console.log("select inventory ; " +  this.selectDefaultInventory);
    }
   

    // Method for directing the distributor to their corresponding own page
    retailerCategoryList(retailerId) {
        for (var i = 0; i < this.demoService.retailerDetails.length; i++) {
            if ( this.demoService.retailerDetails[i].retailerId == retailerId) {
                this.demoService.setRetailerIdforCategory(retailerId);
                this.router.navigate(['/dashboard/RetailerSingle']);
                return;
            } else {
                this.router.navigate(['/dashboard/RetailerMarkup']);
            }
        }
    }

    createRetailer(retailerInfoMap, retailerForm) {
       // console.log("inventory in create retailer : " + this.selectDefaultInventory);
        if (retailerForm.valid) {
            let userDetailsMap: any = localStorage.getItem("User_Information");
            var role_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].role_id : "";
            var entity_type = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].entity_type : "";
            let postMap = {
                "role_id": role_id,
                "user": {
                    entity_type: entity_type,
                    user_name: retailerInfoMap.emailId,
                    email: retailerInfoMap.emailId,
                    first_name: retailerInfoMap.firstName,
                    last_name: retailerInfoMap.lastName,
                    role_id: constant.userRoles.retailerAdminUser,
                    phone_number: retailerInfoMap.phoneNumber,
                    retailer_name: retailerInfoMap.retailerName,
                    retailer_address: retailerInfoMap.retailerAddress,
                    isAppCoInvSubscribed : this.selectDefaultInventory
                }
            }
            
            //                    "password": retailerInfoMap.userPassword2,

            this.demoService.loading = true;
            this.demoService.getSessionToken().subscribe((response) => {
                if (response.getIdToken().getJwtToken()) {
                    const jwt = response.getIdToken().getJwtToken();
                    //logged user role is third argument
                    this.demoService.createUser(jwt, postMap, constant.userRoles.superAdminUser);
                }
            });


        }
    }

    validatePasswordMatch(retailerInfoMap, userPasswordFormObject) {

        if (retailerInfoMap.userPassword1 === retailerInfoMap.userPassword2) {
            this.isPasswordMismatch = true;
        } else {
            this.isPasswordMismatch = false;

        }
    }
    showOrHideCreateEmployee(event) {
        event.stopPropagation();
        this.demoService.showNav = !this.demoService.showNav;
    }
        
    
}