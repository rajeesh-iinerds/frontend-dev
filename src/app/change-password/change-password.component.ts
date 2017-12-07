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
import {
    DemoService
} from '../demo-component/demo.service';
import {
    Params,
    ActivatedRoute
} from '@angular/router';
import {
    RouterModule,
    Router,
    RouterState
} from '@angular/router';
@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
    userNewPassword: any;
    results_change: any;
    confirmationcode: string;
    userName: string;
    params: any;
  userConfirmPassword: any;
    constructor(private http: Http, public demoService: DemoService, private route: ActivatedRoute, private router: Router) {}
    ngOnInit() {
        this.route.queryParams.subscribe((params: Params) => {
            this.confirmationcode = params['confNo'];
            this.userName = params['uname'];
        });
    }

    changePassword() {
        this.demoService.loading = true;
        let headers = new Headers({});
        let options = new RequestOptions({
            headers: headers
        });
        var reqBody = {
            "confirmationcode": this.confirmationcode,
            "password": this.userNewPassword,
            "userName": this.userName
        }

        const url = 'https://api.appcohesion.io/confirmPwd';
        this.http
            .post(url, reqBody, options)
            .subscribe(data => {
                this.demoService.loading = false;
                this.results_change = data ? data.json() : {};
                //alert("gdfgdfgdfgdf" + JSON.stringify(this.results_change.err));
                if (this.results_change) {
                    if (this.results_change.statusCode == '2000') {
                        alert("Password changed");
                    } else if (this.results_change.Status == "Failure") {
                        if (this.results_change.err) alert(JSON.stringify(this.results_change.err.message));
                    }
                }

            }, error => {
                alert("Error in password changing");
                this.demoService.loading = false;
                console.log(JSON.stringify(error));
            });

    }
}
