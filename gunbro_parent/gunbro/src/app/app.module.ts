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
import { ProductSearchComponent } from './product-search/product-search.component';
import { AuthGuard } from './dashboard-component/auth.guard';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { OrdersComponent } from './orders/orders.component';
import { RetailersComponent } from './retailers/retailers.component';
//import { DistMarkupComponent } from './dist-markup/dist-markup.component';

const appRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponentComponent,
    
    children: [
      { path: '',  component:  DashboardHomeComponent },
      { path: 'employee', component:  EmployeeComponent},
      { path: 'search', component:  ProductSearchComponent},
      { path: 'productdetail', component:  ProductdetailComponent},
      { path: 'order', component:  OrdersComponent},
      { path: 'retailer', component: RetailersComponent}
      //{ path: 'specs', component: Specs }
    ]
  },
  {
    path: 'forgot',
    component: ForgotPasswordComponent,
    
  },
  {
    path: 'changepwd',
    component: ChangePasswordComponent,
    
},
  {
    path: '',
    component: DemoComponentComponent,
    canActivate: [AuthGuard]
  }

  /*this.productID = route.snapshot.params['id'];
  this.isProdEnvironment = route.snapshot.data[0]['isProd'];*/  
];
@NgModule({
  declarations: [
    AppComponent,
    DemoComponentComponent,
    DashboardComponentComponent,
    EmployeeComponent,
    DashboardHomeComponent,
    ProductSearchComponent,
    ProductdetailComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    OrdersComponent,
    RetailersComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,


       // <-- debugging purposes only
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
