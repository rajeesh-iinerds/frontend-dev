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
  //  retailerInfo: any = {};
    role_id: any;
    role_name:any;
    isPasswordMismatch: Boolean;
    DefaultInventorycheck: any;
    selectDefaultInventory: any;
    retailerForm:any;
    checkboxValue: boolean = false;
    continueJourney:Boolean=false;
    checkbtn:boolean=false;
    createUserEnabled = false;
    retailerInfo = {
        "firstName": '',
        "lastName": '',
        "retailerName": '',
        "retailerAddress": '',
        "emailId": '',
        "phoneNumber": ''
       
    };
    showHideDefaultInventory:Boolean;
    showpopdetails: Boolean = false;
    constructor(private http: Http, private router: Router, public demoService: DemoService) { 
        this.demoService.showRetailerProfile = false;
    }

    ngOnInit() {
       
        this.demoService.listRetailorDetails();
        // this.listRetailorDetails().subscribe((response) => {
        //     console.log("function call retailer detailes : " + JSON.stringify(response));
        // },
        //     (err) => console.error(err)
        // );
        this.role_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].role_id : "";
        
        console.log("this.checkboxValue ngInit" + this.checkboxValue)
    }

    addDefaultInventory(retailerInfoMap, retailerForm){     
        this.demoService.createUserPopup = false;
        this.demoService.showNav = !this.demoService.showNav;
        this.checkboxValue = true;
        this.createRetailer(retailerInfoMap, retailerForm,'');
       // this.selectDefaultInventory = 1;
       
    }


    proceedDefaultInventory(retailerInfoMap, retailerForm){ 
       this.demoService.showNav = !this.demoService.showNav; 
       this.demoService.createUserPopup = false;   
       this.showpopdetails = !this.showpopdetails;
      // this.selectDefaultInventory = 0;     
       this.createRetailer(retailerInfoMap, retailerForm,this.showpopdetails);
      // this.checkbtn = false;      
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

    createRetailer(retailerInfoMap, retailerForm, showpopview) {
        this.createUserEnabled = false;
         if(this.showpopdetails == false && !this.checkboxValue){
            //this.showpopdetails = true;
            this.demoService.createUserPopup = true;
            this.demoService.createUserMessage=!this.checkboxValue? "Do you want to add default inventory?":"";            
         }
           else if (retailerForm.valid) {
            let userDetailsMap: any = localStorage.getItem("User_Information");
            var role_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].role_id : "";
            var entity_type = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].entity_type : "";
            let postMap = {
                "role_id": role_id,
                "user": {
                    entity_type: "Retailer",
                    user_name: retailerInfoMap.emailId,
                    email: retailerInfoMap.emailId,
                    first_name: retailerInfoMap.firstName,
                    last_name: retailerInfoMap.lastName,
                    role_id: constant.userRoles.retailerAdminUser,
                    phone_number: retailerInfoMap.phoneNumber,
                    retailer_name: retailerInfoMap.retailerName,
                    retailer_address: retailerInfoMap.retailerAddress,
                    isAppCoInvSubscribed : this.checkboxValue ? 1:0
                }
            }
            console.log("select default inventory : " +  this.selectDefaultInventory);
            this.demoService.getSessionToken().subscribe((response) => {
                if (response.getIdToken().getJwtToken()) {
                    const jwt = response.getIdToken().getJwtToken();                   
                    console.log("heree!!!!!")
                    this.createUserEnabled = true;
                    this.demoService.createUser(jwt, postMap, constant.userRoles.superAdminUser).subscribe((response) => {; 
                        
                        this.checkboxValue = false;
                        this.showOrHideCreateEmployee(event);
                        retailerForm.resetForm();
                    },
                    (err) =>{
                        this.checkboxValue = false;
                        this.showOrHideCreateEmployee(event);
                        retailerForm.resetForm();
                    });
                    


                    
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
        this.retailerInfo = {
            "firstName": '',
            "lastName": '',
            "retailerName": '',
            "retailerAddress": '',
            "emailId": '',
            "phoneNumber": ''
        };
        this.demoService.showNav = !this.demoService.showNav;
    }
        
    
}