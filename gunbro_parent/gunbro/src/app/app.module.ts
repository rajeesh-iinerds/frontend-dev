import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER} from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms'; 
import { RouterModule, Routes  } from '@angular/router';

import { AppComponent } from './app.component';
import { DemoComponentComponent } from './demo-component/demo-component.component';
import { DemoService } from './demo-component/demo.service';
import { DashboardComponentComponent } from './dashboard-component/dashboard-component.component';
import { EmployeeComponent } from './employee/employee.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MdSidenavModule} from '@angular/material';
import { ProductSearchComponent } from './product-search/product-search.component';
import { AuthGuard } from './dashboard-component/auth.guard';
import { ProductdetailComponent } from './productdetail/productdetail.component';

const appRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponentComponent,
    
    children: [
      { path: '',  component:  DashboardHomeComponent },
      { path: 'employee', component:  EmployeeComponent},
      { path: 'search', component:  ProductSearchComponent},
       { path: 'productdetail', component:  ProductdetailComponent}
      
      //{ path: 'specs', component: Specs }
    ]
  },
  {
    path: '',
    component: DemoComponentComponent,
    canActivate: [AuthGuard]
  }
];



@NgModule({
  declarations: [
    AppComponent,
    DemoComponentComponent,
    DashboardComponentComponent,
    EmployeeComponent,
    DashboardHomeComponent,
    ProductSearchComponent,
    ProductdetailComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    MdSidenavModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,


      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [
    DemoService,
    AuthGuard,
    ProductSearchComponent,
    DashboardComponentComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
