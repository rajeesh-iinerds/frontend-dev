import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DemoService } from '../demo-component/demo.service';


@Injectable()
export class AuthGuard implements CanActivate {

	/*constructor(private router: Router, private demoService: DemoService){}



  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return true;
  }*/

   	constructor(private demoService: DemoService, private router: Router) {}

   	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
   		return this.checkLogin();
   	}

   	checkLogin(): boolean {
	   	// if (this.demoService.getLoggedInState()) {
	   	if(localStorage.getItem('isLoggedIn') == 'true'){
	   		this.router.navigate(['/dashboard']);
	   		return false;
	   	}
	   	// Navigate to the login page with extras
	   	// this.router.navigate(['']);
	   	return true;
   	}
}
