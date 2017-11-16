import {
    Component,
    OnInit
} from '@angular/core';
import {
    Http,
    Headers,
    Response,
    RequestOptions
} from '@angular/http';
import { Location }   from '@angular/common';
import {
    DemoService
} from '../demo-component/demo.service';
import * as constant from '../shared/config';
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
    public ac_email_forgot: any;
    public results_forgot: any;
    showforgetPasswordPopup : boolean = false;
    forgetPasswordMsg: any;
    constructor(private http: Http, public demoService: DemoService,location: Location) {}
    ngOnInit() {}
    sendMailForgot() {  
	   
        this.demoService.loading = true;	
        let headers = new Headers({});
        let options = new RequestOptions({
            headers: headers
        });
        // var reqBody = {this.productsearch_type : this.productsearch_name};
        //this.body[this.productsearch_type] = this.productsearch_name;
        var reqBody = {
            "userPoolId": "us-east-1_Q3sA5af5A",
            "userName": this.ac_email_forgot,
			"domain": location.host,
            "triggerSource": "CustomMessage_AppcoForgotPwd",
            "callerContext": {
                "ClientId": "7iaf7o5ja7su88mjb8du0pqigv"
            },
            "request": {
                "codeParameter": "####"
            },
            "response": {
                "emailMessage": "<custom message to be sent in the message with code parameter>",
                "emailSubject": "<custom email subject>"
            }
        }
        //const url = 'https://api.appcohesion.io/forgotPwd';
        const url = constant.appcohesionURL.forgetPasssword_URL ? constant.appcohesionURL.forgetPasssword_URL : "";
        this.http
            .post(url, reqBody, options)
            .subscribe(data => {
                //this.demoService.loading = false;
                this.results_forgot = data ? data.json() : {};
                
                if (this.results_forgot && this.results_forgot.Status) {
					if(this.results_forgot.err){
                        this.showforgetPasswordPopup = !this.showforgetPasswordPopup;
                        this.forgetPasswordMsg = constant.forgetPasswordMsg.Msg_description ? constant.forgetPasswordMsg.Msg_description : "";
                       // console.log("alert message in forget password : " + this.results_forgot.err.message)
					}
				
                   else if (this.results_forgot.statusCode == '2000') {
                      //  alert("Email Sent");
                        this.forgetPasswordMsg = constant.forgetPasswordMsg.Email_description ? constant.forgetPasswordMsg.Email_description : "";

                    } else if (this.results_forgot.statusCode == '2003') {

                    }
                    //this.router.navigate(['/dashboard/search'],{ queryParams: reqBody});
                }
            }, error => {
               // alert("Email Not Sent");
                this.demoService.loading = false;
                console.log(JSON.stringify(error));
            });
    }
}