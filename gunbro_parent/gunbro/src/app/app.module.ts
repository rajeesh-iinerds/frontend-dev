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
import { DistributorMarkupComponent } from './distributor-markup/distributor-markup.component';
import { RetailerMarkupComponent } from './retailer-markup/retailer-markup.component';
import { RetailerSingleComponent } from './retailer-single/retailer-single.component';
import { DistributorCategoryComponent } from './distributor-category/distributor-category.component';
import { StoreLocationComponent } from './store-location/store-location.component';
import { SearchWidgetComponent } from './search-widget/search-widget.component';
import { SearchWidgetPipe } from './search-widget/search-widget.pipe';
import { SearchProductService } from './product-search/search-product-service';
import { CommonService } from './shared/common.service';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import {MessagePopupComponent} from "./shared/component/message-popup/message-popup.component";
import { OrderPlacementComponent } from './shopping-cart/order-placement/order-placement.component';
import { ShoppingCartService } from './shopping-cart/shopping-cart.service';

const appRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponentComponent,
    
    children: [
      { path: '',  component:  DashboardHomeComponent },
      { path: 'employee', component:  EmployeeComponent,canActivate:[AuthGuard],data:['admin','superadmin','retaileradmin']},
      { path: 'search', component:  ProductSearchComponent,canActivate:[AuthGuard],data:['admin','posuser','retaileradmin']},
      { path: 'productdetail', component:  ProductdetailComponent,canActivate:[AuthGuard],data:['admin','posuser','retaileradmin']},
      { path: 'order', component:  OrdersComponent,canActivate:[AuthGuard],data:['admin','superadmin','retaileradmin','posuser']},
      { path: 'retailer', component: RetailersComponent,canActivate:[AuthGuard],data:['superadmin']},
      { path: 'RetailerMarkup', component: RetailerMarkupComponent,canActivate:[AuthGuard],data:['superadmin']},
      { path: 'RetailerSingle', component: RetailerSingleComponent,canActivate:[AuthGuard],data:['superadmin']},
      { path: 'markup', component:  DistributorMarkupComponent,canActivate:[AuthGuard],data:['admin']},
      { path: 'dist-category', component:  DistributorCategoryComponent,canActivate:[AuthGuard],data:['admin']},
      { path: 'store-location', component:  StoreLocationComponent,canActivate:[AuthGuard],data:['retaileradmin']},
      { path: 'cart', component:  ShoppingCartComponent,canActivate:[AuthGuard],data:['admin','retaileradmin','posuser']},
      { path: 'place-order', component:  OrderPlacementComponent,canActivate:[AuthGuard],data:['admin','retaileradmin','posuser']}
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
    RetailersComponent,
    DistributorMarkupComponent,
    RetailerMarkupComponent,
    RetailerSingleComponent,
    DistributorCategoryComponent,
    StoreLocationComponent,
    SearchWidgetComponent,
    SearchWidgetPipe,
    ShoppingCartComponent,
    MessagePopupComponent,
    OrderPlacementComponent
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
    SearchProductService,
    CommonService,
    AuthGuard,
    ProductSearchComponent,
    DashboardComponentComponent,
    OrdersComponent,
    DistributorMarkupComponent,
    EmployeeComponent,
    MessagePopupComponent,
    ShoppingCartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
