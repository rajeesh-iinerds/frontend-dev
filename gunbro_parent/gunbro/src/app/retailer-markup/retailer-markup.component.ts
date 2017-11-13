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
import {FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'app-retailer-markup',
    templateUrl: './retailer-markup.component.html',
    styleUrls: ['./retailer-markup.component.css']
})
export class RetailerMarkupComponent implements OnInit {
    result: any;
    retailerDetails: any;
    retailerList: any;
    allretailerList: any;
    retailerInfo: any = {};
    isPasswordMismatch: Boolean;
    constructor(private http: Http, private router: Router, public demoService: DemoService) { }

    ngOnInit() {
        this.listRetailorDetails().subscribe((response) => {
            console.log("function call retailer detailes : " + JSON.stringify(response));
        },
            (err) => console.error(err)
        );
    }


    // Method for listing retailer details
    listRetailorDetails(): Observable<any> {
        this.retailerList = {};
        return Observable.create(observer => {
            return this.demoService.getSessionToken().subscribe((response) => {
                if (response.getIdToken().getJwtToken()) {
                    const jwt = response.getIdToken().getJwtToken();
                    let headers = new Headers({
                        'Authorization': jwt
                    });
                    let options = new RequestOptions({
                        headers: headers
                    });
                    var req_body = '';
                    const url = constant.appcohesionURL.retailerList_URL;
                    this.http.post(url, req_body, options).subscribe(data => {
                        this.demoService.loading = false;
                        this.result = data.json();
                        if (this.result && this.result.status) {
                            if (this.result.status.code == 200) {
                                this.retailerDetails = this.result.retailers;
                            } else if (this.result.statusCode == constant.statusCode.empty_code) {
                                this.retailerDetails = [];
                            }
                        }
                        observer.next(this.retailerDetails);
                        observer.complete();
                    });
                }
            });
        }, err => {
            console.log("error on order", err)
        })
    }

    // Method for directing the distributor to their corresponding own page
    retailerCategoryList(retailerId) {
        for (var i = 0; i < this.retailerDetails.length; i++) {
            if (this.retailerDetails[i].retailerId == retailerId) {
                this.demoService.setRetailerIdforCategory(retailerId);
                this.router.navigate(['/dashboard/RetailerSingle']);
            } else {
                this.router.navigate(['/dashboard/RetailerMarkup']);
            }
        }
    }
    createRetailer(retailerInfoMap, retailerForm) {
        if (retailerForm.valid) {
            let userDetailsMap:any=localStorage.getItem("User_Information");
            var role_id = localStorage.getItem("User_Information") ? JSON.parse(localStorage.getItem("User_Information"))[0].role_id : "";      
            let postMap= {
                "role_id": role_id,
                "user": {
                    "user_name": retailerInfoMap.emailId,
                    "password": retailerInfoMap.userPassword2,
                    "email": retailerInfoMap.emailId,
                    "first_name": retailerInfoMap.firstName,
                    "last_name": retailerInfoMap.lastName,
                    "role_id": constant.userRoles.retailerAdminUser,
                    "phone_number":retailerInfoMap.phoneNumber
                }
            }
            this.demoService.loading=true;
            this.demoService.getSessionToken().subscribe((response) => {
                if (response.getIdToken().getJwtToken()) {
                    const jwt = response.getIdToken().getJwtToken();
                    //logged user role is third argument
                    this.demoService.createUser(jwt,postMap,constant.userRoles.superAdminUser);
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

}