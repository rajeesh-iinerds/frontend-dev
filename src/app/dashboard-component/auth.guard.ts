
//Auth guard for correct routing logout and role mapping based on cognito
//Author : Krishnendu/praseeda



import {
    Injectable
} from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import {
    Observable
} from 'rxjs/Observable';
import {
    DemoService
} from '../demo-component/demo.service';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private demoService: DemoService, private router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		//Checking the login status
        if (localStorage.getItem('isLoggedIn') && localStorage.getItem('isLoggedIn') == 'true') {
			let roles = route.data ? route.data : {};
			//for logincase checking role,based on role of the login user  routing to the correct path if it is allwed
            let rolesLogin = localStorage.getItem('userGroup') ? localStorage.getItem('userGroup') : 'posuser';
            if (Object.keys(roles).length) {
                for (var roleIndex in roles) {
                    if (roles[roleIndex] == rolesLogin) {
                        return true;
                    }
                }
            } else {
				//if there is no role mentioned for the path
                this.router.navigate(['/dashboard']);
                return true;

            }
        } else {
			//logout functionality
            return true;
		}
		//default
        return false;
    }


}